# Probando Vue Router

Este artículo presentará dos formas de probar una aplicación usando Vue Router:

- Usar el enrutador Vue real, que es más parecido a la producción pero también puede generar complejidad al probar aplicaciones más grandes
- Usar un enrutador simulado, lo que permite un control más detallado del entorno de prueba.

Tenga en cuenta que Vue Test Utils no proporciona ninguna función especial para ayudar con la prueba de componentes que dependen de Vue Router.

## Usar un Enrutador Simulado

Puede usar un enrutador simulado para evitar preocuparse por los detalles de implementación de Vue Router en sus pruebas unitarias.

En lugar de usar una instancia real de Vue Router, podemos crear una versión simulada que solo implemente las funciones que nos interesan. Podemos hacer esto usando una combinación de `vi.mock` (si está usando Vitest) y `global.components`.

Cuando nos burlamos de una dependencia, normalmente es porque **no estamos interesados en probar su comportamiento**. No queremos probar que hacer click en `<router-link>` navega a la página correcta, ¡por supuesto que sí! Sin embargo, podríamos estar interesados en asegurarnos de que `<a>` tenga el atributo correcto.

¡Veamos un ejemplo más realista! Este componente muestra un botón que redirigirá a un usuario autenticado a la página de edición de publicación (según los parámetros de ruta actuales). Un usuario no autenticado debe ser redirigido a una ruta `/404`.

```js
const Component = {
  template: `<button @click="redirect">Click to Edit</button>`,
  props: ['isAuthenticated'],
  methods: {
    redirect() {
      if (this.isAuthenticated) {
        this.$router.push(`/posts/${this.$route.params.id}/edit`)
      } else {
        this.$router.push('/404')
      }
    }
  }
}
```
Podríamos usar un enrutador real, luego navegar a la ruta correcta para este componente, luego, después de hacer click en el botón, afirmar que se muestra la página correcta... sin embargo, esta es una gran cantidad de configuración para una prueba relativamente simple. En esencia, la prueba que queremos escribir es "si está autenticado, redirigir a X, de lo contrario, redirigir a Y". Veamos cómo podríamos lograr esto burlándonos del enrutamiento usando la propiedad `global.mocks`:

```js
import { mount } from '@vue/test-utils'

const Component = {
  // omitted for brevity ...
}

test('allows authenticated user to edit a post', async () => {
  const mockRoute = {
    params: {
      id: 1
    }
  }
  const mockRouter = {
    push: vi.fn()
  }

  const wrapper = mount(Component, {
    props: {
      isAuthenticated: true
    },
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await wrapper.find('button').trigger('click')

  expect(mockRouter.push).toHaveBeenCalledTimes(1)
  expect(mockRouter.push).toHaveBeenCalledWith('/posts/1/edit')
})

test('redirect an unauthenticated user to 404', async () => {
  const mockRoute = {
    params: {
      id: 1
    }
  }
  const mockRouter = {
    push: vi.fn()
  }

  const wrapper = mount(Component, {
    props: {
      isAuthenticated: false
    },
    global: {
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    }
  })

  await wrapper.find('button').trigger('click')

  expect(mockRouter.push).toHaveBeenCalledTimes(1)
  expect(mockRouter.push).toHaveBeenCalledWith('/404')
})
```
Usamos `global.mocks` para proporcionar las dependencias necesarias (`this.$route` y `this.$router`) para establecer un estado ideal para cada prueba.

Entonces pudimos usar `vi.fn()` para monitorear cuántas veces, y con qué argumentos, se llamó a `this.$router.push`. ¡Lo mejor de todo es que no tenemos que lidiar con la complejidad o las advertencias de Vue Router en nuestra prueba! Solo nos preocupamos por probar la lógica de la aplicación.

:::tip CONSEJO

Es posible que desee probar todo el sistema de forma integral. Podría considerar un marco como [Cypress](https://www.cypress.io/) para pruebas completas del sistema utilizando un navegador real.
:::

## Usar un Enrutador Real

::: warning Recordatorio
Para probar ejemplos con el [VueRouter](https://router.vuejs.org/installation.html) real es necesario tenerlo instalado:
```
npm i vue-router@4
```
:::

Ahora que hemos visto cómo usar un enrutador simulado, echemos un vistazo al uso del Vue Router real.

Vamos a crear una aplicación de blogs básica que use Vue Router. Las publicaciones se enumeran en la ruta `/posts`:

```js
const App = {
  template: `
    <router-link to="/posts">Go to posts</router-link>
    <router-view />
  `
}

const Posts = {
  template: `
    <h1>Posts</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.name }}
      </li>
    </ul>
  `,
  data() {
    return {
      posts: [{ id: 1, name: 'Testing Vue Router' }]
    }
  }
}
```
La raíz de la aplicación muestra un `<router-link>` que conduce a `/posts`, donde enumeramos las publicaciones.

El enrutador real se ve así. Tenga en cuenta que estamos exportando las rutas por separado de la ruta, de modo que podamos crear una instancia de un nuevo enrutador para cada prueba individual más adelante.

```js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: {
      template: 'Welcome to the blogging app'
    }
  }, {
    path: '/posts',
    component: Posts
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})
```
La mejor manera de ilustrar cómo probar una aplicación usando Vue Router es dejar que las advertencias nos guíen. La siguiente prueba mínima es suficiente para ponernos en marcha:

```js{11,12,13,14,15}
import { mount } from '@vue/test-utils'

const App = {
  // omitted for brevity ...
}

const Posts = {
  // omitted for brevity ...
}

test('routing', () => {
  const wrapper = mount(App)
  expect(wrapper.html()).toContain('Welcome to the blogging app')
})
```
La prueba falla. También imprime dos advertencias:
```
console.warn node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:39
  [Vue warn]: Failed to resolve component: router-link

console.warn node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:39
  [Vue warn]: Failed to resolve component: router-view
```
No se encuentran los componentes `<router-link>` y `<router-view>`. ¡Necesitamos instalar Vue Router! Dado que Vue Router es un complemento, lo instalamos usando la opción de montaje `global.plugins`:

```js{2,23,24,25}
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

const App = {
  // omitted for brevity ...
}

const Posts = {
  // omitted for brevity ...
}

const route = [
  // omitted for brevity ...
];

const router = createRouter({
  // omitted for brevity ...
})

test('routing', () => {  
  const wrapper = mount(App, {
    global: {
      plugins: [router]
    }
  })
  
  expect(wrapper.html()).toContain('Welcome to the blogging app')
})
```
Esas dos advertencias ya no están, pero ahora tenemos otra advertencia:

```
console.warn node_modules/vue-router/dist/vue-router.cjs.js:225
  [Vue Router warn]: Unexpected error when starting the router: TypeError: Cannot read property '_history' of null
```
Aunque no está del todo claro en la advertencia, está relacionado con el hecho de que **Vue Router 4 maneja el enrutamiento de forma asíncrona**.

Vue Router proporciona una función `isReady` que nos dice cuándo el enrutador está listo. Luego podemos usar `await` para asegurarnos de que se haya realizado la navegación inicial.

```js{22,23,24,25,26}
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

const App = {
  // omitted for brevity ...
}

const Posts = {
  // omitted for brevity ...
}

const route = [
  // omitted for brevity ...
];

const router = createRouter({
  // omitted for brevity ...
})

test('routing', () => {
  router.push('/')

  // After this line, router is ready
  await router.isReady()
  
  const wrapper = mount(App, {
    // omitted for brevity ...
  })
  
  expect(wrapper.html()).toContain('Welcome to the blogging app')
})
```
¡La prueba ahora está pasando! Fue bastante trabajo, pero ahora nos aseguramos de que la aplicación navegue correctamente a la ruta inicial.

Ahora naveguemos a `/posts` y asegurémonos de que el enrutamiento funcione como se esperaba:

```js{33,34,35}
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

const App = {
  // omitted for brevity ...
}

const Posts = {
  // omitted for brevity ...
}

const route = [
  // omitted for brevity ...
];

const router = createRouter({
  // omitted for brevity ...
})

test('routing', () => {
  router.push('/')

  // After this line, router is ready
  await router.isReady()
  
  const wrapper = mount(App, {
    // omitted for brevity ...
  })
  
  expect(wrapper.html()).toContain('Welcome to the blogging app')
    
  await wrapper.find('a').trigger('click')
  expect(wrapper.html()).toContain('Testing Vue Router')
})
```
Nuevamente, otro error algo críptico:
```
console.warn node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:39
  [Vue warn]: Unhandled error during execution of native event handler
    at <RouterLink to="/posts" >

console.error node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:211
  TypeError: Cannot read property '_history' of null
```
Nuevamente, debido a la nueva naturaleza asíncrona de Vue Router 4, necesitamos `await` para que se complete el enrutamiento antes de hacer cualquier afirmación.

En este caso, sin embargo, no hay un enlace _hasNavigated_ en el que podamos esperar. Una alternativa es utilizar la función `flushPromises` exportada desde Vue Test Utils:
```js{1,34,35}
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

const App = {
  // omitted for brevity ...
}

const Posts = {
  // omitted for brevity ...
}

const route = [
  // omitted for brevity ...
];

const router = createRouter({
  // omitted for brevity ...
})

test('routing', () => {
  router.push('/')

  // After this line, router is ready
  await router.isReady()
  
  const wrapper = mount(App, {
    // omitted for brevity ...
  })
  
  expect(wrapper.html()).toContain('Welcome to the blogging app')
    
  await wrapper.find('a').trigger('click')
  await flushPromises()
  expect(wrapper.html()).toContain('Testing Vue Router')
})
```
_Finalmente_ pasa. ¡Estupendo! Sin embargo, todo esto es muy manual, y esto es para una aplicación pequeña y trivial. Esta es la razón por la que usar un enrutador simulado es un enfoque común cuando se prueban componentes de Vue usando Vue Test Utils. En caso de que prefiera seguir usando un enrutador real, tenga en cuenta que cada prueba debe usar su propia instancia del enrutador de la siguiente manera:
```js{40,41,42,43,44,41,42,43,44,45,46,47,48}
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

const App = {
  template: `
    <router-link to="/posts">Go to posts</router-link>
    <router-view />
  `
}

const Posts = {
  template: `
    <h1>Posts</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.name }}
      </li>
    </ul>
  `,
  data() {
    return {
      posts: [{ id: 1, name: 'Testing Vue Router' }]
    }
  }
}

const routes = [
  {
    path: '/',
    component: {
      template: 'Welcome to the blogging app'
    }
  }, {
    path: '/posts',
    component: Posts
  }
];

let router;
beforeEach(async () => {
  router = createRouter({
    history: createWebHistory(),
    routes: routes,
  })
});

test('routing', async () => {
  router.push('/')

  // After this line, router is ready
  await router.isReady()

  const wrapper = mount(App, {
    global: {
      plugins: [router]
    }
  })
  expect(wrapper.html()).toContain('Welcome to the blogging app')
  
  await wrapper.find('a').trigger('click')
  await flushPromises()
  expect(wrapper.html()).toContain('Testing Vue Router')
})
```
## Uso de un enrutador simulado con la Composition API

Vue router 4 permite trabajar con el enrutador y la ruta dentro de la función de configuración con la Composition API.

Considere el mismo componente de demostración reescrito usando la Composition API.

```js
import { useRouter, useRoute } from 'vue-router'

const Component = {
  template: `<button @click="redirect">Click to Edit</button>`,
  props: ['isAuthenticated'],
  setup (props) {
    const router = useRouter()
    const route = useRoute()

    const redirect = () => {
      if (props.isAuthenticated) {
        router.push(`/posts/${route.params.id}/edit`)
      } else {
        router.push('/404')
      }
    }

    return {
      redirect
    }
  }
}
```
Esta vez, para probar el componente, usaremos la capacidad de Vitest para simular un recurso importado, `vue-router` y simular tanto el enrutador como la ruta directamente.

```js
import { mount, flushPromises } from '@vue/test-utils'
import { useRouter, useRoute } from 'vue-router'

const Component = {
  // omitted for brevity ...
}

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: () => {}
  }))
}))

test('allows authenticated user to edit a post', async () => {
  useRoute.mockImplementationOnce(() => ({
    params: {
      id: 1
    }
  }))

  const push = vi.fn()
  useRouter.mockImplementationOnce(() => ({
    push
  }))

  const wrapper = mount(Component, {
    props: {
      isAuthenticated: true
    },
    global: {
      stubs: ["router-link", "router-view"], // Stubs for router-link and router-view in case they're rendered in your template
    }
  })

  await wrapper.find('button').trigger('click')

  expect(push).toHaveBeenCalledTimes(1)
  expect(push).toHaveBeenCalledWith('/posts/1/edit')
})

test('redirect an unauthenticated user to 404', async () => {
  useRoute.mockImplementationOnce(() => ({
    params: {
      id: 1
    }
  }))

  const push = vi.fn()
  useRouter.mockImplementationOnce(() => ({
    push
  }))

  const wrapper = mount(Component, {
    props: {
      isAuthenticated: false
    },
    global: {
      stubs: ["router-link", "router-view"], // Stubs for router-link and router-view in case they're rendered in your template
    }
  })

  await wrapper.find('button').trigger('click')

  expect(push).toHaveBeenCalledTimes(1)
  expect(push).toHaveBeenCalledWith('/404')
})
```
## Usando un enrutador real con la Composition API

El uso de un enrutador real con la Composition API funciona igual que el uso de un enrutador real con la Options API. Tenga en cuenta que, al igual que ocurre con la Options API, se considera una buena práctica crear una instancia de un nuevo objeto de enrutador para cada prueba, en lugar de importar el enrutador directamente desde su aplicación.
```js
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'

const Component = {
  template: `<button @click="redirect">Click to Edit</button>`,
  props: ['isAuthenticated', 'id'],
  setup (props) {
    const router = useRouter()
    const route = useRoute()

    const redirect = () => {      
      if (props.isAuthenticated) {
        router.push(`/posts/${props.id}/edit`)
      } else {
        router.push('/404')
      }
    }

    return {
      redirect
    }
  }
}

const routes = [
  {
    path: '/',
    component: {
      template: 'Welcome to the blogging app'
    }
  }, {
    path: '/posts/:id/edit',
    component: Component,
    props: true
  }
];

let router;

beforeEach(async () => {
  router = createRouter({
    history: createWebHistory(),
    routes,
  })

  router.push('/')
  await router.isReady()
});

test('allows not authenticated user to edit a post', async () => {

  const wrapper = mount(Component, {
    props: {
      isAuthenticated: false,      
    },
    global: {
      plugins: [router],
    }
  })

  const pushSpy = vi.spyOn(router, 'push');
  
  await wrapper.find('button').trigger('click')

  expect(pushSpy).toHaveBeenCalledTimes(1)
  expect(pushSpy).toHaveBeenCalledWith('/404')
})

test('allows authenticated user to edit a post', async () => {
  
  const wrapper = mount(Component, {
    props: {
      isAuthenticated: true,
      id: 1     
    },
    global: {
      plugins: [router]
    }    
  })

  const pushSpy = vi.spyOn(router, 'push')
  
  await wrapper.find('button').trigger('click')

  expect(pushSpy).toHaveBeenCalledTimes(1)
  expect(pushSpy).toHaveBeenCalledWith('/posts/1/edit')
})
```
Para aquellos que prefieren un enfoque no manual, la biblioteca [vue-router-mock](https://github.com/posva/vue-router-mock) creada por Posva también está disponible como alternativa.

## Conclusión

- Puede usar una instancia de enrutador real en sus pruebas.
- Sin embargo, hay algunas advertencias: Vue Router 4 es asíncrono y debemos tenerlo en cuenta al escribir pruebas.
- Para aplicaciones más complejas, considere simular la dependencia del enrutador y concéntrese en probar la lógica subyacente.
- Utilice la funcionalidad de creación de _stubbing/mocking_ de su ejecutor de pruebas siempre que sea posible.
- Use `global.mocks` para simular dependencias globales, como `this.$route` y `this.$router`.
