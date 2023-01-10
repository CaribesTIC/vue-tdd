# Patrones para Probar Propiedades

En esta sección, exploramos las propiedades y el tipo de pruebas que quizás desee considerar escribir. Esto lleva a un tema mucho más fundamental e importante; trazar una línea clara entre la lógica de negocios y la UI, también conocida como _separación de preocupaciones_, y cómo sus pruebas pueden ayudar a aclarar esta distinción.

>Considere una de las grandes ideas detrás de frameworks como Vue y React:
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

>Esta no es una función pura porque se basa en un recurso externo, en este caso, una API y una base de datos. Dependiendo de lo que haya en la base de datos cuando se llame, podríamos obtener un resultado diferente. Es impredecible.

¿Cómo se relaciona esto con las propiedades? Piense en un componente que decida qué representar en función de sus propiedades (no se preocupe por los datos, el cálculo o la configuración por ahora, pero se aplican las mismas ideas). Si piensa en un componente como una función y las propiedades como argumentos, se dará cuenta de que, dados las mismas propiedades, el componente siempre representará lo mismo. Su salida es determinista. Dado que usted decide qué propiedades se pasan al componente, es fácil probarlo, ya que conocemos todos los estados posibles en los que puede estar el componente.

## Los fundamentos

Puede declarar propiedades de varias maneras. Trabajaremos con el componente `<Message>` para este ejemplo.

📃`Message.vue`
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
Declarar un accesorio `variant` con la sintaxis de arreglo inferior.

En este ejemplo, declaramos propiedades utilizando la sintaxis de arreglo: `props: ['variant']`. Es recomendable evitar la sintaxis de arreglo. El uso de la sintaxis de objeto le da al lector más información sobre el tipo de valores que puede tomar la `variant`.
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
Declarar una propiedad `variant` con la sintaxis de objeto superior.

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
>Una variante fuertemente tipada usando TypeScript.

En nuestro ejemplo de `<Message>`, estamos trabajando con JavaScript normal, por lo que no podemos especificar cadenas específicas para las variantes de accesorios como puede hacerlo en TypeScript. Sin embargo, hay algunos otros patrones que podemos usar.

Hemos especificado que se requiere el accesorio `variant` y nos gustaría aplicar un subconjunto específico de valores de cadena que puede recibir. Vue nos permite validar propiedades usando una clave de validación. Funciona así:

📃`Message.vue`
```vue{8,9,10,11,12,13}
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
Los validadores de propiedades son funciones. Si devuelven `false`, Vue mostrará una advertencia en la consola.

>¡Los validadores de propiedades son como la función de suma de la que hablamos anteriormente en el sentido de que son funciones puras! Eso significa que son fáciles de probar: dada la propiedad `X`, el validador debería devolver el resultado `Y`.

Antes de agregar un validador, escribamos una prueba simple para el componente `<Message>`. Queremos probar entradas y salidas. En el caso de `<Message>`, la propiedad `variant` es la entrada y lo que se representa es la salida. Podemos escribir una prueba para afirmar que se aplica la clase correcta usando **Testing Library** y el atributo `classList`:

📃`__tests__/Message.spec.js`
```js
import { render } from '@testing-library/vue'
import Message from '../Message.vue'

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
>La prueba de la propiedad se aplica a la clase.

Esto verifica que todo funcione como se esperaba cuando se pasa una propiedad de `variant` válida a `<Message>`. ¿Qué pasa cuando se pasa una `variant` no válida?

Queremos restringir el uso del componente `<Message>` con una `variant` válida. Este es un buen caso de uso para un validador.

## Agregar un validador

Actualicemos la propiedad `variant` para tener un validador simple:

📃`Message.vue`
```vue{8,9,10,11,12,13,14,15,16,17,18,19,20,21}
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
>Si `variant` no es válido, lanzamos un error.

Ahora obtendremos un error si se pasa una propiedad no válida. Una alternativa sería simplemente devolver `false` en lugar de arrojar un error; esto solo le dará una advertencia en la consola a través de `console.warn`. Los errores fuertes y claros cuando un componente no se usa correctamente quedan más protegidos.

**¿Cómo probamos el validador?** Si queremos cubrir todas las posibilidades, necesitamos 4 pruebas; uno para cada tipo de `variant` y otro para un tipo no válido.

>Es preferible probar los validadores de propiedades de forma aislada. Dado que los validadores son generalmente funciones puras, son fáciles de probar. Tambien hay otra razón por la que se prueban los validadores de propiedades, el aislamiento, del que hablaremos después de escribir la prueba.

Para permitir probar el aislamiento del validador, necesitamos refactorizar `<Message>` un poco para separar el validador del componente:

📃`Message.vue`
```vue{6,7,8,9,10,11,12,13,14,15,16,22}
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
>Exportando el validador por separado al componente.

Genial, `validarVariant` ahora se exporta por separado y es fácil de probar:

📃`__tests__/Message.spec.js`
```js{2,16,17,18,22}
import { render } from '@testing-library/vue'
import Message,{ validateVariant } from '../Message.vue'

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
    ['success', 'warning', 'error'].forEach(variant => {
      expect(() => validateVariant(variant)).not.toThrow()
    })
  })
  
  it('throws error for invalid variant prop', () => {
    expect(() => validateVariant('invalid')).toThrow()
  })
})
```
>Probando todos los casos para el validador.

El simple hecho de hacer que `validateVariant` sea una función separada que se exporte puede parecer un cambio pequeño, pero en realidad es una gran mejora. Al hacerlo, pudimos escribir pruebas para `validateVariant` con facilidad. Podemos estar seguros de que el componente `<Message>` solo se puede usar con un `variant` válido.
Si el desarrollador pasa una propiedad inválida, recibe un mensaje claro y agradable en la consola::

```sh
Uncaught Error: variant is required and must be either 'success', 'warning' or 'error'.` You passed: asdf 
```
>¡Error! La variante proporcionada no es válida.

He aquí el mismo ejemplo con Vue Test Utils:

📃`__tests__/Message.spec.js`
```js
import { mount } from '@vue/test-utils'
import Message,{ validateVariant } from '../Message.vue'

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
    ['success', 'warning', 'error'].forEach(variant => {
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

Para que esto quede más claro, imagina que tu empresa se especializa en sistemas de diseño. Tienes algunos diseñadores que probablemente usan [Figma](https://www.figma.com/) o [Sketch](https://www.sketch.com/) para diseñar cosas como botones y mensajes.

Han decidido admitir tres variantes de mensajes: _success_, _warning_ y _error_. Eres un desarrollador front-end. En este ejemplo, está trabajando en la integración de Vue - escribirá componentes de Vue que aplican clases específicas, que utilizan el CSS que proporcionó por los diseñadores.

En el futuro, también deberá crear componentes React y Angular utilizando el mismo CSS y las mismas pautas. Las tres integraciones podrían hacer uso de la función `validateVariant` y probar. Es la lógica de negocios central.

Esta distinción es importante. Cuando usamos los métodos de _Testing Library_ (como el `render`) y las API DOM (como `classList`), verificamos que la capa de la UI de Vue funcione correctamente. La prueba de `validateVariant` es para nuestra lógica de negocios. Estas diferencias a veces se denominan _preocupaciones_. Una pieza de código se refiere a la UI. El otro se ocupa de la lógica de negocios.

Separarlos es bueno. Hace que su código sea más fácil de probar y mantener. Este concepto se conoce como _separación de preocupaciones_. Revisaremos esto a lo largo de este contenido.

>**Si desea saber si algo es parte de la UI o la lógica de negocios, pregúntese esto: "si cambiara a React, ¿podría reutilizar este código y probarlo?".**

En este caso, podría reutilizar el validador y su prueba cuando escriba la integración de React. El validador se preocupa por la lógica de negocios y no sabe nada sobre el framework de la UI. Vue o React, solo admitiremos tres variantes de mensajes: _success_, _warning_ y _error_. El componente y la prueba del componente (donde afirmamos usar `classes()`) tendrían que reescribirse usando un componente React y una biblioteca de pruebas React.

Idealmente, no desea que su lógica de negocios se acople a su framework de trabajo de elección; Los framework van y vienen, pero es poco probable que los problemas que su negocio está resolviendo cambien significativamente.

He visto que la separación deficiente de las preocupaciones le cuesta a las empresas decenas de miles de dólares; llegan a un punto en el que agregar nuevas funciones es arriesgado y lento, porque el problema principal de su negocio está demasiado relacionado con la UI. Reescribir la UI significa reescribir la lógica de negocios.

## Separación de Preocupaciones - Caso de Estudio

Un ejemplo de separación deficiente de las preocupaciones que cuestan a una organización fue una aplicación en la que trabajé para un proveedor de componentes eléctricos. Tenían una aplicación que los clientes usarían para obtener una cotización aproximada del precio de los componentes. El proceso de pedido era bastante complejo: tenía que pasar por un formulario con varios pasos y los valores del paso anterior afectarían los campos del paso siguiente.

La aplicación se escribió usando jQuery (que no está mal. Ningún marco es malo, solo si se usan incorrectamente). Toda la lógica de negocios se mezcló con la lógica de la UI (esta es la parte mala). Tenían un modelo de descuento basado en la cantidad: "Si compra más de 50 resistencias, aplique un descuento X, de lo contrario Y" - este tipo de cosas. Decidieron pasar a algo un poco más moderno: la UI estaba muy anticuada y no era compatible con dispositivos móviles en absoluto. La complejidad del código jQuery era alta y el código era un desastre.

No solo tuve que volver a escribir toda la capa de la UI (que era para lo que me pagaron), sino que también tuve que volver a escribir o extraer la gran mayoría de la lógica de negocios desde el código jQuery. Esta misión de búsqueda y extracción hizo que la tarea fuera mucho más difícil y arriesgada de lo que debería haber sido: en lugar de solo actualizar la capa de la UI, también tuve que sumergirme y aprender su modelo comercial y de precios (que terminó tomando mucho más tiempo y cuesta mucho más de lo que probablemente debería).

Aquí hay un ejemplo concreto usando el escenario del mundo real anterior. Digamos que una resistencia (un tipo de componente eléctrico) cuesta $0,60. Si compras más de 50, obtienes un 20% de descuento. El código base de jQuery se parecía a esto:

```js
const $resistorCount = $('#resistors-count')
$resistorCount.change((event) => {
  const amount = parseInt (event.target.value)
  const totalCost = 0.6 * amount
  const $price = $("#price")
  if (amount > 50) {
    $price.value(totalCost * 0.8)
  } else {
    $price.value(totalCost)
  }
})
```

Debe observar con mucho cuidado para descubrir dónde termina la UI y comienza el negocio. En este escenario, quería cambiarme a Vue, la herramienta perfecta para una forma altamente dinámica y reactiva. Tuve que profundizar en el código base y descubrir esta parte central de la lógica de negocios, extraerla y reescribirla con algunas pruebas (por supuesto, el código base anterior no tenía pruebas, como muchas bases de código de principios de la década de 2000). ¡Este viaje de búsqueda, extracción, aislamiento y reescritura está lleno de riesgos y la posibilidad de cometer un error o perderse algo es muy alta! Lo que hubiera sido mucho mejor es si la lógica de negocios y la UI se hubieran separado:

```js
const resistorPrice = 0.6
function resistorCost(price, amount) {
  if (amount > 50) {
    return price * amount * 0.8
  } else {
    return price * amount
  }
}

$resistorCount.change((event) => {
  const amount = parseInt (event.target.value)
  $("#price").value = resistorCost(resistorPrice, amount)
})
```

El segundo es muy superior. Puede ver dónde termina la lógica de negocios y comienza la UI: están literalmente separados en dos funciones diferentes. La estrategia de precios es clara: un descuento por cualquier cantidad superior a 50. También es muy fácil probar la lógica de negocios de forma aislada. Si llega el día en que decide que su marco de trabajo de elección ya no es apropiado, es trivial cambiar a otro marco: sus pruebas de unidad de lógica de negocios pueden permanecer sin cambios y sin tocar, y es de esperar que también tenga algunas pruebas de navegador de extremo a extremo para mantenerlo a salvo.

Pasarse a Vue es trivial: tampoco es necesario tocar la lógica de negocios:

```vue
<template>
  <input v-model="amount" />
  <div>Price: {{ totalCost }}</div>
</template>

<script>
import { resistorCost, resistorPrice } from './logic.js'
export default {
  data() {
    return {
      amount: 0
    }
  },
  computed: {
    totalCost() {
      return resistorCost(resistorPrice, this.amount)
    }
  }
}
</script>
```
>Comprender e identificar las diferentes preocupaciones en un sistema y estructurar correctamente las aplicaciones es la diferencia entre buenos ingenieros y grandes ingenieros.

## Otro Ejemplo

Suficiente filosofía de diseño por ahora. Veamos otro ejemplo relacionado con `props.` Este ejemplo usa el componente `<Navbar>`. Puede encontrarlo en [`examples/props/navbar.vue`](https://github.com/lmiller1990/design-patterns-for-vuejs-source-code/blob/master/examples/props/Navbar.vue). Se parece a esto:

📃`Navbar.vue`
```vue
<template>
  <button v-if="authenticated">Logout</button>
  <button v-if="!authenticated">Login</button>
</template>

<script>
export default {
  props: {
    authenticated: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

El componente `Navbar` tiene una `props` llamada `authenticated` que es `false` por `default`.

>Antes incluso de ver la prueba, está claro que necesitamos dos pruebas para cubrir todos los casos de uso. La razón por la que esto queda claro de inmediato es que la propiedad `authenticated` es un `Boolean`, que solo tiene dos valores posibles.

La prueba no es especialmente interesante (¡pero la discusión que sigue sí lo es!):

📃`__tests__/Navbar.spec.js`
```js
import { render, screen } from '@testing-library/vue'
import Navbar from '../Navbar.vue'

describe('Navbar', () => {
  it('shows logout when authenticated is true', () => {
    render(Navbar, {
      props: {
        authenticated: true
      }
    })

    // getByText will throw an error if it cannot find the element.
    screen.getByText('Logout')
  })

  it('shows login by default', () => {
    render(Navbar)
    screen.getByText('Login')
  })
})
```
>Prueba el comportamiento del `Navbar` para todos los valores de `authenticated`.

Lo único que cambia según el valor de `authenticated` es el texto del botón. Dado que el valor `default` es `false`, no necesitamos pasarlo como `props` en la segunda prueba.

Podemos refactorizar un poco con una función `renderNavbar`:

📃`__tests__/Navbar.spec.js`
```js
describe('Navbar', () => {
  function renderNavbar(props) {
    render(Navbar, {
      props
    })
  }
  
  it('shows login authenticated is true', () => {
    renderNavbar({ authenticated: true })
    screen.getByText('Logout')
  })
  
  it('shows logout by default', () => {
    renderNavbar()
    screen.getByText('Login')
  })
})
```
>Pruebas más concisas.

Me gusta más esta versión de la prueba. Puede parecer un poco superficial para una prueba tan simple, pero a medida que sus componentes se vuelven más complejos, tener una función para abstraer parte de la complejidad puede hacer que sus pruebas sean más legibles.

>También eliminé la nueva línea entre la representación del componente y la afirmación. Por lo general, no dejo líneas nuevas en mis pruebas cuando son tan simples. Cuando se vuelven más complejos, me gusta dejar algo de espacio, creo que lo hace más legible. Este es solo mi enfoque personal. Lo importante no es tu estilo de código, sino que estás escribiendo pruebas.

Aunque técnicamente hemos cubierto todos los casos, me gustaría agregar el tercer caso:
donde `authenticated` se establece explícitamente en `false`.

📃`__tests__/Navbar.spec.js`
```js
describe('Navbar', () => {
  function renderNavbar(props) {
    render(Navbar, {
      props
    })
  }

  it('shows login authenticated is true', () => {
    // ...
  })

  it('shows logout by default', () => {
    // ...
  })

  it('shows login when authenticated is false', () => {
    renderNavbar({ authenticated: false })
    screen.getByText('Login')
  })
})
```

>Agregar una tercera prueba para ser explícito.

Esto, por supuesto, pasa. Me gusta mucho la simetría que exhiben las tres pruebas, mostrando los tres casos de una manera tan concisa.

Repasemos la idea de la separación de preocupaciones; ¿Es esta una prueba de UI o una prueba de lógica de negocios? Si moviéramos el framework, ¿podríamos reutilizar esta prueba?

La respuesta es no: necesitaríamos escribir una nueva prueba (para trabajar con React y su integración con la biblioteca de pruebas). Esto está bien, solo significa que esta parte de nuestro código base es parte de la capa de la UI, no nuestra lógica de negocios central. Nada que extraer.

## La verdadera prueba: ¿Se refactoriza?

Podemos hacer una pequeña verificación de cordura y asegurarnos de que nuestras pruebas no estén probando detalles de implementación. Los detalles de implementación se refieren a _cómo_ funciona algo. Al realizar pruebas, no nos importan los detalles de cómo funciona algo. En cambio, nos preocupamos por lo _qué_ hace y si lo hace correctamente. Recuerde, debemos probar que obtenemos el resultado esperado en función de las entradas dadas. En este caso, queremos probar que el texto correcto se represente en función de los datos, sin preocuparnos demasiado por cómo se implementa realmente la lógica.

Podemos validar esto refactorizando el componente `<Navbar>`. Mientras las pruebas continúen, podemos estar seguros de que son resistentes a los refactores y están probando comportamientos, no detalles de implementación.

```vue
<template>
  <button>
    {{ `${authenticated ? 'Logout' : 'Login'}` }}
  </button>
</template>

<script>
export default {
  props: {
    authenticated: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

Refactorizando `Navbar`. ¡El comportamiento sigue siendo el mismo!

¡Todo todavía pasa! Nuestras pruebas están haciendo lo que se supone que deben hacer. ¿O son? ¿Qué pasa si decidimos que nos gustaría usar una etiqueta `<a>` en lugar de un `<button>`?

```vue
<template>
  <a>
    {{ `${authenticated ? 'Logout' : 'Login'}` }}
  </a>
</template>

<script>
export default {
  props: {
    authenticated: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

Usar una etiqueta de anclaje en lugar de un botón.

Obviamente, en un sistema real se requeriría una propiedad `href` y cambiaría dependiendo de `authenticated`, pero eso no es en lo que nos estamos enfocando aquí. Todavía pasa. ¡Una gran noticia! Nuestras pruebas sobrevivieron a dos refactorizaciones; esto significa que estamos probando el comportamiento, no los detalles de implementación, lo cual es bueno.

He aquí el mismo ejemplo con Vue Test Utils:

```js
import { mount } from '@vue/test-utils'
import Navbar from '@/Navbar.vue'

describe('Navbar', () => {
  function navbarFactory(props) {
    return mount(Navbar, {
      props
    })
  }

  it('shows login authenticated is true', () => {
    const wrapper = navbarFactory({ authenticated: true })
    expect(wrapper.html()).toContain('Logout')
  })

  it('shows logout by default', () => {
    const wrapper = navbarFactory()
    expect(wrapper.find('a').text()).toBe('Login')
  })

  it('shows login when authenticated is false', () => {
    const wrapper = navbarFactory({ authenticated: false })
    expect(wrapper.find('a').text()).toBe('Login')
  })
})
```

## Conclusión

Este capítulo discutió algunas técnicas para probar propiedades. También vimos cómo usar el método `render` de Testing Library para probar componentes. Hablamos del concepto de _separación de preocupaciones_ y de cómo puede hacer que su lógica de negocios sea más comprobable y sus aplicaciones más fáciles de mantener. Finalmente, vimos cómo las pruebas pueden permitirnos refactorizar el código con confianza.
