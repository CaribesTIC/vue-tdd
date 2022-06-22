# Consultas DOM

Vue Testing Library es bastante similar a Vue Test Utils, discutiremos un poco sobre esto y hablaremos sobre algunas de las diferencias. Ya que es un poco más obstinado y trae opiniones interesantes para debatir. Empecemos...

Para ahorrar un poco de tiempo, empecemos con el componente `HelloWorld.vue` que trae la instalación de Vue por defecto. Para la cual, crearemos el siguiente archivo de prueba:


```js
//tests/components/helloworld.spec.js
import { shallowMount } from "@vue/test-utils"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
```

Lo primero que haremos será eliminar el `shallowMount` ya que no usaremos `"@vue/test-utils"`. Así que avancemos actualizando nuestras importaciones con ["@testing-library/vue"](https://www.npmjs.com/package/@testing-library/vue).

Luego tomemos el método `render`, esto permitirá renderizar sus componentes. Este es el único medio de renderizar cosas en Testing Library, ya no devolverá un envoltorio. Sí devuelve un objeto, pero contiene métodos, por una razón muy diferente. Así que por el momento, eliminaré la constante `wrapper`.

Las opciones de montaje, como `props`, serán similares. Temporalmente, comentaremos la aserción y simplemente ejecutaremos las pruebas en modo de observación, para obtener ese buen ciclo de retroalimentación rápida.

```js{2,8,9,10,11,12}
//tests/components/helloworld.spec.js
import { render } from "@testing-library/vue"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    render(HelloWorld, {
      props: { msg }
    })
    //expect(wrapper.text()).toMatch(msg)    
  })
})
```
Todo debería estar bien hasta aquí, así que sigamos adelante y continuemos actualizando nuestra aserción.

Para ello, vamos a afirmar que el texto aparece en el documento. Hay varias formas de hacer esto. La primera es desestructurar el valor de retorno del `render`, esto tiene la cantidad de acciones que el usuario puede tomar y dentro de poco hablaremos más sobre lo que significa eso. Pero avancemos y veamos nuestra afirmación.

En este caso, queremos usar el `getByText` el cual nos permitirá obtener cualquier elemento en el DOM usando el texto. Así que ahora podemos seguir adelante y actualicemos nuestra afirmación.

```js{8,9,11,12}
//tests/components/helloworld.spec.js
import { render } from "@testing-library/vue"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    const { getByText } = render(HelloWorld, {
      props: { msg }
    })
    expect(getByText(msg)).toBeTruthy()    
  })
})
```

Pero vamos a usar coincidencias más expresivas. Por lo que importaremos otra biblioteca y veremos como funciona, se trata de ["@testing-library/jest-dom"](https://www.npmjs.com/package/@testing-library/jest-dom). Lo que esto hará es darnos una serie de afirmaciones adicionales en nuestra declaración `expect`.

En este caso, estamos buscando un _nodo dom_ que contiene un mensaje de texto y estamos afirmando que está en el documento. Eso va afirmar que este elemento existe en algún lugar del DOM.


```js{3,14}
//tests/components/helloworld.spec.js
import { render } from "@testing-library/vue"
import "@testing-library/jest-dom"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message"
    const { getByText } = render(HelloWorld, {
      props: { msg }
    })
    expect(getByText(msg)).toBeTruthy()
    expect(getByText(msg)).toBeInTheDocument()
  })
})
```

Espero que pase y efectivamente pasó.













