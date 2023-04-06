# Vuex Mutaciones

## Probando Mutaciones

Probar mutaciones de forma aislada es muy sencillo, porque las mutaciones son solo funciones regulares de JavaScript. Esta página analiza las pruebas de mutaciones de forma aislada. Si desea probar mutaciones en el contexto de un componente que comete una mutación, consulte [aquí](../vth/probando-vuex-en-componentes-mutaciones-y-acciones).

La prueba utilizada en el siguiente ejemplo se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/mutations.spec.js).

## Creando la Mutación

Las mutaciones tienden a seguir un patrón establecido. Obtenga algunos datos, tal vez haga algún procesamiento, luego asigne los datos al estado. Aquí está el esquema de una mutación `ADD_POST`. Una vez implementado, recibirá un objeto `post` en la carga útil y agregará `post.id` a `state.postIds`. También agregará el objeto de publicación al objeto `state.posts`, donde la clave es `post.id`. Este es un patrón común en las aplicaciones que usan Vuex.

Lo desarrollaremos usando TDD. El comienzo de la mutación es el siguiente:

```js
// store/mutations.js
export default {
  SET_POST(state, { post }) {

  }
}
```

Escribamos la prueba y dejemos que los mensajes de error guíen nuestro desarrollo:

```js
import mutations from "@/store/mutations.js"

describe("SET_POST", () => {
  it("adds a post to the state", () => {
    const post = { id: 1, title: "Post" }
    const state = {
      postIds: [],
      posts: {}
    }

    mutations.SET_POST(state, { post })

    expect(state).toEqual({
      postIds: [1],
      posts: { "1": post }
    })
  })
})
```
Ejecutar esta prueba genera el siguiente mensaje de error:

```sh
FAIL  tests/unit/mutations.spec.js
● SET_POST › adds a post to the state

  expect(received).toEqual(expected)

  Expected value to equal:
    {"postIds": [1], "posts": {"1": {"id": 1, "title": "Post"}}}
  Received:
    {"postIds": [], "posts": {}}
```

Comencemos agregando `post.id` a `state.postIds`:

```js
// store/mutations.js
export default {
  SET_POST(state, { post }) {
    state.postIds.push(post.id)
  }
}
```

Ahora la prueba produce:

```sh
Expected value to equal:
  {"postIds": [1], "posts": {"1": {"id": 1, "title": "Post"}}}
Received:
  {"postIds": [1], "posts": {}}
```

`postIds` se ve bien. Ahora solo necesitamos agregar la publicación a `state.posts`. Debido a cómo funciona el sistema de reactividad de Vue, no podemos simplemente escribir `post[post.id] = post` para agregar la publicación. Más detalles se pueden encontrar [aquí](https://vuejs.org/guide/extras/reactivity-in-depth.html). Básicamente, necesita crear un nuevo objeto usando `Object.assign` o el operador `...`. Usaremos el operador `...` para asignar la publicación a `state.posts`:

```js
// store/mutations.js
export default {
  SET_POST(state, { post }) {
    state.postIds.push(post.id)
    state.posts = { ...state.posts, [post.id]: post }
  }
}
```

¡Ahora pasa la prueba!

## Conclusión

Probar las mutaciones de Vuex no requiere nada específico de Vue o Vuex, ya que son solo funciones regulares de JavaScript. Simplemente impórtelos y pruébelos según sea necesario. Lo único que debe tener cuidado son las advertencias de reactividad de Vue, que también se aplican a Vuex. Puede leer más sobre el sistema de reactividad y las advertencias comunes [aquí](https://vuejs.org/guide/extras/reactivity-in-depth.html).

La página discutida:

- Las mutaciones de Vuex son funciones regulares de JavaScript
- Las mutaciones pueden, y deben, probarse de forma aislada de la aplicación principal de Vue

La prueba utilizada en el ejemplo anterior se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/mutations.spec.js).
