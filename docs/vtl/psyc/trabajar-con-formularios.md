# Trabajar con Formularios

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=rnbji86I0PQ&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=6)
:::

Ahora veremos las diversas maneras que tiene la API de Vue Testing Libray para probar formularios. Ante todo, vamos a crear nuestro formulario para materializar este ejemplo.

Empezamos declarando una constante reactiva de Vue, con la función `ref`, llamada `name` e inicializándola en `""`. Luego, tenemos un `@submit.prevent` que invocará a un método llamado `submit`, seguido de un `label` para `name` y su respectivo `input` vinculando `v-model` a `name`, junto con la propiedad `id` establecida con `name` también.

Por último, agregamos un `button` de envio con el texto `Submit` y con el `role` de `"button"` porque obviamente esta es su función. También deshabilitaremos este botón, para que no se pueda enviar el formulario a menos que el usuario haya escrito su nombre. Si `name` no tiene `length` estará `disabled`, y cuando el usuario ingrese su nombre será cuando se habilitará este botón.

Entonces, nuestro `@/components/MyForm.vue` luce de la siguiente forma.

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

Lo primero que hay que probar es que hay un botón deshabilitado, por lo que debemos antes seleccionarlo. Así que para ello podemos usar `screen` con el método `getByRole`, pasando como primer argumento `"button"` y luego (para buscar el botón específico) pasamos un objeto con `name` en `"Submit"` como segundo argumento. Es decir, primero buscará el `role="button"` y luego verificará que diga `Submit`.


```js{2,10,11}
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
Esta es una manera de seleccionar elementos que funciona muy bien. Podemos comprobarlo agregando cualquier cosa dentro de la propiedad `name` para estropearlo y verificar si sucede un error sino encuentra el elemento correcto.

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
Guarde y observará que la prueba fallará, queriéndonos decir que si funciona.

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

Continuemos, ahora comprobando con `toBeDisabled` que el botón está deshabilitado. Y este es otro método que proviene de `@testing-library/jest-dom`.

```js{3,10,11,12,13}
// tests/components/myform.spec.js
import { render, screen } from "@testing-library/vue"
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
Continuamos adelante, guardamos y podemos comprobar que la prueba pasará.

Seguidamente, podemos hacer una pequeña refactorización para que no se vea tan largo. Vamos a extraer lo que retorna el método `screen.getByRole` en una constante llamada `button`. No es obligatorio hacer esto, pero así nos resultará más fácil llamar esta constante `button` más adelante.

```js{10,11,12}
// tests/components/myform.spec.js
import { render, screen } from "@testing-library/vue"
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

Sigamos adelante para completar la prueba.

Ya hemos visto antes cómo desencadenar eventos usando `fireEvent`. En este caso activaremos el evento `update` el cual  funcionará específicamente con el `v-model`, esto nos permitirá actualizar las entradas.

El primer argumento será la entrada a actualizar, por lo que debemos seleccionar el elemento correcto. En el caso de Vue Testing Library ya sabemos que le gusta alentarnos a ser accesibles y lo que haría un usuario  es buscar una entrada basada en el nombre. Por lo que, antes vamos a encontrar la etiqueta correcta usando el `Name` y luego completaremos la entrada de la forma en que funciona. Para este caso vamos a usar el selector `getByLabelText` al cual le pasaremos `Name` como argumento. Así tendremos el elemento correcto que queremos seleccionar.

Podemos continuar pasándole el nombre que queremos colocar, como segundo argumento. Completando así el formulario.

```js{2,13,14,15,16}
// tests/components/myform.spec.js
import { render, screen, fireEvent } from "@testing-library/vue"
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
  })
})
```

Así que guardemos y comprobaremos que no está fallando la prueba, está funcionando correctamente.

Finalmente, sigamos adelante y escribamos otra afirmación revirtiendo la anterior para corroborar que está deshabilitado el botón.

```js{18}
// tests/components/myform.spec.js
import { render, screen, fireEvent } from "@testing-library/vue"
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
    
    expect(button).not.toBeDisabled()
  })  
})
```

Si guardamos esto, en realidad va a fallar.

Esto es otro problema similar que vimos antes. La solución de Vue Test Utils lo puede resolver con `nextTick`.

```js{3,19}
// tests/components/myform.spec.js
import { render, screen, fireEvent } from "@testing-library/vue"
import { nextTick } from "vue"
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

    await nextTick()

    expect(button).not.toBeDisabled()
  })  
})
```

Guardamos y esto pasará.

Pero, realmente queremos hacerlo de la manera más ideomática de Vue Testing Library, ya que hay algunas maneras en que podemos hacer esto.

Colocaremos `await` antes de `fireEvent.update`, esto va a tener un efecto similar a `nextTick`. Luego usaremos `waitFor` para envolver la afirmación y esperar hasta que pase.


```js{2,13,14,18,19,20}
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
      screen.getByLabelText('Name'), 'John'
    )

    await waitFor(()=>{      
      expect(button).not.toBeDisabled()
    })
  })
})
```

Al guardar, también comprobará que esto funciona bién.

Sin embargo, hay otra manera más limpia de hacerlo y también funciona bastante bien.

```js{13,14,15,16,17,18}
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

Dejaremos esta lección hasta aquí y en la proxima, veremos cómo podemos probar que el evento ha sido llamado de forma correcta y también veremos cómo podemos probar los eventos emitidos en Vue Testing Library.
