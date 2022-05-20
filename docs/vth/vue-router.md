# Vue Router

Dado que un enrutador generalmente involucra múltiples componentes que operan juntos, a menudo las pruebas de enrutamiento se realizan más arriba en la [pirámide de prueba](https://www.freecodecamp.org/news/the-front-end-test-pyramid-rethink-your-testing-3b343c2bca51), justo en el nivel de prueba de integración/e2e. Sin embargo, tener algunas pruebas unitarias en torno a su enrutamiento también puede ser beneficioso.

Al igual que las secciones anteriores, hay dos formas de probar los componentes que interactúan con un enrutador:

1. Usando una instancia del enrutador real
1. Simulando los objetos globales `$route` y `$router`

Dado que la mayoría de las aplicaciones de Vue usan el enrutador Vue oficial, esta guía se centrará en eso.

El código fuente de las pruebas descritas en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/App.spec.js) y [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/NestedRoute.spec.js).

## Creando los Componentes

Construiremos una `<App>` simple, que tiene una ruta `/ned-child`. Visitar `/nested-child` renderiza un componente `<NestedRoute>`. Cree un archivo `App.vue` e inserte el siguiente componente mínimo:

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>
```

`<NestedRoute>` es igual de mínimo:

```vue
<template>
  <div>Nested Route</div>
</template>

<script>
export default {
  name: "NestedRoute"
}
</script>
```

## Creando el Enrutador y las Rutas

Ahora necesitamos algunas rutas para probar. Empecemos con las rutas:

```js
// router/routes.js
import NestedRoute from "@/components/NestedRoute.vue"

export default [
  { path: "/nested-route", component: NestedRoute }
]
```

En una aplicación real, normalmente crearía un archivo `router.js` e importaría las rutas que hicimos, y escribiría algo como esto:

```js
//router/index.js
import { createRouter, createMemoryHistory } from "vue-router"
import routes from "./routes.js"

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
```

Y en el `main.js`

```js
// main.js
import { createApp } from 'vue'
import router from '@/router'
import App from './App.vue'

createApp(App)
  .use(router)
  .mount('#app')
```

Al igual que con Vuex, crearemos el enrutador prueba por prueba. Esto nos permitirá tener un control más detallado sobre el estado de la aplicación durante las pruebas unitarias.

## Escribiendo la Prueba

Veamos un poco de código, luego hablemos de lo que está pasando. Estamos probando `App.vue`, por lo que en `App.spec.js` agregue lo siguiente:

```js
import { mount } from "@vue/test-utils"
import App from "@/App.vue"
import { createRouter, createMemoryHistory } from "vue-router"
import NestedRoute from "@/components/NestedRoute.vue"
import routes from "@/router/routes.js"

describe("App", () => {
  it("renders a child component via routing", async () => {
    const router = createRouter({ 
      history: createMemoryHistory(),
      routes 
    })
    router.push("/nested-route")
    await router.isReady()
    const wrapper = mount(App, { 
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent(NestedRoute).exists()).toBe(true)
  })
})
```

- Observe que las pruebas son marcadas `await` y llaman `nextTick`. Ver [aquí](../vth/simulando-la-entrada-del-usuario.html#escribiendo-la-prueba) para más detalles sobre por qué.

Como de costumbre, comenzamos importando los distintos módulos para la prueba. En particular, estamos importando las rutas reales que usaremos para la aplicación. Esto es ideal de alguna manera: si el enrutamiento real se rompe, las pruebas unitarias deberían fallar, permitiéndonos solucionar el problema antes de implementar la aplicación.

Otro punto interesante es que estamos haciendo lo siguiente antes de montar el componente:

```js
router.push("/nested-route")
await router.isReady()
```

Vue Router 4 (el que funciona con Vue 3) tiene enrutamiento asíncrono. Eso significa que debemos asegurarnos de que el enrutador haya terminado el enrutamiento inicial antes de montar el componente. Esto se logra fácilmente con `await router.isReady()`.

Finalmente, tenga en cuenta que estamos usando `mount`. Si usamos `shallowMount`, `<router-link>` se talonará, independientemente de la ruta actual, se generará un componente talonado inútil.

## Solución alternativa para árboles de renderizado grandes usando `mount`

Usar `mount` está bien en algunos casos, pero a veces no es lo ideal. Por ejemplo, si está procesando todo su componente `<App>`, es probable que el árbol de procesamiento sea grande y contenga muchos componentes con sus propios componentes secundarios, etc. Muchos componentes secundarios activarán varios enlaces de ciclo de vida, haciendo solicitudes de API y demás.

Si está utilizando Vitest, su potente sistema de simulación proporciona una solución elegante a este problema. Simplemente puede simular los componentes secundarios, en este caso `<NestedRoute>`. Se puede usar el siguiente simulacro y la prueba anterior aún pasará:

```js{7,8,9,10,11}
import { mount } from "@vue/test-utils"
import App from "@/App.vue"
import { createRouter, createMemoryHistory } from "vue-router"
import NestedRoute from "@/components/NestedRoute.vue"
import routes from "@/router/routes.js"

vi.importMock("@/components/NestedRoute.vue",  () => ({
  name: "NestedRoute",
  template: "<div />"
}))

describe("App", () => {
  it("renders a child component via routing", async () => {
    const router = createRouter({ 
      history: createMemoryHistory(),
      routes 
    })
    router.push("/nested-route")
    await router.isReady()
    const wrapper = mount(App, { 
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent(NestedRoute).exists()).toBe(true)
  })
})
```

## Usando un Enrutador Simulado

A veces no es necesario un enrutador real. Actualicemos `<NestedRoute>` para mostrar un nombre de usuario basado en la cadena de consulta de la ruta actual. Esta vez usaremos TDD para implementar la función. Aquí hay una prueba básica que simplemente representa el componente y hace una afirmación:

```js
import { mount } from "@vue/test-utils"
import NestedRoute from "@/components/NestedRoute.vue"
import routes from "@/router/routes.js"

describe("NestedRoute", () => {
  it("renders a username from query string", () => {
    const username = "alice"
    const wrapper = mount(NestedRoute)

    expect(wrapper.find(".username").text()).toBe(username)
  })
})
```

Todavía no tenemos un `<div class="username">`, por lo que ejecutar la prueba nos da:

```
FAIL  tests/unit/NestedRoute.spec.js
  NestedRoute
    ✕ renders a username from query string (25ms)

  ● NestedRoute › renders a username from query string

    [vue-test-utils]: find did not return .username, cannot call text() on empty Wrapper
```

Actualizar `<NestedRoute>`:

```vue{4,5,6}
<template>
  <div>
    Nested Route
    <div class="username">
      {{ $route.params.username }}
    </div>
  </div>
</template>

<script>
export default {
  name: "NestedRoute"
}
</script>
```

Ahora la prueba falla con:

```
FAIL  tests/unit/NestedRoute.spec.js
  NestedRoute
    ✕ renders a username from query string (17ms)

  ● NestedRoute › renders a username from query string

    TypeError: Cannot read property 'params' of undefined
```

Esto se debe a que `$route` no existe. Podríamos usar un enrutador real, pero en este caso es más fácil usar la opción de montaje `mocks`:

```js{8,9,10,11,12,13,14,15,16}
import { mount } from "@vue/test-utils"
import NestedRoute from "@/components/NestedRoute.vue"

describe("NestedRoute", () => {
  it("renders a username from query string", () => {
    const username = "alice"
    const wrapper = mount(NestedRoute, {
      global: {
        mocks: {
          $route: {
            params: { username }
          }
        }
      }
    })

    expect(wrapper.find(".username").text()).toBe(username)
  })
})
```

Ahora pasa la prueba. En este caso, no hacemos ninguna navegación ni nada que dependa de la implementación del enrutador, por lo que usar `mocks` es bueno. Realmente no nos importa cómo aparece `username` en la cadena de consulta, solo que está presente.

A veces, el servidor manejará partes del enrutamiento, a diferencia del enrutamiento del lado del cliente con Vue Router. En tales casos, el uso de `mocks` para establecer la cadena de consulta en una prueba es una buena alternativa al uso de una instancia real de Vue Router.

## Estrategias para Probar Ganchos de Enrutador

Vue Router proporciona varios tipos de ganchos de enrutador, llamados ["protectores de navegación"](https://router.vuejs.org/guide/advanced/navigation-guards.html). Dos ejemplos de este tipo son:

1. Guardias globales (`router.beforeEach`). Declarado en la instancia del enrutador.
1. En protecciones de componentes, como `beforeRouteEnter`. Declarado en componentes.
     
Asegurarse de que se comporten correctamente suele ser un trabajo para una prueba de integración, ya que necesita que un usuario navegue de una ruta a otra. Sin embargo, también puede usar pruebas unitarias para ver si las funciones llamadas en los protectores de navegación funcionan correctamente y obtener comentarios más rápidos sobre posibles errores. Aquí hay algunas estrategias para desacoplar la lógica de los protectores de navegación y escribir pruebas unitarias alrededor de ellos.

## Guardias Globales

Digamos que tiene una función `bustCache`:

```js
// bust-cache.js
export function bustCache() {
}
```

Que debe llamarse en cada ruta que contiene el metacampo `shouldBustCache`. Tus rutas podrían verse así:

```js
// router/routes.js
import NestedRoute from "@/components/NestedRoute.vue"

export default [
  {
    path: "/nested-route",
    component: NestedRoute,
    meta: {
      shouldBustCache: true
    }
  }
]
```

Con el metacampo `shouldBustCache`, desea invalidar el caché actual para asegurarse de que el usuario no obtenga datos obsoletos. Una implementación podría verse así:

```js
import { createRouter, createMemoryHistory } from "vue-router"
import routes from "./routes.js"
import { bustCache } from "./bust-cache.js"

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.shouldBustCache)) {
    bustCache()
  }
  next()
})

export default router
```

En su prueba unitaria, **puede** importar la instancia del enrutador e intentar llamar a `beforeEach` escribiendo `router.beforeHooks[0]()`. Esto arrojará un error sobre `next` - ya que no pasó los argumentos correctos. En lugar de esto, una estrategia es desacoplar y exportar de forma independiente el gancho de navegación `beforeEach`, antes de acoplarlo al enrutador. Qué tal si:

```js{10,11,12,13,14,15,16,17,18}
import { createRouter, createMemoryHistory } from "vue-router"
import routes from "./routes.js"
import { bustCache } from "@/bust-cache.js"

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export function beforeEach(to, from, next) {
  if (to.matched.some(record => record.meta.shouldBustCache)) {
    bustCache()
  }
  next()
}

router.beforeEach((to, from, next) => beforeEach(to, from, next))

export default router
```

Ahora escribir una prueba es fácil, aunque un poco largo:


```js
import { beforeEach } from "@/router"
import * as mockModule from "@/bust-cache.js"

vi.mock("@/bust-cache.js", () => ({ bustCache: vi.fn() }))

describe("beforeEach", () => {
  afterEach(() => {
    mockModule.bustCache.mockClear()
  })

  it("busts the cache when going to /user", () => {
    const to = {
      matched: [{ meta: { shouldBustCache: true } }]
    }
    const next = vi.fn()

    beforeEach(to, undefined, next)

    expect(mockModule.bustCache).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it("does not bust the cache when going to /user", () => {
    const to = {
      matched: [{ meta: { shouldBustCache: false } }]
    }
    const next = vi.fn()

    beforeEach(to, undefined, next)

    expect(mockModule.bustCache).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
```

El principal punto de interés es que simulamos todo el módulo usando `vi.mock`, y reiniciamos el simulacro usando el gancho `afterEach`. Al exportar `beforeEach` como una función de JavaScript normal y desacoplada, se vuelve trivial de probar.

Para asegurarse de que el gancho realmente llame a `bustCache` y muestre los datos más recientes, una herramienta de prueba e2e como [Cypress.io](https://www.cypress.io/), puede ser usada.

## Guardias de Componentes

Los Guardias de componentes también son fáciles de probar, una vez que los ve como funciones de JavaScript regulares y desacopladas. Digamos que agregamos un enlace `beforeRouteLeave` a `<NestedRoute>`:

```vue{11,12,16,17,18,19,20}
<template>
  <div>
    Nested Route
    <div class="username">
      {{ $route.params.username }}
    </div>
  </div>
</template>

<script>
import { bustCache } from "@/bust-cache.js"

export default {
  name: "NestedRoute",

  beforeRouteLeave(to, from, next) {
    bustCache()
    next()
  }
}
</script>
```

Podemos probar esto exactamente de la misma manera que la guardia global:

```js{3,5,21,22,23,25,26}
import { shallowMount } from "@vue/test-utils"
import NestedRoute from "@/components/NestedRoute.vue"
import * as mockModule from "@/bust-cache.js"

vi.mock("@/bust-cache.js", () => ({ bustCache: vi.fn() }))

describe("NestedRoute", () => {
  it("calls bustCache and next when leaving the route", async () => {
    const username = "alice"
    const wrapper = shallowMount(NestedRoute,{
      global: {
        mocks: {
          $route: {
            params: { username }
          }
        }
      }
    });

    const next = vi.fn()
    NestedRoute.beforeRouteLeave.call(wrapper.vm, undefined, undefined, next)
    await wrapper.vm.$nextTick()

    expect(mockModule.bustCache).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
```

Observa que al estar completamente desacoplado se puede probar como funciones de JavaScript regulares, sin tener que montar el componente:

```js
import NestedRoute from "@/components/NestedRoute.vue"
import * as mockModule from "@/bust-cache.js"

vi.mock("@/bust-cache.js", () => ({ bustCache: vi.fn() }))

describe("NestedRoute", () => {
  // ...
  it("calls bustCache and next when leaving the route without component mount", () => {
    const next = vi.fn()
    NestedRoute.beforeRouteLeave(undefined, undefined, next)

    expect(mockModule.bustCache).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
```

Si bien este estilo de prueba unitaria puede ser útil para obtener comentarios inmediatos durante el desarrollo, dado que los enrutadores y los ganchos de navegación a menudo interactúan con varios componentes para lograr algún efecto, también debe tener pruebas de integración para asegurarse de que todo funcione como se espera.

## Conclusión

Esta guía cubrió:

- Prueba de componentes renderizados condicionalmente por Vue Router
- Simular los componentes de Vue usando `vi.mock` y `global.mocks`
- Desacoplar los guardias de navegación global del enrutador y probarlos de manera independiente
- Usando `vi.mock` para simular un módulo

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/App.spec.js) y [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/NestedRoute.spec.js).
