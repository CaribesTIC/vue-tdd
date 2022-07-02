# `fireEvent` y `waitFor`

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=JEHkTcZyL6o&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=4)
:::

Ahora que hemos visto los conceptos básicos de Vue Testing Library, podemos comensar a conocer algunas de las características más interesantes. Así que lo primero que haremos es actualizar nuestro componente para ver algo un poco más interesante en este ejemplo.

Vamos a dirigirnos a nuestro `@/components/Helloworld.vue` y cambiarlo para que sea un poco diferente. Eliminemos todo el estilo y también todo el marcado que no necesitaremos. Tampoco necesitaremos la variable `count`. Dejemos la importación de la función `ref` de Vue y la propiedad `msg` que si las necesitaremos más adelante.

```vue
<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

</script>

<template>
  <h1>{{ msg }}</h1>
</template>
```

Lo que haremos será crear un elemento `<button>` que revele un texto cuando se haga click en él. Así que tendremos un botón que al hacer click establecerá la variable `show` en `true`.

```vue{11,12}
<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})
</script>

<template>
  <h1>{{ msg }}</h1>
  <button @click="show = true">Mostrar</button>
</template>
```

También necesitaremos alguna manera de seleccionar este botón y lo haremos agregando el atributo `role`. Esto es algo que Vue Testing Library realmente nos alienta a hacer.

>Los roles son buenos para la accesibilidad y lamentablemente es algo que muchos no acostumbran usar. Animándonos a usar roles en nuestras pruebas hará que nuestros componentes sean más accesibles, sobre todo para las personas que usan lectores de pantalla.

A este `role` vamos a llamarlo `show-text` porque esa es la función de este botón, mostrar el texto.

```html
<button @click="show = true" role="show-text">Mostrar</button>
```
 Guardemos esto y por supuesto la prueba aún se aprobará porque todavía estamos representando el mensaje.
 
```
 √ tests/components/helloworld.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  39ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Así que sigamos adelante creando la variable reactiva `show` establecida en `false` y condicionando el respectivo elemento para que muestre el mensaje correspondiente. 

```vue{8,9,12,13}
<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const show = ref(false)
</script>

<template>
  <h1 v-if="show">{{ msg }}</h1>
  <button @click="show = true" role="show-text">Mostrar</button>
</template>
```
Por supuesto, esta condición hará que nuestra prueba falle.

```
 FAIL  tests/components/helloworld.spec.js > HelloWorld.vue > renders props.msg when passed
TestingLibraryElementError: Unable to find an element with the text: new message. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, <script />, <style />
<body>
  <div>
                                                                                                                                     
    <button
      role="show-text"                                                                                                               
    >                                                                                                                                
      Mostrar                                                                                                                        
    </button>
                                                                                                                                     
  </div>
</body>                                                                                                                              
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:40:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:90:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:62:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:111:19
 ❯ tests/components/helloworld.spec.js:14:19
     12|     })
     13|                                                                                                                             
     14|     expect(screen.getByText(msg)).toBeTruthy()                                                                              
       |                   ^                                                                                                         
     15|   })                                                                                                                        
     16| })                                                                                                                          

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

Test Files  1 failed (1)
     Tests  1 failed (1)
      Time  44ms


 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit
```

Revisemos nuestra prueba para determinar porque está fallando.

```js{13,14}
// tests/components/helloworld.spec.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"    
    render(HelloWorld, {
      props: { msg }
    })

    expect(screen.getByText(msg)).toBeInTheDocument()    
  })
}) 
```
Esperamos que exista el texto y no existe.

Así que lo que debemos hacer primero es hacer click en el botón antes de afirmar que el texto existe. La forma que podemos hacer click en el botón es importando el método `fireEvent` de Vue Testing Library.

```js
import { render, screen, fireEvent } from "@testing-library/vue"

// ...

fireEvent.click(
  // element
)
```

Ahora podemos disparar un evento click. Necesitamos pasarle el elemento en el que nos gustaría hacer click. En este caso, nos gustaría hacer click en el botón y tenemos una manera excelente de seleccionarlo. Recuerde que agregamos un `role` igual a `show-text`. Vamos a seleccionar dicho elemento usando ese `role`.

```js{14,15}
// tests/components/helloworld.spec.js
import { render, screen, fireEvent } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    render(HelloWorld, {
      props: { msg }
    })

    fireEvent.click(
      screen.getByRole('show-text')
    )
    expect(screen.getByText(msg)).toBeInTheDocument()    
  })
}) 
```
Guardemos y veamos que sucede. Podemos ver que obtenemos la misma falla de que el texto no existe.

Lo que haríamos tradicionalmente es importar el `nextTick` de Vue y luego llamarlo.

```js
// ...
import { nextTick } from `vue`
// ...
async () => {
  // ...
  await nextTick()
  // ...
}
```

Lo que esto hará será esperar a que el DOM se actualice y eso garantizará que una vez que el DOM se haya actualizado el texto sea revelado según  la condición del `v-if`.

Se podría hacer algo así: 

```js{3,8,9,19}
// tests/components/helloworld.spec.js
import { render, screen, fireEvent } from "@testing-library/vue"
import { nextTick } from "vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", async () => {
    const msg = "new message"    
    render(HelloWorld, {
      props: { msg }
    })

    fireEvent.click(
      screen.getByRole('show-text')
    )

    await nextTick()

    expect(screen.getByText(msg)).toBeInTheDocument()    
  })
})
```
Esta es una característica de Vue Test Utils la cual debemos comprender como funciona Vue internamente. Esto es algo en lo que quizá no quisieramos pensar mientras estamos escribiendo pruebas.

Afortunadamente, Vue Testing Library tiene otra manera de solucionar esto, ya que en realidad hay varias maneras de hacerlo.

Vamos a ver otro método de Vue Testing Library el cual se llama `waitFor`.

```js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
// ...
async () => {
  // ...
  await waitFor(() =>
    // ...
  )
}
```

Básicamente, esto nos permitirá esperar a que suceda algo antes de progresar.

Veamos cómo funciona.

```js{2,7,8,19}
// tests/components/helloworld.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", async () => {
    const msg = "new message"
    // wrapper
    render(HelloWorld, {
      props: { msg }
    })

    fireEvent.click(
      screen.getByRole('show-text')
    )
    
    await waitFor(() =>
      expect(screen.getByText(msg)).toBeInTheDocument()
    )    
  })
}) 
```

`waitFor` recibe una devolución de llamada la cual su retorno será nuestra afirmación. 

Hay una mejora que se puede hacer, la cual veremos más adelante...

