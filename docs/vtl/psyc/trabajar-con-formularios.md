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

Por último, un `button` de envio con el `role` de `"button"` porque esta es su función y obviamente dice `Submit`. También deshabilitaremos este botón, para que no se pueda enviar el formulario a menos que el usuario haya escrito su nombre. 

En archivo de pruebas partiremos de lo más básico.

```js
// tests/components/myform.spec.js
import { render } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    render(MyForm)   
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

    screen.getByRole("button", {name: "Submit"})   
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

    screen.getByRole("button", {name: "asdfSubmit"})   
  })
})
```

```
tests/components/myform.spec.js:12:12
     10|     render(MyForm)
     11|                                                                                                              
     12|     screen.getByRole("button", {name: "asdfSubmit"})                                                         
       |            ^                                                                                                 
     13|                                                                                                              
     14|   })                                                                                                         

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

Test Files  1 failed (1)
     Tests  1 failed (1)
      Time  167ms


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
