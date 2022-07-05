# Filosofía

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=NWxiYaf0_Xs&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=2)
:::

Antes de continuar y discutir algunas de las diferencias entre `getByText` y otros selectores, es importante discutir la filosofía de Vue Testing Library y como funciona todo aquí.

```js
// tests/components/helloworld.spec.js
import { render } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    const { getByText } = render(HelloWorld, {
      props: { msg }
    })

    expect(getByText(msg)).toBeInTheDocument()
  })
})
```

Una cosa que notará es que aunque tenemos un valor de retorno de la función `render`, no llamamos a ese envoltorio. Y eso se debe a que en Vue Testing Library no es realmente un envoltorio.

En Vue Test Utils ciertamente se obtiene un envoltorio que tiene todos esos métodos convenientes para probar los componentes.  Así como establecer `props`, `data`, etc. y así sucesivamente.

A diferencia, en Vue Testing Library en realidad no estamos obteniendo un contenedor y la idea general es no pensar en las cosas desde el punto de vista de un componente. Vue Test Utils está muy centrado en el componente. Por otro lado, Vue Testing Library está centrado en el usuario, le gusta centrarse en las acciones que los usuarios pueden realizar.

Si echamos un vistazo a su [sitio web](https://testing-library.com/docs/) podemos ver qué quieren lograr. Anima a probar la interfaz del usuario en lugar de los detalles de implementación. Y esto definitavamente es una razón de peso. Por lo que esa es la fuerza impulsora detrás de Vue Testing Library. Realmente queremos probar cómo funciona nuestro componente o cómo se comporta en comparación con los detalles de implementación.

Lo que estamos haciendo aquí es simular lo que hace un usuario, por lo que un mejor nombre para esta variable aquí sería algo como `user`.

```js{10,11,14,15}
// tests/components/helloworld.spec.js
import { render } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    // wrapper
    const user = render(HelloWorld, {
      props: { msg }
    })

    expect(user.getByText(msg)).toBeInTheDocument()
  })
})
```

La idea es que el usuario obtendrá algo por mensaje de texto, obviamente, eso es algo que un usuario hace, usan sus ojos para seleccionar visualmente algo en una página. Es por eso que luce bien llamar a esto `user`.

Sin embargo, lo que es mucho más común en la comunidad de Vue Testing Library, por lo que se puede decir, es simplemente renderizar nuestro componente e importar una variable llamada `screen` y esto va a tener todas las API de Vue Testing Library adjuntas. Lo cual es realmente conveniente.

Ahora podemos seguir adelante y hacer un `screen.getByText` y esto va para encontrar cualquier texto en la pantalla que contenga lo declarado en `msg`.

```js{2,10,11,14,15}
// tests/components/helloworld.spec.js
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
  })
})
```

Y eso es algo que el usuario haría desde su punto de vista.

Si seguimos adelante y guardamos y ejecutamos esta prueba...

```
 RERUN  rerun all

 √ tests/components/helloworld.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  52ms
```

... podemos ver que definitivamente pasará.

Ahora que hemos hablado un poco sobre esta filosofía, pasemos a la siguiente lección y hablemos sobre las diferentes formas en que podemos seleccionar nodos y cómo se diferencian.
