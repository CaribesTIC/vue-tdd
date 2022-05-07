# Simulando la entrada del usuario

## Desencadenando eventos

Una de las cosas más comunes que harán sus componentes Vue es escuchar las entradas del usuario. `vue-test-utils` y Vitest facilitan la prueba de entradas. Echemos un vistazo a cómo usar los simulacros de `trigger` y Vitest para verificar que nuestros componentes funcionan correctamente.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/FormSubmitter.spec.js)

## Creando el componente

Crearemos un componente de formulario simple, `<FormSubmitter>`, que contiene un `<input>` y un `<button>`. Cuando se hace click en el botón, algo debería suceder. El primer ejemplo simplemente revelará un mensaje de éxito, luego pasaremos a un ejemplo más interesante que envía el formulario a un punto final externo.

Cree un `<FormSubmitter>` e ingrese la plantilla:

```html
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" data-username>
      <input type="submit">
    </form>

    <div 
      class="message" 
      v-if="submitted"
    >
      Thank you for your submission, {{ username }}.
    </div>
  </div>
</template>
```
Cuando el usuario envíe el formulario, mostraremos un mensaje de agradecimiento por su envío. Queremos enviar el formulario de forma asincrónica, por lo que estamos usando `@submit.prevent` para evitar la acción predeterminada, que es actualizar la página cuando se envía el formulario.

Ahora agregue la lógica de envío del formulario:

```html
<script>
  export default {
    name: "FormSubmitter",

    data() {
      return {
        username: '',
        submitted: false
      }
    },

    methods: {
      handleSubmit() {
        this.submitted = true
      }
    }
  }
</script>
```

Bastante simple, simplemente configuramos el `submitted` como `true` cuando se envía el formulario, lo que a su vez revela el `<div>` que contiene el mensaje de éxito.

escribir la prueba

Veamos una prueba. Estamos marcando esta prueba como `async` - siga leyendo para averiguar por qué.

```js
import { mount } from "@vue/test-utils"
import FormSubmitter from "@/components/FormSubmitter.vue"

describe("FormSubmitter", () => {
  it("reveals a notification when submitted", async () => {
    const wrapper = mount(FormSubmitter)

    await wrapper.find("[data-username]").setValue("alice")
    await wrapper.find("form").trigger("submit.prevent")

    expect(wrapper.find(".message").text())
      .toBe("Thank you for your submission, alice.")
  })
})
```
Esta prueba es bastante autoexplicativa. Montamos el componente (`mount`), configuramos el _username_ y usamos el método `trigger` que proporciona `vue-test-utils` para simular la entrada del usuario. `trigger` funciona en eventos personalizados, así como en eventos que usan modificadores, como `submit.prevent`, `keydown.enter`, etc.


