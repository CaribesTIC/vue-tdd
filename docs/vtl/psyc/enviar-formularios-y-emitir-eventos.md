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
```

Tenemos el número 18, luego tenemos el número 21 y luego tenemos el número 18 nuevamente.

Lo que sucede aquí es que estamos esperando el siguiente _tick_ para asegurarnos de que el botón se haya actualizado correctamente y, en este punto, no se ha actualizado. Luego, ejecutando `fireEvent.click` y debido a que el botón aún está deshabilitado, no se enviará. Entonces, en la próxima ejecución del la devolución de llamada, dentro del método `waitFor` se volverá a mostrar el número 18. Pero en este punto ya hicimos nuestro `fireEvent.click`, por lo que no obtendremos el `console.log` como cabría esperar.

Es un poco sorprendente y es una especie de error sutil que debemos tener en cuenta. Vamos a ver una mejor forma de escribir esta prueba para evitar este error.

Lo que hay que hacer es, antes remover los `console.log` que pusimos en nuestra prueba. Entonces, colocaremos un `await` justo antes del método `waitFor` para que se quede ahí esperando hasta que termine antes de disparar el próximo `fireEvent.click`.

```js{18}
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

    await waitFor(() => {    
      expect(button).not.toBeDisabled()
    })
    
    fireEvent.click(button)
  })
})
```

Si guardamos, veremos que ahora si estará funcionando correctamente, mostrando el `console.log` que declaramos previamente en el método `submit` del componente que estamos probando.

```{2}
stdout | tests/components/myform.spec.js > MyForm.vue > enable button when data is entered
...

 √ tests/components/myform.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  118ms
```

Una mejor manera de hacer esto es colocando el `await` antes del método `fireEvent.update`. Haciéndolo así, ahora podemos deshacernos del método `waitFor` y esto nos dará el mismo resultado.

```js{14,18}
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

Es bueno tener en cuenta las dos formas en que se puede hacer. Ambas maneras serán útiles dependiendo de la prueba que queremos lograr.

En fin, dejémoslo así y emitamos el evento asegurandonos que funcione correctamente.

Así que vayamos a nuestro componente y coloquemos el método `emit` dentro del correspondiente método `submit`. Pasemos el nombre del método que queremos llamar, que será `submit` por ahora y pasemos una carga útil que será un objero con la propiedad `name` pasándole el valor de nuestra constante reactiva `name` que será el nombre del usuario que haya llenado la entrada correctamente.

```vue{4,6}
<script setup>
import { ref } from "vue"

const emit = defineEmits(["submit"])
const name = ref("")
const submit = () => emit("submit", { name: name.value })
</script>

<template>
  <form @submit.prevent="submit">
    <label for="name">Name</label>
    <input v-model="name" id="name" />
    <button role="button" :disabled="!name.length">Submit</button>
  </form>  
</template>
```

Regresemos a nuestra prueba y el evento se emitió correctamente. 2.29
```js{8,9,22}
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    const { emitted } = render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    await fireEvent.update(
      screen.getByLabelText('Name'), 'John'
    )
            
    expect(button).not.toBeDisabled()

    fireEvent.click(button)
    
    console.log(emitted().submit)
  })
})
```
