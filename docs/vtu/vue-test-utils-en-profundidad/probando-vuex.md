# Probando Vuex

Vuex es solo un detalle de implementación; no se requiere ningún tratamiento especial para probar componentes usando Vuex. Dicho esto, existen algunas técnicas que pueden hacer que sus pruebas sean más fáciles de leer y escribir. Los veremos aquí.

Esta guía asume que está familiarizado con Vuex. Vuex 4 es la versión que funciona con Vue.js 3. Lea los documentos [aquí](https://vuex.vuejs.org/). Recuerde haberlo instalado para probar algunos ejemplos relacionados:
```
npm i vuex@next --save
```
## Un Ejemplo Simple

Aquí hay una tienda Vuex simple y un componente que se basa en que una tienda Vuex esté presente:

```js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      count: 0
    }
  },
  mutations: {
    increment(state) {
      state.count += 1
    }
  }
})
```
La tienda simplemente almacena un contador, aumentándolo cuando se confirma la mutación de `increment`. Este es el componente que probaremos:

```js
const App = {
  template: `
    <div>
      <button @click="increment" />
      Count: {{ count }}
    </div>
  `,
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment')
    }
  }
}
```

## Prueba con una Tienda Vuex Real
Para probar completamente que este componente y la tienda Vuex están funcionando, haremos click en el `<button>` y afirmaremos que el conteo aumenta. En sus aplicaciones Vue, generalmente en `main.js`, instala Vuex así:

```js
const app = createApp(App)
app.use(store)
```
Esto se debe a que Vuex es un complemento. Los complementos se aplican llamando a `app.use` y pasando el complemento.

Vue Test Utils también le permite instalar complementos, utilizando la opción de montaje `global.plugins`.

```js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      count: 0
    }
  },
  mutations: {
    increment(state) {
      state.count += 1
    }
  }
})

test('vuex', async () => {
  const wrapper = mount(App, {
    global: {
      plugins: [store]
    }
  })

  await wrapper.find('button').trigger('click')

  expect(wrapper.html()).toContain('Count: 1')
})
```
Después de instalar el complemento, usamos `trigger` para hacer click en el botón y afirmar que `count` aumente. Este tipo de prueba, que cubre la interacción entre diferentes sistemas (en este caso, el Componente y la tienda), se conoce como prueba de integración.

## Prueba con una Tienda Simulada

Por el contrario, una prueba unitaria podría aislar y probar el componente y la tienda por separado. Esto puede ser útil si tiene una aplicación muy grande con una tienda compleja. Para este caso de uso, puede simular las partes de la tienda que le interesan usando `global.mocks`:

```js
import { mount } from '@vue/test-utils'

const App = {
  template: `
    <div>
      <button @click="increment" />
      Count: {{ count }}
    </div>
  `,
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment')
    }
  }
}

test('vuex using a mock store', async () => {
  const $store = {
    state: {
      count: 25
    },
    commit: vi.fn()
  }

  const wrapper = mount(App, {
    global: {
      mocks: {
        $store
      }
    }
  })

  expect(wrapper.html()).toContain('Count: 25')
  await wrapper.find('button').trigger('click')
  expect($store.commit).toHaveBeenCalled()
})
```
En lugar de usar una tienda Vuex real e instalarla a través de `global.plugins`, creamos nuestra propia tienda simulada, implementando solo las partes de Vuex utilizadas en el componente (en este caso, las funciones de `state` y `commit`).

Si bien puede parecer conveniente probar la tienda de forma aislada, tenga en cuenta que no le avisará si rompe su tienda Vuex. Considere cuidadosamente si quiere simular la tienda Vuex o usar una real, y comprenda las compensaciones.

## Probar Vuex de forma aislada

Es posible que desee probar sus mutaciones o acciones de Vuex en total aislamiento, especialmente si son complejas. No necesita Vue Test Utils para esto, ya que una tienda Vuex es solo JavaScript normal. Así es como puede probar la mutación de `increment` sin Vue Test Utils:

```js
import { createStore } from 'vuex'

test('increment mutation', () => {
  const store = createStore({
    state: {
      count: 0
    },
    mutations: {
      increment(state) {
        state.count += 1
      }
    }
  })

  store.commit('increment')

  expect(store.state.count).toBe(1)
})
```
## Preestablecimiento del Estado de Vuex

A veces puede ser útil tener la tienda Vuex en un estado específico para una prueba. Una técnica útil que puede usar, además de `global.mocks`, es crear una función que envuelva `createStore` y tome un argumento para inicializar el estado inicial. En este ejemplo, extendemos `increment` para tomar un argumento adicional, que se agregará a `state.count`. Si no se proporciona, simplemente incrementamos `state.count` en 1.

```js
import { createStore } from 'vuex'

const createVuexStore = (initialState) =>
  createStore({
    state: {
      count: 0,
      ...initialState
    },
    mutations: {
      increment(state, value = 1) {
        state.count += value
      }
    }
  })

test('increment mutation without passing a value', () => {
  const store = createVuexStore({ count: 20 })
  store.commit('increment')
  expect(store.state.count).toBe(21)
})

test('increment mutation with a value', () => {
  const store = createVuexStore({ count: -10 })
  store.commit('increment', 15)
  expect(store.state.count).toBe(5)
})
```
Al crear una función `createVuexStore` que toma un estado inicial, podemos establecer fácilmente el estado inicial. Esto nos permite probar todos los casos extremos, mientras simplificamos nuestras pruebas.

El [Manual de Pruebas de Vue](https://lmiller1990.github.io/vue-testing-handbook/testing-vuex.html) tiene más ejemplos para probar Vuex. Nota: los ejemplos pertenecen a Vue.js 2 y Vue Test Utils v1. Las ideas y los conceptos son los mismos, y el Manual de pruebas de Vue se actualizará para Vue.js 3 y Vue Test Utils 2 en un futuro próximo.

## Pruebas con la Composition API

Se accede a Vuex a través de una función `useStore` cuando se usa la Composition API. [Lea más sobre esto aquí](https://next.vuex.vuejs.org/guide/composition-api.html).

`useStore` se puede usar con una clave de inyección única y opcional, como se explica [en la documentación de Vuex](https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function).

Se ve así:

```js
import { createStore } from 'vuex'
import { createApp } from 'vue'

// create a globally unique symbol for the injection key
const key = Symbol()

const App = {
  setup () {
    // use unique key to access store
    const store = useStore(key)
  }
}

const store = createStore({ /* ... */ })
const app = createApp({ /* ... */ })

// specify key as second argument when calling app.use(store)
app.use(store, key)
```
Para evitar repetir el paso del parámetro clave cada vez que se usa `useStore`, la documentación de Vuex recomienda extraer esa lógica en una función auxiliar y reutilizar esa función en lugar de la función `useStore` predeterminada. [Lea más sobre esto aquí](https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function). El enfoque que proporciona una tienda usando Vue Test Utils depende de la forma en que se usa la función `useStore` en el componente.

## Prueba de Componentes que Utilizan useStore sin una Clave de Inyección

Sin una clave de inyección, los datos almacenados pueden simplemente inyectarse en el componente a través de la opción de montaje de `provide` global. El nombre de la tienda inyectada debe ser el mismo que el del componente, e.g. "store".

## Ejemplo para proporcionar `useStore` sin clave

```js
import { createStore } from 'vuex'

const store = createStore({
  // ...
})

const wrapper = mount(App, {
  global: {
    provide: {
      store: store
    },
  },
})
```
## Prueba de Componentes que Utilizan `useStore` con una Clave de Inyección

Al usar la tienda con una clave de inyección, el enfoque anterior no funcionará. `useStore` no devolverá la instancia de la tienda. Para acceder a la tienda correcta, se debe proporcionar el identificador.

Tiene que ser la clave exacta que se pasa a `useStore` en la función `setup` del componente o al `useStore` dentro de la función auxiliar personalizada. Dado que los símbolos de JavaScript son únicos y no se pueden volver a crear, es mejor exportar la clave desde la tienda real.

Puede usar `global.provide` con la clave correcta para inyectar la tienda, o `global.plugins` para instalar la tienda y especificar la clave:

## Proporcionar el `useStore` con clave usando `global.provide`
```js
// store.js
export const key = Symbol()
```
```js
// app.spec.js
import { createStore } from 'vuex'
import { key } from './store'

const store = createStore({ /* ... */ })

const wrapper = mount(App, {
  global: {
    provide: {
      [key]: store
    },
  },
})
```
## Proporcionar el `useStore` con Clave usando `global.plugins`
```js
// store.js
export const key = Symbol()
```
```js
// app.spec.js
import { createStore } from 'vuex'
import { key } from './store'

const store = createStore({ /* ... */ })

const wrapper = mount(App, {
  global: {
    // to pass options to plugins, use the array syntax.
    plugins: [[store, key]]
  },
})
```
## Conclusión

- Use `global.plugins` para instalar Vuex como un complemento
- Use `global.mocks` para simular un objeto global, como Vuex, para casos de uso avanzado
- Considere probar mutaciones y acciones complejas de Vuex de forma aislada
- Envuelva `createStore` con una función que toma un argumento para configurar escenarios de prueba específicos
