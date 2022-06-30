# `findBy`

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=6UypB6LRysc&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=5)
:::

Hasta ahora hemos visto algunas formas en que Vue Testing Library difiere de Vue Test Utils. Cuando llamamos `fireEventet` en lugar de usar `trigger` y `waitFor` en lugar usar `nextTick`.

```js{13,14,17,18}
// tests/components/helloworld.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
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
    
    await waitFor(() =>
      expect(screen.getByText(msg)).toBeInTheDocument()
    )    
  })
}) 
```

Lo que vamos a hacer ahora es un pequeño refactor para hacer esto aún mejor. Vamos a comentar estas tres líneas para que aún podamos tenerlas.

```js
// await waitFor(() =>
//   expect(screen.getByText(msg)).toBeInTheDocument()
// )
```

Lo que haremos será cambiar ligeramente nuestras afirmaciones. En lugar de usar `waitFor`, ahora usaremos el selector `findByText`, del que hablamos previamente. Recordemos que este funciona de forma [asíncrona](https://developer.mozilla.org/en-US/docs/Glossary/Asynchronous), es decir, devuelve una [promesa](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise). Esto nos permitirá esperar a que aparezca ese elemento.

Lo que tenemos que hacer aquí es colocarlo con `await` y esta prueba pasará.


```js{22}
// tests/components/helloworld.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
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
    
    // await waitFor(() =>
    //  expect(screen.getByText(msg)).toBeInTheDocument()
    //)

    expect(await screen.findByText(msg)).toBeInTheDocument()    
  })
}) 
```

En realidad es muy similar a lo que estábamos haciendo antes. Deciamos, `waitFor` y luego deciamos `getByText`. Muy similar a lo que estamos haciendo ahora. Sin embargo, `findByText` es un poco más conciso y un poco más legible.

Si nos dirigimos a la documentación de Vue Testing Library y leemos [findBy](https://testing-library.com/docs/dom-testing-library/api-async/#findby-queries), podemos ver lo que hace internamente. Se trata solo de una combinación simple de `getBy` y `waitFor`. Hacer esto es tan común, que por eso nos proporcionan este método `findBy`. Por lo que definitivamente, es una mejora desde cualquier punto de vista.

Solo para enfatizar lo que estaba sucediendo antes, vamos a dar un paso atrás y a hacer un `console.log("HI")` dentro de `waitFor` para mostrar lo que sucede.

```js{18,19,20,21}
// tests/components/helloworld.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
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
    
     await waitFor(() => {
        console.log("HI")
        expect(screen.getByText(msg)).toBeInTheDocument()    
     })

    expect(await screen.findByText(msg)).toBeInTheDocument()    
  })
})
```

Guardemos y veamos qué pasa.

```
stdout | tests/components/helloworld.spec.js > HelloWorld.vue > renders props.msg when passed
HI
HI

 √ tests/components/helloworld.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  102ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Vamos a obtener dos veces `HI`.

Lo que está pasando aquí es que estamos llamando `waitFor` y esta está ejecutando la función de devolución de llamada la primera vez fallando, así que espera 50 milisegundos e intenta repetir la función de devolución de llamada nuevamente hasta que pasa. Es por eso que nos devuelve `HI` dos veces.

Algo muy similar está sucediendo internamente con `findBy`. Sin embargo, al usar `findBy` estamos abstrayendo esa complejidad desde el punto de vista del usuario y del lector. Por lo que definitivamente es preferible usar `findBy` en lugar de usar `waitFor`.

Probablemente haya algunos casos de uso para `waitFor`, pero en general querrá usar un `findBy` siempre que se pueda. 





