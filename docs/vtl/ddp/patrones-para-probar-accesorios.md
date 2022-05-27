# Patrones para Probar Accesorios

En esta sección, exploramos los accesorios y el tipo de pruebas que quizás desee considerar escribir. Esto lleva a un tema mucho más fundamental e importante; trazar una línea clara entre la lógica de negocios y la UI, también conocida como _separación de preocupaciones_, y cómo sus pruebas pueden ayudar a aclarar esta distinción.

>Considere una de las grandes ideas detrás de marcos como Vue y React:
**_"Su interfaz de usuario es una función de sus datos"_.**

Esta idea viene en muchas formas; otro es _"interfaces impulsadas por datos"_. Básicamente, su interfaz de usuario (UI) debe estar determinada por los datos presentes. Dados los datos `X`, su UI debería ser `Y`. En informática, esto se conoce como determinismo.
Tome esta función de suma por ejemplo:

```js
function sum(a, b) {
  return a + b
}
```
Una función de suma simple. Es una función pura.

Cuando se llama con el mismo valor para `a` y `b`, siempre obtienes el mismo resultado. El resultado está predeterminado. Es _determinista_. Un ejemplo de una función impura sería esta:

```js
async function fetchUserData(userId) {
  return axios.get(`/api/users/${userId}`)
}
```
Una función impura - tiene un efecto secundario. No es lo ideal, pero es necesario para que la mayoría de los sistemas hagan algo útil.

Esta no es una función pura porque se basa en un recurso externo, en este caso, una API y una base de datos. Dependiendo de lo que haya en la base de datos cuando se llame, podríamos obtener un resultado diferente. Es impredecible.

¿Cómo se relaciona esto con los accesorios? Piense en un componente que decida qué representar en función de sus accesorios (no se preocupe por los datos, el cálculo o la configuración por ahora, pero se aplican las mismas ideas). Si piensa en un componente como una función y los accesorios como argumentos, se dará cuenta de que, dados los mismos accesorios, el componente siempre representará lo mismo. Su salida es determinista. Dado que usted decide qué accesorios se pasan al componente, es fácil probarlo, ya que conocemos todos los estados posibles en los que puede estar el componente.

## Los fundamentos

Puede declarar accesorios de varias maneras. Trabajaremos con el componente `<Message>` para este ejemplo.

```vue
<template>
  <div :class="variant">Message</div>
</template>

<script>
export default {
  // can be 'success', 'warning', 'error'
  props: ['variant']
}
</script>
```
Declarar un accesorio `variant` con la sintaxis de matriz inferior.

En este ejemplo, declaramos accesorios utilizando la sintaxis de matriz: `props: ['variant']`. Es recomendable evitar la sintaxis de matriz. El uso de la sintaxis de objeto le da al lector más información sobre el tipo de valores que puede tomar la variante.
```js
export default {
  props: {
    variant: {
      type: String,
      required: true
    }
  }
}
```
Declarar un accesorio `variant` con la sintaxis de objeto superior.

Si está utilizando TypeScript, aún mejor: cree un tipo:

```ts
type Variant = 'success' | 'warning' | 'error'

export default {
  props: {
    variant: {
      type: String as () => Variant,
      required: true
    }
  }
}
```
Una variante fuertemente tipada usando TypeScript.

En nuestro ejemplo de `<Message>`, estamos trabajando con JavaScript normal, por lo que no podemos especificar cadenas específicas para las variantes de accesorios como puede hacerlo en TypeScript. Sin embargo, hay algunos otros patrones que podemos usar.

Hemos especificado que se requiere el accesorio `variant` y nos gustaría aplicar un subconjunto específico de valores de cadena que puede recibir. Vue nos permite validar accesorios usando una clave de validación. Funciona así:

```vue{9,10,11,12,13}
<template>
  <div :class="variant">Message! {{ variant }}?</div>
</template>

<script>
export default {
  props: {
    variant: {
      validator: (val) => {
        // if we return true, the prop is valid.
        // if we return false, a runtime warning will be shown.
      }
    }
  }
}
</script>
```
Los validadores de accesorio son funciones. Si devuelven `false`, Vue mostrará una advertencia en la consola.

¡Los validadores de accesorio son como la función de suma de la que hablamos anteriormente en el sentido de que son funciones puras! Eso significa que son fáciles de probar: dada la propiedad `X`, el validador debería devolver el resultado `Y`.

Antes de agregar un validador, escribamos una prueba simple para el componente `<Message>`. Queremos probar entradas y salidas. En el caso de `<Message>`, el accesorio `variant` es la entrada y lo que se representa es la salida. Podemos escribir una prueba para afirmar que se aplica la clase correcta usando Testing Library y el atributo `classList`:

```js
import { render } from '@testing-library/vue'
import Message from '@/Message.vue'

describe('Message', () => {
  it('renders variant correctly when passed', () => {
    const { container } = render(Message, {
      props: {
        variant: 'success'
      }
  })
  
  expect(container.firstChild.classList).toContain(['success'])
  })
})
```
La prueba del accesorio se aplica a la clase.

Esto verifica que todo funcione como se esperaba cuando se pasa una propiedad de variante válida a `<Message>`. ¿Qué pasa cuando se pasa una variante no válida? Queremos prohibir el uso del componente `<Message>` con una variante válida. Este es un buen caso de uso para un validador.

## Agregar un validador

Actualicemos el accesorio `variant` para tener un validador simple:
```vue{8,9,10,11,12,13,14,15,16,17,18,19,20,21,22}
<template>
  <div :class="variant">Message! {{ variant }}?</div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator: (variant) => {
        if (!['success', 'warning', 'error'].includes(variant)) {
          throw Error(
            `variant is required and must` +
            `be either 'success', 'warning' or 'error'.` +
            `You passed: ${variant}`
          )
        }
        return true
      }
    }
  }
}
</script>
```
Si `variant` no es válido, lanzamos un error.

Ahora obtendremos un error si se pasa una propiedad no válida. Una alternativa sería simplemente devolver `false` en lugar de arrojar un error; esto solo le dará una advertencia en la consola a través de `console.warn`. Los errores fuertes y claros cuando un componente no se usa correctamente quedan más protegidos.

¿Cómo probamos el validador? Si queremos cubrir todas las posibilidades, necesitamos 4 pruebas; uno para cada tipo de `variant` y otro para un tipo no válido.

Es preferible probar los validadores de accesorios de forma aislada. Dado que los validadores son generalmente funciones puras, son fáciles de probar. Tambien hay otra razón por la que se prueban los validadores de accesorios, el aislamiento, del que hablaremos después de escribir la prueba.

Para permitir probar el aislamiento del validador, necesitamos refactorizar `<Message>` un poco para separar el validador del componente:

```vue{6,7,8,9,10,11,12,13,14,15,16,23}
<template>
  <div :class="variant">Message! {{ variant }}?</div>
</template>

<script>
export function validateVariant(variant) {
  if (!['success', 'warning', 'error'].includes(variant)) {
    throw Error(
      `variant is required and must` +
      `be either 'success', 'warning' or 'error'.` +
      `You passed: ${variant}`
    )
  }
  return true
}

export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator: validateVariant
    }
  }
}
</script>
```
Exportando el validador por separado al componente.

Genial, `validarVariant` ahora se exporta por separado y es fácil de probar:

```js{2,16,17,18,19,20,22,23,24}
import { render } from '@testing-library/vue'
import Message,{ validateVariant } from '@/Message.vue'

describe('Message', () => {
    it('renders variant correctly when passed', () => {
    const { container } = render(Message, {
      props: {
        variant: 'success'
      }
  })
  
  expect(container.firstChild.classList).toContain(['success'])
  })
  
  it('validates valid variant prop', () => {
    ;['success', 'warning', 'error'].forEach(variant => {
      expect(() => validateVariant(variant)).not.toThrow()
    })
  })
  
  it('throws error for invalid variant prop', () => {
    expect(() => validateVariant('invalid')).toThrow()
  })
})
```
Probando todos los casos para el validador.

El simple hecho de hacer que `validateVariant` sea una función separada que se exporte puede parecer un cambio pequeño, pero en realidad es una gran mejora. Al hacerlo, pudimos escribir pruebas para `validateVariant` con facilidad. Podemos estar seguros de que el componente `<Message>` solo se puede usar con un `variant` válido.
Si el desarrollador pasa una propiedad inválida, recibe un mensaje claro y agradable en la consola::

```
Uncaught Error: variant is required and must be either 'success', 'warning' or 'error'.` You passed: asdf 
```
¡Error! La variante aprobada no es válida.

He aquí el mismo ejemplo con Vue Test Utils:

```js
import { mount } from '@vue/test-utils'
import Message,{ validateVariant } from '@/Message.vue'

describe('Message', () => {
  it('renders variant correctly when passed', () => {
    const wrapper = mount(Message, {
      props: {
        variant: 'success'
      }
    })

    expect(wrapper.classes()).toContain('success')
  })

  it('validates valid variant prop', () => {
    ;['success', 'warning', 'error'].forEach(variant => {
      expect(() => validateVariant(variant)).not.toThrow()
    })
  })

  it('throws error for invalid variant prop', () => {
    expect(() => validateVariant('invalid')).toThrow()
  })
})
```

## Concepto Clave: Separación de Preocupaciones

Hemos escrito dos tipos diferentes de pruebas. La primera es una prueba de UI - en la que hacemos afirmaciones contra `classList`. El segundo es para el validador. Pone a prueba la lógica de negocios.

Para que esto quede más claro, imagina que tu empresa se especializa en sistemas de diseño. Tienes algunos diseñadores que probablemente usan Figma o Sketch para diseñar cosas como botones y mensajes.

Han decidido admitir tres variantes de mensajes: _success_, _warning_ y _error_. Eres un desarrollador front-end. En este ejemplo, está trabajando en la integración de Vue - escribirá componentes de Vue que aplican clases específicas, que utilizan el CSS que proporcionó por los diseñadores.

En el futuro, también deberá crear componentes React y Angular utilizando el mismo CSS y las mismas pautas. Las tres integraciones podrían hacer uso de la función `validateVariant` y probar. Es la lógica de negocios central.

Esta distinción es importante. Cuando usamos los métodos de _Testing Library_ (como el `render`) y las API DOM (como `classList`), verificamos que la capa de la UI de Vue funcione correctamente. La prueba de `validateVariant` es para nuestra lógica de negocios. Estas diferencias a veces se denominan _preocupaciones_. Una pieza de código se refiere a la UI. El otro se ocupa de la lógica de negocios.

Separarlos es bueno. Hace que su código sea más fácil de probar y mantener. Este concepto se conoce como _separación de preocupaciones_. Revisaremos esto a lo largo de este contenido.

Si desea saber si algo es parte de la UI o la lógica de negocios, pregúntese esto: "si cambiara a React, ¿podría reutilizar este código y probarlo?".

En este caso, podría reutilizar el validador y su prueba cuando escriba la integración de React. El validador se preocupa por la lógica de negocios y no sabe nada sobre el marco de la UI. Vue o React, solo admitiremos tres variantes de mensajes: _success_, _warning_ y _error_. El componente y la prueba del componente (donde afirmamos usar `classes()`) tendrían que reescribirse usando un componente React y una biblioteca de pruebas React.

Idealmente, no desea que su lógica de negocios se acople a su marco de trabajo de elección; Los marcos van y vienen, pero es poco probable que los problemas que su negocio está resolviendo cambien significativamente.

He visto que la separación deficiente de las preocupaciones le cuesta a las empresas decenas de miles de dólares; llegan a un punto en el que agregar nuevas funciones es arriesgado y lento, porque el problema principal de su negocio está demasiado relacionado con la UI. Reescribir la UI significa reescribir la lógica de negocios.

## Separation of Concerns - Case Study
