# Reduciendo Repetitividad en las Pruebas

> Este artículo está disponible como screencast en [Vue.js Courses](https://vuejs-course.com/screencasts/reducing-duplication-in-tests). Compruébalo [aquí](https://vuejs-course.com/screencasts/reducing-duplication-in-tests).

A menudo es ideal comenzar cada prueba unitaria con una copia nueva de un componente. Además, a medida que sus aplicaciones se vuelven más grandes y complejas, es probable que tenga algunos componentes con muchas propiedades diferentes y posiblemente varias bibliotecas de terceros, como Vuetify, VueRouter y Vuex instaladas. Esto puede hacer que sus pruebas tengan mucho código repetitivo, es decir, código que no está directamente relacionado con la prueba.

Este artículo toma componentes usando Vuex y VueRouter y demuestra algunos patrones para ayudarlo a reducir la cantidad de código de configuración para sus pruebas unitarias.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/Posts.spec.js).

## El Componente de Publicaciones

Este es el componente que probaremos. Muestra una propiedad de `message`, si se recibe una. Muestra un botón _New Post_ si el usuario está autenticado y algunas publicaciones. Tanto los objetos `authenticated` como los `posts` provienen de la tienda Vuex. Finalmente, renderiza el componente de `router-link`, mostrando un enlace a una publicación.

```vue
<template>
  <div>
    <div id="message" v-if="message">{{ message }}</div>

    <div v-if="authenticated">
      <router-link 
        class="new-post" 
        to="/posts/new"
      >
        New Post
      </router-link>
    </div>

    <h1>Posts</h1>
    <div 
      v-for="post in posts" 
      :key="post.id" 
      class="post"
    >
      <router-link :to="postLink(post.id)">
        {{ post.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Posts',
  props: {
    message: String,
  },

  computed: {
    authenticated() {
      return this.$store.state.authenticated
    },

    posts() {
      return this.$store.state.posts
    }
  },

  methods: {
    postLink(id) {
      return `/posts/${id}`
    }
  }
}
</script>
```

Tambien tenemos un estado de una tienda:

```js
//store/state.js
export default {
  authenticated: false,
  posts: []
}
```
y las siguientes mutaciones:

```js
//store/mutations.js
export default {
  ADD_POSTS(state, posts) {
    state.posts = [...state.posts, ...posts]
  },
  SET_AUTH(state, authenticated) {
    state.authenticated = authenticated
  }
}
```

Observe que tanto el `state` como las `mutations` están desacopladas de la tienda para fácilitar sus pruebas.

## Queremos probar:

- ¿Se renderiza el `message` cuando se recibe una propiedad?
- ¿Están correctamente renderizados los `posts`?
- ¿Se muestra el botón _New Post_ cuando `authenticated` es `false` y se oculta cuando es `false`?

Idealmente, las pruebas deben ser lo más concisas posible.

## Funciones de fábrica de Vuex/VueRouter

Un buen paso que puede tomar para hacer que las aplicaciones sean más comprobables es exportar las funciones de fábrica para Vuex y VueRouter:

```js
// store.js
export default createStore({ ... })
```

```js
// router.js
export default createRouter({ ... })
```

Esto está bien para una aplicación normal, pero no es ideal para realizar pruebas. Si hace esto, cada vez que use la tienda o el enrutador en una prueba, se compartirá con todas las demás pruebas que también lo importen. Idealmente, cada componente debería obtener una copia nueva de la tienda y el enrutador.

Una forma fácil de evitar esto es exportar una función de fábrica` - una función que devuelve una nueva instancia de un objeto. Por ejemplo:

```js
//test/createVuexStore.js
import { createStore } from 'vuex'
import state from '@/store/state'
import mutations from '@/store/mutations'

export default () => createStore({
  state() {
    return {
      ...state      
    }
  },
  mutations 
})
```

```js
//test/createVueRouter.js
import { createRouter, createMemoryHistory } from 'vue-router'

export default () => {
  return createRouter({
    history: createMemoryHistory(),
    routes : [{
      path: '/', component: {},
    }, {
      path: '/posts/:id',
      component: {}
    }]
  })
}
```

Esto es lo que estoy haciendo en el ejemplo de `Posts.vue` - el código de la tienda se encuentra [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/src/createStore.js) y el enrutador [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/src/createRouter.js).

## Las Pruebas (antes de la refactorización)

Ahora que sabemos cómo se ven `Posts.vue` y la tienda y el enrutador, podemos entender qué están haciendo las pruebas:

```js
import { mount } from '@vue/test-utils'
import Posts from '@/components/Posts.vue'
import createVueRouter from './createVueRouter'
import createVuexStore from './createVuexStore'

describe('Posts.vue', () => {
  it('renders a message if passed', () => {
    const store = createVuexStore()
    const router = createVueRouter()
    const message = 'New content coming soon!'
    const wrapper = mount(Posts, {
      global: {
        plugins: [store, router]
      },
      props: { message },
    })

    expect(wrapper.find("#message").text()).toBe('New content coming soon!')
  })

  it('renders posts', async () => {
    const store = createVuexStore()
    const router = createVueRouter()
    const message = 'New content coming soon!'
    const wrapper = mount(Posts, {
      global: {
        plugins: [store, router]
      },
      props: { message },
    })

    wrapper.vm.$store.commit('ADD_POSTS', [{ id: 1, title: 'Post' }])
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.post').length).toBe(1)
  })
})
```

Esto no prueba completamente todas las condiciones; es un ejemplo mínimo y suficiente para comenzar. Observe la duplicación y la repetición - deshagámonos de eso.

## Una función `createWrapper` Personalizada

Las pocas líneas de cada prueba son las mismas:

```js
const store = createVuexStore()
const router = createVueRouter()

return mount(component, {
  global: {
    plugins: [store, router]
  },
  props: { message }
})
```

Arreglemos eso con una función llamada `createWrapper`. Se ve algo como esto:

```js
const createWrapper = () => {
  const store = createVuexStore()
  const router = createVueRouter()
  return { store, router }
}
```

Ahora hemos encapsulado toda la lógica en una sola función. Devolvemos el `store` y el `router` ya que necesitamos pasarlos a la función `mount`.

Si refactorizamos la primera prueba usando `createWrapper`, se ve así:

```js{2}
it('renders a message if passed', () => {
  const { store, router } = createWrapper()
  const message = 'New content coming soon!'
  const wrapper = mount(Posts, {
    global: {
      plugins: [store, router]
    },
    props: { message },
  })

  expect(wrapper.find("#message").text()).toBe('New content coming soon!')
})
```

Un poco más conciso. Refactoricemos la segunda prueba, que hace uso de la tienda de Vuex.

```js{2}
it('renders posts', async () => {
  const { store, router } = createWrapper()
  const message = 'New content coming soon!'
  const wrapper = mount(Posts, {
    global: {
      plugins: [store, router]
    },
    props: { message },
  })

  wrapper.vm.$store.commit('ADD_POSTS', [{ id: 1, title: 'Post' }])
  await wrapper.vm.$nextTick()

  expect(wrapper.findAll('.post').length).toBe(1)
})
```


## Mejorando la función `createWrapper`

Si bien el código anterior es definitivamente una mejora, al comparar esto con la prueba anterior, podemos notar que aproximadamente la mitad del código aún está duplicado. Abordemos esto actualizando la función `createWrapper` para manejar también el montaje del componente.

```js{1,5,6,7,8,9,10}
const createWrapper = (component, options = {}) => {
  const store = createVuexStore()
  const router = createVueRouter()

  return mount(component, {
    global: {
      plugins: [store, router],
    },
    ...options
  })
}
```

Ahora podemos simplemente llamar a `createWrapper` y tener una copia nueva del componente, lista para probar. Nuestras pruebas son muy concisas ahora.

```js{3,4,5,6,11,12}
it('renders a message if passed', () => {
  const message = 'New content coming soon!'
  const wrapper = createWrapper(Posts, {
    props: { message },
  })

  expect(wrapper.find("#message").text()).toBe('New content coming soon!')
})

it('renders posts', async () => {
  const wrapper = createWrapper(Posts)

  wrapper.vm.$store.commit('ADD_POSTS', [{ id: 1, title: 'Post' }])
  await wrapper.vm.$nextTick()

  expect(wrapper.findAll('.post').length).toBe(1)
})
```

## Configuración del Estado Inicial de Vuex

Una mejora que podemos hacer es cómo llenamos la tienda Vuex. En una aplicación real, es probable que su almacenamiento sea complejo, y tener que hacer `commit` y `dispatch` muchas mutaciones y acciones diferentes para que su componente alcance el estado que desea probar no es lo ideal. Podemos hacer un pequeño cambio en nuestra función `createVuexStore`, lo que facilita establecer el estado inicial:

```js
// tests/createVuexStore.js
export default (initialState = {}) => createStore({
  state() {
    return {
      ...state,
      ...initialState      
    }
  },
  mutations 
})
```

Ahora podemos cambiar el estado inicial deseado a la función `createVuexStore` a través de `createWrapper`:

```js{1,2}
const createWrapper = (component, options = {}, storeState = {}) => {
  const store = createVuexStore(storeState)
  const router = createVueRouter()

  return mount(component, {
    global: {
      plugins: [store, router],
    },
    ...options
  })
}
```

Ahora nuestra prueba ahora se puede escribir de la siguiente manera:

```js
it('renders posts', async () => {
  const wrapper = createWrapper(Posts, {}, {
    posts: [{ id: 1, title: 'Post' }]
  })

  expect(wrapper.findAll('.post').length).toBe(1)
})
```

## Estableciendo las Rutas 

Por último, hagamos un pequeño cambio en `createVueRouter`

```js{3,11,12}
import { createRouter, createMemoryHistory } from 'vue-router'

export default (routes) => {
  return createRouter({
    history: createMemoryHistory(),
    routes : [
       {
         path: '/',
         component: {}
       },
       ...routes
    ]
  })
}
```

Con esta mejora que acabamos de hacer en `createVueRouter` pasaremos sólo las ruta que nos interesa probar. Observe que por defecto siempre debe declarar la raiz.

Ahora refactoricemos todas las pruebas:

```js{10,11,13,14,25,26,27,28,29,30,31,32,44,46,53,54,60,66}
import { mount } from '@vue/test-utils'
import Posts from '@/components/Posts.vue'
import { createVueRouter } from './createRouter'
import { createVuexStore } from './createStore'

const createWrapper = (
    component,
    options = {},
    storeState = {},
    routes = []
  ) => {
  const store = createVuexStore(storeState)
  const router = createVueRouter(routes)

  return mount(component, {
    global: {
      plugins: [store, router],
    },
    ...options
  })
}

describe('Posts.vue', () => {

  const routes = [{
    path: '/posts/:id',
    component: {}
  }]

  const post = { id: 1, title: 'Post' }

  it('renders a message if passed', () => {
    const message = 'New content coming soon!'
    const wrapper = createWrapper(Posts, {
      props: { message },
    })

    expect(wrapper.find("#message").text()).toBe('New content coming soon!')
  })

  it('renders posts', async () => {
    const wrapper = createWrapper(Posts, {}, {}, routes)

    wrapper.vm.$store.commit('ADD_POSTS', [post])
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.post').length).toBe(1)
  })

  it('renders posts with with another way ', async () => {
    const wrapper = createWrapper(Posts, {}, { posts: [post] }, routes)

    expect(wrapper.findAll('.post').length).toBe(1)
  })

  it('renders with new post if authenticated', async () => {
    const wrapper = createWrapper(Posts, {}, { authenticated: true}, routes)

    expect(wrapper.find(".new-post").text()).toBe('New Post')
  })

  it('renders without new post if authenticated', async () => {
    const wrapper = createWrapper(Posts, {}, { authenticated: false}, routes)

    expect(wrapper.html()).not.toContain('New Post')
  })
})
```

¡Esta es una gran mejora! Pasamos de una prueba en la que aproximadamente la mitad del código era repetitivo y no estaba realmente relacionado con la afirmación, a dos líneas; uno para preparar el componente para la prueba y otro para la aserción.

Otra ventaja de este refactor es que tenemos una función `createWrapper` flexible, que podemos usar para todas nuestras pruebas.

## Mejoras

Hay algunas otras mejoras potenciales:

- Actualice la función `createVuexStore` para permitir establecer el estado inicial de los módulos con espacio de nombres de Vuex
- Mejorar `createVueRouter` para establecer una ruta específica (listo)
- Mejorar `createWrapper` para pasar otro tipos de objetos globales
- Permitir que el usuario pase un argumento `shallow` o `mount` a `createWrapper`

## Conclusión

Esta guía discutió:

- Usando funciones de fábrica para obtener una nueva instancia de un objeto
- Reducción de repetitición y duplicación por extracto de comportamiento común

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/Posts.spec.js). También está disponible como screencast en [Vue.js Courses](https://vuejs-course.com/screencasts/reducing-duplication-in-tests).
