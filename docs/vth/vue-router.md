## Vue Router

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
import { createRouter, createWebHistory } from "vue-router"
import routes from "./routes.js"

const router = createRouter({
  history: createWebHistory(),
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
import { createRouter, createWebHistory } from "vue-router"
import NestedRoute from "@/components/NestedRoute.vue"
import routes from "@/router/routes.js"

describe("App", () => {
  it("renders a child component via routing", async () => {
    const router = createRouter({ 
      history: createWebHistory(),
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

- Observe que las pruebas son marcadas `await` y llama `nextTick`. Ver [aquí](../vth/simulando-la-entrada-del-usuario.html#escribiendo-la-prueba) para más detalles sobre por qué.

Como de costumbre, comenzamos importando los distintos módulos para la prueba. En particular, estamos importando las rutas reales que usaremos para la aplicación. Esto es ideal de alguna manera: si el enrutamiento real se rompe, las pruebas unitarias deberían fallar, permitiéndonos solucionar el problema antes de implementar la aplicación.

Otro punto interesante es que estamos haciendo lo siguiente antes de montar el componente:

```js
router.push("/nested-route")
await router.isReady()
```

Vue Router 4 (el que funciona con Vue 3) tiene enrutamiento asíncrono. Eso significa que debemos asegurarnos de que el enrutador haya terminado el enrutamiento inicial antes de montar el componente. Esto se logra fácilmente con `await router.isReady()`.

Finalmente, tenga en cuenta que estamos usando `mount`. Si usamos `shallowMount`, `<router-link>` se eliminará, independientemente de la ruta actual, se generará un componente talonado inútil.

## Solución alternativa para árboles de renderizado grandes usando `mount`

Usar `mount` está bien en algunos casos, pero a veces no es lo ideal. Por ejemplo, si está procesando todo su componente `<App>`, es probable que el árbol de procesamiento sea grande y contenga muchos componentes con sus propios componentes secundarios, etc. Muchos componentes secundarios activarán varios enlaces de ciclo de vida, haciendo solicitudes de API y demás.

Si está utilizando Vitest, su potente sistema de simulación proporciona una solución elegante a este problema. Simplemente puede simular los componentes secundarios, en este caso `<NestedRoute>`. Se puede usar el siguiente simulacro y la prueba anterior aún pasará:

```js
vi.importMock("@/components/NestedRoute.vue", () => ({
  name: "NestedRoute",
  template: "<div />"
}))
```
