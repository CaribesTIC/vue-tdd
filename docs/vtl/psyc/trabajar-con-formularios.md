# Trabajar con Formularios

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=rnbji86I0PQ&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=6)
:::

Ahora veremos las diversas maneras que nos tiene la API de Vue Testing Libray para probar formularios.

Supongamos que nuestro `@/components/MyForm.vue` luce de la siguiente forma.

```vue
<script setup>
import { ref } from 'vue'

const name = ref("")
</script>

<template>
  <form @submit.prevent="submit">
    <label for="name">Name</label>
    <input v-model="name" id="name" />
    <button role="button" :disabled="!name.length">Submit</button>
  </form>
</template>
```
Empezamos con tener una variable reactiva llamada `name` inicializada en `""`.

Luego, tenemos un `@submit.prevent` que invocará a un método llamado `submit`, seguido de un `label` para `name` y su respectivo `input` vinculado a su variable reactiva `name`, junto con la propiedad `id` establecida con `name`.

Por último, un `button` de envio que dice `Submit`, con el `role` de `"button"` porque obviamente esta es su función. También deshabilitaremos este botón, para que no se pueda enviar el formulario a menos que el usuario haya escrito su nombre. Si `name` no tiene `length` estará `disabled`, y cuando el usuario ingrese su nombre se habilitará el este botón.

Veamos ahora cómo podemos escribir esta prueba. En el correspondiente archivo partiremos de lo más básico.

```js
// tests/components/myform.spec.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)   
  })
  
  // screen...
})
```

Lo primero que hay que probar es que hay un botón deshabilitado, por lo que debemos antes seleccionarlo.

Así que para ello podemos usar `getByRole`, pasando como primer argumento `"button"` y luego (para buscar el botón específico) pasamos un objeto con `name` en `"Submit"` como segundo argumento. Es decir, primero buscará el `role="button"` y luego verificará que diga `Submit`.


```js{10,11}
// tests/components/myform.spec.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    screen.getByRole("button", {name: "Submit"})   
  })
})
```
Esta es una manera de seleccionar elementos que funciona muy bien. Y podemos probarlo agregando cualquier cosa dentro de la propiedad `name` del  objeto del segundo argumento.

```js{10,11}
// tests/components/myform.spec.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    screen.getByRole("button", {name: "asdfSubmit"})   
  })
})
```
Guarde y observará que la prueba fallará.

```
❯ tests/components/myform.spec.js:10:12
      8|     render(MyForm)
      9|                                                                                                                             
     10|     screen.getByRole("button", {name: "asdfSubmit"})                                                                        
       |            ^                                                                                                                
     11|   })                                                                                                                        
     12| })                                                                                                                          

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

Test Files  1 failed | 1 passed (2)
     Tests  1 failed | 6 passed (7)
      Time  1.98s (in thread 387ms, 512.59%)


 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit
```

```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    expect(
      screen.getByRole("button", {name: "Submit"})
    ).toBeDisabled()   
  })
})
```


```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()   
  })
})
```

```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    fireEvent.update(
      screen.getByLabelText('Name'), 'Lachlan'
    )  
  })
})
```

```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import { nextTick } from "vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    fireEvent.update(
      screen.getByLabelText('Name'), 'Lachlan'
    )

    await nextTick()
    
    expect(button).not.toBeDisabled()   
  })
})
```

```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    await fireEvent.update(
      screen.getByLabelText('Name'), 'Lachlan'
    )

    await waitFor(()=>{      
      expect(button).not.toBeDisabled()
    })
  })
})
```


```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    await fireEvent.update(
      screen.getByLabelText('Name'), 'Lachlan'
    )

    expect(button).not.toBeDisabled()   
  })
})
```
