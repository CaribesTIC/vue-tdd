# `getBy`, `queryBy` y `findBy`

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=B6BdCKStmFQ&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=3)
:::

Hasta ahora hemos visto solo una forma de seleccionar elementos del DOM y es usando el selector `getBy`.

En realidad hay tres selectores que usaremos con mucha frecuencia: `getBy`, `queryBy` y `findBy`. Y hay muchas variedades diferentes. Hemos visto la variedad `byText`, pero vamos a ver ahora por `byRoll` y un montón de otras también.

Antes de saltar y ver las diferentes variedades, sigamos adelante y veamos cómo hacer que `get`, `query` y `find` trabajen un poco diferente antes de que hagamos eso.

Mostraremos un pequeño truco con esto. Sigamos adelante y eliminemos la afirmación y simplemente mantengamos el selector de `getByText`.

```js{14,15,16}
// tests/components/helloworld.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    render(HelloWorld, {
      props: { msg }
    })

    //expect(screen.getByText(msg)).toBeInTheDocument()
    screen.getByText(msg)
  })
})
```

Y si guardamos esto, por supuesto, la prueba está en marcha para continuar pasando porque tenemos este texto en el DOM.

```
 √ tests/components/helloworld.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  50ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Veamos qué sucede si lo cambiamos y lo guardamos.

```js{15,16}
// tests/components/helloworld.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    render(HelloWorld, {
      props: { msg }
    })

    //expect(screen.getByText(msg)).toBeInTheDocument()
    screen.getByText('asdf')
  })
})
```
Aunque no tenemos una afirmación aquí, pero la prueba en realidad fallará.

```
❯ tests/components/helloworld.spec.js:15:12
     13| 
     14|     //expect(screen.getByText(msg)).toBeInTheDocument()                                                                     
     15|     screen.getByText('asdf')                                                                                                
       |            ^                                                                                                                
     16|   })                                                                                                                        
     17| })                                                                                                                          

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

Test Files  1 failed (1)
     Tests  1 failed (1)
      Time  58ms


 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit
```

Y esta es una de las características de `getByText`. Va a fallar si no encuentra el _nodo_ correcto e incluso, le mostrará una visualización del DOM y le mostrará lo que existe y lo que no.

```js
 FAIL  tests/components/helloworld.spec.js > HelloWorld.vue > renders props.msg when passed
TestingLibraryElementError: Unable to find an element with the text: asdf. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, <script />, <style />
<body>
  <div>
                                                                                                                                     
    <h1
      data-v-469af010=""                                                                                                             
    >                                                                                                                                
      new message                                                                                                                    
    </h1>
    <p                                                                                                                               
      data-v-469af010=""                                                                                                             
    >                                                                                                                                
       Recommended IDE setup:                                                                                                        
      <a
        data-v-469af010=""                                                                                                           
        href="https://code.visualstudio.com/"                                                                                        
        target="_blank"                                                                                                              
      >                                                                                                                              
        VS Code                                                                                                                      
      </a>
       +                                                                                                                             
      <a
        data-v-469af010=""                                                                                                           
        href="https://github.com/johnsoncodehk/volar"                                                                                
        target="_blank"                                                                                                              
      >                                                                                                                              
        Volar                                                                                                                        
      </a>
    </p>                                                                                                                             
    <p                                                                                                                               
      data-v-469af010=""                                                                                                             
    >                                                                                                                                
      <a                                                                                                                             
        data-v-469af010=""                                                                                                           
        href="https://vitejs.dev/guide/features.html"                                                                                
        target="_blank"                                                                                                              
      >                                                                                                                              
         Vite Documentation                                                                                                          
      </a>
       |                                                                                                                             
      <a
        data-v-469af010=""                                                                                                           
        href="https://v3.vuejs.org/"                                                                                                 
        target="_blank"                                                                                                              
      >                                                                                                                              
        Vue 3 Documentation                                                                                                          
      </a>
    </p>                                                                                                                             
    <button                                                                                                                          
      data-v-469af010=""                                                                                                             
      type="button"                                                                                                                  
    >                                                                                                                                
      count is: 0                                                                                                                    
    </button>
    <p                                                                                                                               
      data-v-469af010=""                                                                                                             
    >                                                                                                                                
       Edit                                                                                                                          
      <code
        data-v-469af010=""                                                                                                           
      >                                                                                                                              
        components/HelloWorld.vue                                                                                                    
      </code>
       to test hot module replacement.                                                                                               
    </p>
                                                                                                                                     
  </div>
</body>                                                                                                                              
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:40:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:90:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:62:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:111:19
```

Por lo que en realidad es una especie de prueba de una manera muy implícita. Aunque no hemos escrito la afirmación, esto va a fallar en la prueba si el elemento no existe.

Es preferible de esta manera que es más explicito.

```js{14,15}
// tests/components/helloworld.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    render(HelloWorld, {
      props: { msg }
    })

    expect(screen.getByText(msg)).toBeInTheDocument()
    //screen.getByText('asdf')
  })
})
```

Sin embargo, esto plantea la pregunta: ¿Cómo podemos escribir una afirmación para decir que algo no existe y siga adelante?

Veremos cómo podemos hacer eso, así que avancemos y cambiemos esto. Vamos a decir que obtendrá el mensaje `asdf`, y por supuesto, esto va a fallar.

```js{14,15}
// tests/components/helloworld.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    render(HelloWorld, {
      props: { msg }
    })

    expect(screen.getByText('asdf')).toBeInTheDocument()    
  })
}) 

```

Pero queremos hacer que esta prueba pase. En lugar de usar `getByText` usaremos `queryByText` y lo que esto realizará será buscar, pero por su tipado, retornará un `HTMLElement | null` en lugar de obtener por texto.

Ya que es solo un elemento HTML, por lo que puede devolver un elemento nulo, eso nos va permitir escribir lo contrario como aserción, diciendo que este texto no existe. Todo lo que necesitamos ahora es decir que no esté en el DOM.

```js{14,15}
// tests/components/helloworld.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    render(HelloWorld, {
      props: { msg }
    })

    expect(screen.getByText('asdf')).not.toBeInTheDocument()    
  })
}) 
```

Guardemos y esto pasará.

```
 RERUN  rerun all

 ✓ tests/components/helloworld.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  29ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Por lo que la principal diferencia entre `queryByText` y `getByText` es que `getByText` va a fallar si no encuentra el elemento correcto mientras que `queryByText` no. Podemos confirmar eso, una vez más, con solo mirar los tipos de devolución de `getByText`, que solo puede ser un `HTMLElement`, mientras que `queryByText` puede ser `HTMLElement | null`.

Por lo que generalmente usaremos el método `getByText`, la única razón por la que realmente deseamos usar `queryByText` es si estamos afirmando que algo no existe. De lo contrario, seguiremos con el `getByText`. Por la razón de que es más claro y en realidad nos dará un buen resultado si nuestra prueba sigue adelante.

Hay uno más del cual vamos a hablar, que es `findByText` y este es realmente asíncrono, una de las característica realmente agradables de Vue Testing Library. Y esto resuelve uno de los problemas de Vue Test Utils, donde normalmente tendríamos que usar `nextTick`.

```js{17}
// tests/components/helloworld.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    render(HelloWorld, {
      props: { msg }
    })

    expect(screen.getByText('asdf')).not.toBeInTheDocument()

    // findByText...
  })
}) 
```

Vamos a seguir y profundizar eso más adelante.



