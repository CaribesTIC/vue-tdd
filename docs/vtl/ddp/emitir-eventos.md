# Emitir Eventos

Puede encontrar el código fuente completo en el repositorio de GitHub bajo [`examples/events`](https://github.com/lmiller1990/design-patterns-for-vuejs-source-code/tree/master/examples/events)

---

La mecánica principal de Vue para pasar datos a los componentes son las propiedades. Por el contrario, cuando los componentes necesitan comunicarse con otro componente superior en la jerarquía, lo hace mediante la emisión de eventos. Esto se hace llamando a `this.$emit()` (Options API) o `ctx.emit()` (Composition API).

Veamos algunos ejemplos de cómo funciona esto y algunas pautas que podemos establecer para mantener las cosas limpias y comprensibles.

## Comenzando Simple

Aquí hay un componente `<Counter>` muy mínimo pero que funciona perfectamente. No es ideal; trabajaremos para mejorarlo durante esta sección.

Este ejemplo comienza con la Options API; eventualmente lo refactorizaremos para usar la Composition API (usando las pruebas que escribimos para asegurarnos de no romper nada).


📃`Counter.vue`
```vue
<template>
  <button role="increment" @click="count += 1" />
  <button role="submit" @click="$emit('submit', count)" />
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>
```
>Un componente de contador simple.

Hay dos botones. Uno incrementa el valor de `count` en 1. El otro emite un evento `submit` con el conteo actual. Escribamos una prueba simple que nos permita refactorizar con confianza.

Al igual que con los otros ejemplos, este usa Testing Library, pero realmente podría usar cualquier framework de prueba; la parte importante es que tenemos un mecanismo que nos avisa si rompemos algo.

📃`__tests__/Counter.spec.js`
```js
import { render, screen, fireEvent } from '@testing-library/vue'
import Counter from '../Counter.vue'

describe('Counter', () => {
  it('emits an event with the current count', async () => {
    const { emitted } = render(Counter)
    await fireEvent.click(screen.getByRole('increment'))
    await fireEvent.click(screen.getByRole('submit'))
    console.log(emitted())
  })
})
```
>Observando los eventos emitidos con `emitted()`.

Hice un console.log (`emitted()`) para ilustrar cómo funciona `emitted` en Testing Library.

Si ejecuta la prueba, la salida de la consola es la siguiente:

```sh
{
  submit: [
    [ 1 ]
  ]
}
```
>Se emitió un evento de envío con un argumento: el número 1.

`emitted` es un objeto: cada evento es una clave y se asigna a un arreglo con una entrada para cada vez que se emitió el evento. `emit` puede tener cualquier cantidad de argumentos; si hubiera escrito `$emit('submit', 1, 2, 3,)` el resultado sería:

```sh
{
  submit: [
    [ 1, 2, 3 ]
  ]
}
```
>Se emitió un evento `submit` con tres argumentos, 1, 2, 3.

Agreguemos una afirmación, antes de pasar al tema principal: patrones y prácticas para emitir eventos.

📃`__tests__/Counter.spec.js`
```js
import { render, screen, fireEvent } from '@testing-library/vue'
import Counter from '../Counter.vue'

describe('Counter', () => {
  it('emits an event with the current count', async () => {
    const { emitted } = render(Counter)

    await fireEvent.click(screen.getByRole('increment'))
    await fireEvent.click(screen.getByRole('submit'))

    expect(emitted().submit[0]).toEqual([1])
  })
})
```
>Hacer una afirmación contra a los eventos emitidos.

## Limpiar Plantillas

Las plantillas a menudo pueden volverse caóticas al pasar propiedades, escuchar eventos y usar directivas. Por esta razón, siempre que sea posible, queremos mantener nuestras plantillas simples moviendo la lógica a la etiqueta `<script>`. Una forma en que podemos hacer esto es evitar escribir `count += 1` y `$emit()` en `<template>`. Hagamos este cambio en el componente `<Counter>`, moviendo la lógica de `<template>` a la etiqueta `<script>` creando dos nuevos métodos:

📃`Counter.vue`
```vue
<template>
  <button role="increment" @click="increment" />
  <button role="submit" @click="submit" />
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.count)
    },
    increment() {
      this.count += 1
    }
  }
}
</script>
```
>Moviendo la lógica del `emit` desde el `<tenplate>` al `<script>`.

Ejecutar la prueba confirma que todo sigue funcionando. Esto es bueno. Las buenas pruebas son resistentes a las refactorizaciones, ya que prueban las entradas y salidas, no los detalles de implementación.

Le recomiendo que evite poner cualquier lógica en `<template>`. Mueve todo a `<script>`. `count += 1` puede parecer lo suficientemente simple como para incluirlo en línea en `<template>`. Dicho esto, personalmente valoro la consistencia por encima de ahorrar algunas pulsaciones de teclas y, por esta razón, puse toda la lógica dentro de `<script>`, sin importar cuán simple sea.

Otra cosa que puede haber notado es el _nombre_ del método que creamos: `submit`. Esta es otra preferencia personal, pero recomiendo tener una buena convención sobre los métodos de nomenclatura. Aquí hay dos que he encontrado útiles.

1. Nombre el método que emite el evento del mismo modo que el nombre del evento. Si está haciendo `$emit('submit')`, también podría nombrar el método que llama a este `'submit'`.
2. Nombra los métodos que llaman a `$this.emit()` o `ctx.emit()` usando la convención `handleXXX`. En este ejemplo, podríamos nombrar la función `handleSubmit`. La idea es que esos métodos manejen las interacciones y emitan el evento correspondiente.

Cuál de estos elijas no es realmente importante; incluso podría elegir otra convención que le guste más. Sin embargo, tener una convención generalmente es algo bueno. ¡La consistencia es el rey!

## Declarción de emits

A partir de Vue 3, puede (y se le anima a) declarar los eventos que emitirá su componente, al igual que declara propiedades. Es una buena manera de comunicar al lector lo que hace el componente. Además, si está utilizando TypeScript, obtendrá un mejor autocompletado y seguridad de escritura.

Si no lo hace, aparecerá una advertencia en la consola del navegador: _"'Component emitted event' but it is neither declared in the emits option nor as an 'prop'"_.

Al declarar los eventos que emite un componente, puede facilitar que otros desarrolladores (o usted mismo dentro de seis meses) entiendan qué hace su componente y cómo usarlo.

Puede declarar eventos de la misma manera que declara propiedades; utilizando la sintaxis de arreglo:

```js
export default {
  emits: ['submit']
}
```
>Declarando `emits` con la sintaxis de arreglo inferior.

O la sintaxis de objeto más detallada pero explícita:

```js
export default {
  emits: {
    submit: (count) => {}
  }
}
```
>Declarandor `emits` con la sintaxis de objetos detallada pero explícita.

Si está utilizando TypeScript, obtendrá una seguridad de tipo aún mejor con esta sintaxis, ¡incluidos los tipos en el _payload_!

La sintaxis del objeto también admite la validación. Como ejemplo, podríamos validar que el _payload para un evento `submit` imaginario sea un número:

```js
export default {
  emits: {
    submit: (count) => {
      return typeof count !== 'string' && !isNaN (count)
    }
  },
}
```
>Validando el evento emitido.

Si el validador devuelve `false`, el evento no se emitirá.

## Validación de Eventos Más Robusta

Dependiendo de su aplicación, es posible que desee tener una validación más exhaustiva. Tiendo a favorecer la programación defensiva; No me gusta correr riesgos, no importa lo improbable que parezca el escenario.

>Quemarse por la falta de programación defensiva y hacer suposiciones como _"esto nunca sucederá en producción"_ es algo que todos han experimentado. Es casi un rito de iniciación. Hay una razón por la cual los desarrolladores más experimentados tienden a ser más cautelosos, escriben código defensivo y escriben muchas pruebas.

También tengo un fuerte énfasis en las pruebas, la separación de preocupaciones y mantener las cosas simples y modulares. Con estas filosofías en mente, extraigamos este validador, hagámoslo más robusto y agreguemos algunas pruebas.

El primer paso es sacar la validación de la definición del componente. Para abreviar, solo voy a exportarlo desde el archivo del componente, pero podría moverlo a otro módulo por completo (por ejemplo, un módulo `validators`).

```html
<script>
export function submitValidator(count) {
  return typeof count !== 'string' && !isNaN (count)
}

export default {
  emits: {
    submit: submitValidator
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.count)
    },
    increment() {
      this.count += 1
    }
  }
}
</script>
```
>Un validador más robusto con una función de validación personalizada.

Está surgiendo otra convención: me gusta llamar a los validadores de eventos `xxxValidator`.

También voy a hacer un cambio en `submitValidator`; el argumento debe ser un número; si no, cosas malas sucederán. Entonces, en lugar de esperar a que sucedan cosas malas, arrojaré un error:

```js
export function submitValidator(count) {
  if (typeof count === 'string' || isNaN (count)) {
    throw Error(`
      Count should be a number.
      Got: ${count}
    `)
  }
  return true
}
```
>Programación defensiva; fallar en voz alta es bueno.

`submitValidator` es simplemente una tradicional función de JavaScript. También es una función pura: su salida depende únicamente de sus entradas. Esto significa que escribir pruebas es trivial:

📃`__tests__/submitValidator.spec.js`
```js
import { submitValidator } from '../Counter.vue'

describe('submitValidator', () => {
  it('throws and error when count isNaN', () => {
    const actual = () => submitValidator('1')
    expect(actual).toThrow()
  })

  it('returns true when count is a number', () => {
    const actual = () => submitValidator(1)
    expect(actual).not.toThrow()
  })
})
```
>Prueba de `submitValidator` de forma aislada.

Muchas de estas validaciones específicas de tipo se pueden mitigar parcialmente con TypeScript. Sin embargo, TypeScript no le dará validación de tiempo de ejecución. Si está utilizando un servicio de registro de errores (como [Sentry](https://sentry.io/)), arrojar un error como este puede brindarle información valiosa para la depuración.


## Con la Composition API

El ejemplo de `<Counter>` usó la Options API. Todos los temas discutidos aquí también se traducen a la Composition API.

Una buena manera de ver si está probando entradas y salidas, a diferencia de los detalles de implementación, es refactorizar su componente de la Options API a la Composition API, o viceversa; Las buenas pruebas son resistentes a la refactorización.

Veamos el refactor:

📃`Counter.vue`
```vue
<template>
  <button role="increment" @click="increment" />
  <button role="submit" @click="submit" />
</template>

<script>
export function submitValidator(count) {
  if (typeof count === 'string' || isNaN (count)) {
    throw Error(`
      Count should be a number.
      Got: ${count}
    `)
  }
  return true
}

import { ref } from 'vue'

export default {
  emits: {
    submit: submitValidator
  },
  setup(props, { emit }) {
    const count = ref(0)

    const increment = () => {
      count.value += 1
    }
    const submit = () => {
      emit('submit', count.value)
    }

    return {
      count,
      increment,
      submit
    }
  }
}
</script>
```
>El componente `<Counter>` completado con validación.

## Con `<script setup>`

Aprovechemos un paso más allá

```vue
<script>
export function submitValidator(count) {
  if (typeof count === 'string' || isNaN (count)) {
    throw Error(`
      Count should be a number.
      Got: ${count}
    `)
  }
  return true
}
</script>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const emit = defineEmits({
  submit: submitValidator
})

const increment = () => {
  count.value += 1
}
const submit = () => {
  emit('submit', count.value)
}
</script>

<template>
  <button role="increment" @click="increment" />
  <button role="submit" @click="submit" />
</template>
```
>Todo sigue pasando, ¡buenas noticias!

## Conclusión

Hablamos sobre la emisión de eventos y las diversas características que ofrece Vue para mantener nuestros componentes limpios y comprobables. También cubrimos algunas de mis convenciones favoritas y las mejores prácticas para mantener las cosas a largo plazo, así como para brindar consistencia a su base de código.

Finalmente, vimos cómo nuestras pruebas se centraron en entradas y salidas (en este caso, la entrada es la interacción del usuario a través de los botones y la salida es el evento `submit` emitido).

Nos referiremos a los eventos nuevamente más adelante, en el capítulo del `v-modelo`, permanezca atento.

Puede encontrar el código fuente completo en el repositorio de GitHub en ejemplos/eventos:
https://github.com/lmiller1990/design-patterns-for-vuejs-source-code.
