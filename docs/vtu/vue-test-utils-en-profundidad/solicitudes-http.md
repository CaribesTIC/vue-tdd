# Realizando Solicitudes HTTP

Los ejecutores de pruebas modernos ya brindan muchas funciones excelentes cuando se trata de probar solicitudes HTTP. Por lo tanto, Vue Test Utils no presenta ninguna herramienta única para hacerlo.

Sin embargo, es una característica importante para probar, y hay algunos errores que queremos resaltar.

En esta sección, exploramos algunos patrones para realizar, simular y afirmar solicitudes HTTP.

## Una lista de publicaciones de blog

Comencemos con un caso de uso básico. El siguiente componente `PostList` muestra una lista de publicaciones de blog obtenidas de una API externa. Para obtener estas publicaciones, el componente presenta un elemento `button` que activa la solicitud:

```vue
<template>
  <button @click="getPosts">Get posts</button>
  <ul>
    <li v-for="post in posts" :key="post.id" data-test="post">
      {{ post.title }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      posts: null
    }
  },
  methods: {
    async getPosts() {
      this.posts = await axios.get('/api/posts')
    }
  }
}
</script>
```
Hay varias cosas que debemos hacer para probar este componente correctamente.

Nuestro primer objetivo es probar este componente **sin llegar realmente a la API**. Esto crearía una prueba frágil y potencialmente lenta.

En segundo lugar, debemos afirmar que el componente hizo la llamada correcta con los parámetros apropiados. No obtendremos resultados de esa API, pero aún debemos asegurarnos de que solicitamos los recursos correctos.

Además, debemos asegurarnos de que el DOM se haya actualizado en consecuencia y muestre los datos. Lo hacemos usando la función `flushPromises()` de `@vue/test-utils`.

```js
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import PostList from '@/PostList.vue'

const mockPostList = [
  { id: 1, title: 'title1' },
  { id: 2, title: 'title2' }
]

// Following lines tell Vitest to mock any call to `axios.get`
// and to return `mockPostList` instead

axios.get = vi.fn().mockResolvedValue(mockPostList)

test('loads posts on button click', async () => {
  const wrapper = mount(PostList)

  await wrapper.get('button').trigger('click')

  // Let's assert that we've called axios.get the right amount of times and
  // with the right parameters.
  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get).toHaveBeenCalledWith('/api/posts')

  // Wait until the DOM updates.
  await flushPromises()

  // Finally, we make sure we've rendered the content from the API.
  const posts = wrapper.findAll('[data-test="post"]')

  expect(posts).toHaveLength(2)
  expect(posts[0].text()).toContain('title1')
  expect(posts[1].text()).toContain('title2')
})
})
```
Preste atención cómo esperamo con `flushPromises` y luego interactuamos con el Componente. Lo hacemos para asegurarnos de que el DOM se haya actualizado antes de que se ejecuten las afirmaciones.

:::tip Alternativas a vi.mock()
Hay varias formas de establecer simulacros en Vitest. El que se usa en el ejemplo anterior es el más simple. Para alternativas más potentes, puede consultar [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) o [msw](https://github.com/mswjs/msw), entre otros.
:::

## Afirmando el estado de carga

Ahora, este componente `PostList` es bastante útil, pero carece de algunas otras funciones increíbles. ¡Expandámoslo para que muestre un mensaje elegante mientras carga nuestras publicaciones!

Además, deshabilitemos el elemento `<button>` durante la carga también. ¡No queremos que los usuarios sigan enviando solicitudes mientras buscan!
```vue{2,4,19,24,28}
<template>
  <button :disabled="loading" @click="getPosts">Get posts</button>

  <p v-if="loading" role="alert">Loading your posts…</p>
  <ul v-else>
    <li v-for="post in posts" :key="post.id" data-test="post">
      {{ post.title }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      posts: null,
      loading: null
    }
  },
  methods: {
    async getPosts() {
      this.loading = true

      this.posts = await axios.get('/api/posts')

      this.loading = null
    }
  }
}
</script>
```
Escribamos una prueba para afirmar que todos los elementos relacionados con la carga se procesan a tiempo.
```js
test('displays loading state on button click', async () => {
  const wrapper = mount(PostList)

  // Notice that we run the following assertions before clicking on the button
  // Here, the component should be in a "not loading" state.
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.get('button').attributes()).not.toHaveProperty('disabled')

  // Now let's trigger it as usual.
  await wrapper.get('button').trigger('click')

  // We assert for "Loading state" before flushing all promises.
  expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  expect(wrapper.get('button').attributes()).toHaveProperty('disabled')

  // As we did before, wait until the DOM updates.
  await flushPromises()

  // After that, we're back at a "not loading" state.
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.get('button').attributes()).not.toHaveProperty('disabled')
})
```

## Solicitudes HTTP de Vuex

Un escenario típico para aplicaciones más complejas es desencadenar una acción de Vuex que realiza la solicitud HTTP.

Esto no es diferente del ejemplo descrito anteriormente. Es posible que queramos cargar la tienda tal como está y simular servicios como `axios`. De esta manera, nos estamos burlando de los límites de nuestro sistema, logrando así un mayor grado de confianza en nuestras pruebas.

Puede consultar los documentos de [Probando Vuex](../vue-test-utils-en-profundidad/probando-vuex) para obtener más información sobre cómo probar Vuex con Vue Test Utils.

## Conclusión

- Vue Test Utils no requiere herramientas especiales para probar solicitudes HTTP. Lo único a tener en cuenta es que estamos probando un comportamiento asíncrono.
- Las pruebas no deben depender de servicios externos. Use herramientas de simulación como `vi.mock` para evitarlo.
- `flushPromises()` es una herramienta útil para asegurarse de que el DOM se actualice después de una operación asíncrona.
- La activación directa de solicitudes HTTP al interactuar con el componente hace que su prueba sea más resiliente.
