# Enviar formularios y emitir eventos

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=Iye52prfleQ&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=7)
:::

Hasta ahora nuestra prueba se ve bastante bien.

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
      screen.getByLabelText('Name'), 'John'
    )

    waitFor(() => {      
      expect(button).not.toBeDisabled()
    })
  })
})
```
Lo siguiente que haremos es enviar el formulario y asegurarnos que se emita el evento correcto.

Esto significa que debemos activar el evento `@submit.prevent`, el cual llamará a un método `submit` que hasta ahora no hemos creado. Así que creemos este método de envio.

Por ahora, solo voy a hacer un `console.log` para asegurarnos que está siendo invocado.

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

Guardemos esto y actualicemos nuestra prueba para enviar este formulario.

En dicha prueba, lo primero que haremos será hacer click en el respectivo botón. Como ya hemos visto antes el uso de `fireEven`, simplemente haremos click en el botón y seguir adelante.

```js{22}
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
      screen.getByLabelText('Name'), 'John'
    )

    waitFor(()=>{      
      expect(button).not.toBeDisabled()
    })
    
    fireEvent.click(button)
  })
})
```
Es posible que esperemos que el `console.log` se active, guardémoslo y veremos que sucede.

```
 √ tests/components/myform.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  121ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Podemos ver aquí, que aunque estamos activando el método `submit` no estamos recibiendo el `console.log`, como es de esperar. Ahora la pregunta: ¿por qué sucede esto?

Hagamos un `console.log` en la línea 18 y otro `console.log` en la línea 21 solo indicando el número de línea.

```js{19,23}
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
      screen.getByLabelText('Name'), 'John'
    )

    waitFor(() => {
      console.log(18)    
      expect(button).not.toBeDisabled()
    })

    console.log(21)    
    fireEvent.click(button)
  })
})
```

Si guardamos esto veremos algo un poco sorprendente:

```
stdout | tests/components/myform.spec.js > MyForm.vue > enable button when data is entered
18
21
18

 √ tests/components/myform.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  118ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Tenemos el número 18, luego tenemos el número 21 y luego tenemos el número 18 nuevamente.

Lo que sucede aquí es que estamos esperando el siguiente _tick_ para asegurarnos de que el botón se haya actualizado correctamente y, en este punto, no se ha actualizado. Luego, ejecutando `fireEvent.click` y debido a que el botón aún está deshabilitado, no se enviará. Entonces, en la próxima ejecución del la devolución de llamada, dentro del método `waitFor` se volverá a mostrar el número 18. Pero en este punto ya hicimos nuestro `fireEvent.click`, por lo que no obtendremos el `console.log` como cabría esperar.

Es un poco sorprendente y es una especie de error sutil que debemos tener en cuenta. Vamos a ver una mejor forma de escribir esta prueba para evitar este error.

m 1.26

