# Probando Pinia

## Pruebas de Tiendas

Las tiendas, por diseño, se utilizarán en muchos lugares y pueden hacer que las pruebas sean mucho más difíciles de lo que deberían ser. Afortunadamente, esto no tiene por qué ser así. Debemos tener en cuenta tres cosas al probar las tiendas:

- La instancia `pinia`: las tiendas no pueden funcionar sin ella
- `actions`: la mayoría de las veces contienen la lógica más compleja de nuestras tiendas. ¿No sería bueno si ellas fueran simuladas por defecto?
- Complementos: si confía en los complementos, también deberá instalarlos para las pruebas

Dependiendo de qué o cómo esté probando, debemos ocuparnos de estos tres de manera diferente:

- [Tiendas de prueba](../../vue-tdd/pinia/probando-pinia.html#pruebas-de-tiendas)
    - [Unidad de prueba de una tienda](../../vue-tdd/pinia/probando-pinia.html#unidad-de-prueba-de-una-tienda)
    - [Componentes de pruebas unitarias](../../vue-tdd/pinia/probando-pinia.html#componentes-de-pruebas-unitarias)
        - [Estado inicial](../../vue-tdd/pinia/probando-pinia.html#estado-inicial)
        - [Personalización del comportamiento de las acciones](../../vue-tdd/pinia/probando-pinia.html#personalizacion-del-comportamiento-de-las-acciones).
        - [Especificación de la función createSpy](../../vue-tdd/pinia/probando-pinia.html#especificacion-de-la-funcion-createspy)
        - [Simulando captadores](../../vue-tdd/pinia/probando-pinia.html#simulando-captadores)
        - [Complementos de Pinia](../../vue-tdd/pinia/probando-pinia.html#complementos-de-pinia)
    - [Pruebas E2E](../../vue-tdd/pinia/probando-pinia.html#pruebas-e2e)
    - [Componentes de prueba unitaria (Vue 2)](../../vue-tdd/pinia/probando-pinia.html#componentes-de-prueba-unitaria-vue-2)

## Unidad de prueba de una tienda

Para realizar una prueba unitaria de una tienda, la parte más importante es crear una instancia de `pinia`:

```js
// counterStore.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '@/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounter()
    expect(counter.n).toBe(0)
    counter.increment()
    expect(counter.n).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCounter()
    counter.increment(10)
    expect(counter.n).toBe(10)
  })
})
```
Si tiene complementos de la tienda, hay una cosa importante que debe saber: los complementos no se utilizarán hasta que `pinia` esté instalado en una aplicación. Esto se puede solucionar creando una aplicación vacía o una falsa:

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '@/stores/plugin'

// same code as above...

// you don't need to create one app per test
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## Componentes de pruebas unitarias

Esto se puede lograr con `createTestingPinia()`, que devuelve una instancia de `pinia` diseñada para ayudar a los componentes de pruebas unitarias.

Comience instalando `@pinia/testing`:

```
npm i -D @pinia/testing
```

Y asegúrese de crear una pruea de `pinia` en sus pruebas al montar un componente:

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // uses the testing pinia!

// state can be directly manipulated
store.name = 'my new name'
// can also be done through patch
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// actions are stubbed by default, meaning they don't execute their code by default.
// See below to customize this behavior.
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

Tenga en cuenta que si está utilizando Vue 2, `@vue/test-utils` requiere una [configuración ligeramente diferente](../../vue-tdd/pinia/probando-pinia.html#componentes-de-prueba-unitaria-vue-2).

## Estado inicial

Puede establecer el estado inicial de todas sus tiendas al crear un pinia de prueba pasando un objeto `initialState`. Este objeto será utilizado por el `pinia` de prueba para parchear (`patch`) las tiendas cuando se creen. Digamos que desea inicializar el estado de esta tienda:

```js
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  // ...
})
```

Dado que la tienda se llama _"counter"_, debe agregar un objeto coincidente a `initialState`:

```js
// somewhere in your test
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          counter: { n: 20 }, // start the counter at 20 instead of 0
        },
      }),
    ],
  },
})

const store = useSomeStore() // uses the testing pinia!
store.n // 20
```

## Personalización del comportamiento de las acciones

`createTestingPinia` excluye todas las acciones de la tienda a menos que se indique lo contrario. Esto le permite probar sus componentes y tiendas por separado.

Si desea revertir este comportamiento y normalmente ejecutar sus acciones durante las pruebas, especifique `stubActions: false` cuando llame a `createTestingPinia`:

```js
const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia({ stubActions: false })],
  },
})

const store = useSomeStore()

// Now this call WILL execute the implementation defined by the store
store.someAction()

// ...but it's still wrapped with a spy, so you can inspect calls
expect(store.someAction).toHaveBeenCalledTimes(1)
```

## Especificación de la función createSpy

Al usar Jest o Vitest con `globals: true`, `createTestingPinia` automáticamente agrega acciones utilizando la función de espionaje basada en el marco de prueba existente (`jest.fn` o `vitest.fn`). Si está utilizando un marco diferente, deberá proporcionar una opción [createSpy](https://pinia.vuejs.org/api/interfaces/pinia_testing.TestingOptions.html#createspy):

```js
import sinon from 'sinon'

createTestingPinia({
  createSpy: sinon.spy, // use sinon's spy to wrap actions
})
```

Puede encontrar más ejemplos en [las pruebas del paquete de pruebas](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts).


## Simulando captadores

De forma predeterminada, cualquier _getter_ se calculará como un uso normal, pero puede forzar manualmente un valor configurando el _getter_ en lo que desee:

```ts
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

const useCounter = defineStore('counter', {
  state: () => ({ n: 1 }),
  getters: {
    double: (state) => state.n * 2,
  },
})

const pinia = createTestingPinia()
const counter = useCounter(pinia)

counter.double = 3 // 🪄 getters are writable only in tests

// set to undefined to reset the default behavior
// @ts-expect-error: usually it's a number
counter.double = undefined
counter.double // 2 (=1 x 2)
```

## Complementos de Pinia

Si tiene complementos `pinia`, asegúrese de pasarlos cuando llame a `createTestingPinia()` para que se apliquen correctamente. No los agregue con `testingPinia.use(MyPlugin)` como lo haría con un `pinia` normal:

```js
import { createTestingPinia } from '@pinia/testing'
import { somePlugin } from '@/stores/plugin'

// inside some test
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        stubActions: false,
        plugins: [somePlugin],
      }),
    ],
  },
})
```

## Pruebas E2E

Cuando se trata de `pinia`, no necesita cambiar nada para las pruebas e2e, ¡ese es el objetivo de las pruebas e2e! Tal vez podría probar las solicitudes HTTP, pero eso está más allá del alcance de esta guía 😄.

## Componentes de prueba unitaria (Vue 2)

Cuando utilice [Vue Test Utils 1](https://v1.test-utils.vuejs.org/), instale Pinia en un `localVue`:

```js
import { PiniaVuePlugin } from 'pinia'
import { createLocalVue, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const localVue = createLocalVue()
localVue.use(PiniaVuePlugin)

const wrapper = mount(Counter, {
  localVue,
  pinia: createTestingPinia(),
})

const store = useSomeStore() // uses the testing pinia!
```
