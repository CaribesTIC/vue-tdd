# Enviar formularios y emitir eventos

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=Iye52prfleQ&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=7)
:::

Hasta ahora nuestra prueba se ve bastante bien.

```js
// tests/components/myform.spec.js
import { render, screen, fireEvent } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    await fireEvent.update(
      screen.getByLabelText('Name'), 'John'
    )

    expect(button).not.toBeDisabled()   
  })
})
```
Lo siguiente que haremos es enviar el formulario y asegurarnos que se emita el evento correcto.

Esto significa que debemos activar el evento `@submit.prevent`, el cual llamará a un método `submit` que hasta ahora no hemos creado. Así que creemos este método de envio.

Por ahora, solo voy a hacer un `console.log` para asegurarnos que funcione.

```vue{6}
<script setup>
import { ref } from 'vue'

const name = ref("")

const submit = () => console.log("...")
</script>

<template>
  <form @submit.prevent="submit">
    <label for="name">Name</label>
    <input v-model="name" id="name" />
    <button role="button" :disabled="!name.length">Submit</button>
  </form>  
</template>
```

Esto ilustrará un error muy sutil y algo que necesitamos para tener en cuenta.

Guardemos esto y actualicemos nuestra prueba para enviar este formulario. Lo primero que haremos será hacer click en el botón. Hemos visto como usar `fireEven`, así que haremos click en el botón y simplemente vamos a seguir adelante.

```js{20}
// tests/components/myform.spec.js
import { render, screen, fireEvent } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()

    await fireEvent.update(
      screen.getByLabelText('Name'), 'John'
    )

    expect(button).not.toBeDisabled()

    fireEvent.click(button)   
  })
})
```
Es posible que esperemos que el `console.log` se active, guardémoslo y veremos que sucede.

```
...

 √ tests/components/myform.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  1.87s (in thread 129ms, 1453.08%)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Podemos ver aquí, aunque 
