# Probando Eventos Emitidos

A medida que las aplicaciones crecen, la cantidad de componentes también crece. Cuando estos componentes necesitan compartir datos, los componentes secundarios pueden [emitir](https://vuejs.org/api/#vm-emit) un evento y el componente principal responde.

`vue-test-utils` proporciona una API de `emitted` que nos permite hacer afirmaciones sobre eventos emitidos. La documentación para `emitted` se encuentra [aquí](https://test-utils.vuejs.org/api/#emitted).

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/Emitter.spec.js).

## Escribir un Componente y Prueba

Construyamos un componente simple. Cree un componente `<Emitter>` y agregue el siguiente código.

```vue
<template>
  <div>
  </div>
</template>

<script>
  export default {
    name: "Emitter",

    methods: { 
      emitEvent() {
        this.$emit("myEvent", "name", "password")
      }
    }
  }
</script>

<style scoped>
</style>
```

Agregue una prueba llamada `emitEvent`:

```js
import Emitter from "@/components/Emitter.vue"
import { mount } from "@vue/test-utils"

describe("Emitter", () => {
  it("emits an event with two arguments", () => {
    const wrapper = mount(Emitter)

    wrapper.vm.emitEvent()

    console.log(wrapper.emitted())
  })
})
```

Agrega una prueba llamada emitUsando la API [`emitted`](https://test-utils.vuejs.org/api/#emitted) proporcionada por `vue-test-utils`, podemos ver fácilmente los eventos emitidos.

Ejecute la prueba:

```sh
PASS  tests/unit/Emitter.spec.js
● Console

  console.log tests/unit/Emitter.spec.js:10
    { myEvent: [ [ 'name', 'password' ] ] }
```

## Sintaxis emitted

`emitted` devuelve un objeto. Los eventos emitidos se guardan como propiedades en el objeto. Puede inspeccionar los eventos usando `emitted().[event]`:

```js
emitted().myEvent //=>  [ [ 'name', 'password' ] ]
```

Intentemos llamar a `emitEvent` dos veces.

```js
it("emits an event with two arguments", () => {
  const wrapper = mount(Emitter)

  wrapper.vm.emitEvent()
  wrapper.vm.emitEvent()

  console.log(wrapper.emitted().myEvent)
})
```

Ejecute la prueba:

```sh
console.log tests/unit/Emitter.spec.js:11
  [ [ 'name', 'password' ], [ 'name', 'password' ] ]
```

`emitted().emitEvent` devuelve una matriz. Se puede acceder a la primera instancia de `emitEvent` mediante `emitted().emitEvent[0]`. Se puede acceder a los argumentos usando una sintaxis similar, `emitted().emitEvent[0][0]` y así sucesivamente.

Hagamos una afirmación real contra el evento emitido.

```js
it("emits an event with two arguments", () => {
  const wrapper = mount(Emitter)

  wrapper.vm.emitEvent()

  expect(wrapper.emitted().myEvent[0]).toEqual(["name", "password"])
})
```

La prueba pasa.

## Probar eventos sin montar el componente

En ocasiones, es posible que desee probar los eventos emitidos sin montar realmente el componente. Puedes hacer esto usando `call`. Escribamos otra prueba.

```js
it("emits an event without mounting the component", () => {
  const events = {}
  const $emit = (event, ...args) => { events[event] = [...args] }

  Emitter.methods.emitEvent.call({ $emit })

  expect(events.myEvent).toEqual(["name", "password"])
})
```

Dado que `$emit` es solo un objeto de JavaScript, puede simular `$emit` y usar `call` para adjuntarlo a el contexto `this` de `emitEvent`. Al usar `call`, puede llamar a un método sin montar el componente.

El uso de `call` puede ser útil en situaciones en las que tiene un procesamiento pesado en los métodos del ciclo de vida, como `created` y `mounted`, que no desea ejecutar. Dado que no monta el componente, los métodos del ciclo de vida nunca se llaman. También puede ser útil cuando desea manipular el contexto `this` de una manera específica.

En general, no desea llamar al método manualmente como lo estamos haciendo aquí: si su componente emite un evento cuando se hace clic en un botón, entonces probablemente desee hacer `wrapper.find('button').click()` en su lugar. Este artículo es solo para demostrar algunas otras técnicas.

## Conclusión

- La API `emitted` de `vue-test-utils` se usa para hacer afirmaciones contra eventos emitidos.
- `emitted` es un método. Devuelve un objeto con propiedades correspondientes a los eventos emitidos
- Cada propiedad de `emitted` es una matriz. Puede acceder a cada instancia de un evento emitido utilizando la sintaxis de matriz `[0]`, `[1]`.
- Los argumentos de los eventos emitidos también se guardan como matrices y se puede acceder a ellos mediante la sintaxis de matriz `[0]`, `[1]`.
- `$emit` se puede simular usando una llamada, las afirmaciones se pueden hacer sin renderizar el componente.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/Emitter.spec.js).
