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

## 4.2 Clean Templates


