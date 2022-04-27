# Un poco más sobre Vuex

Las partes principales que queremos probar unitariamente en Vuex son mutaciones y acciones.

## Prueba de Mutaciones

Las mutaciones son muy sencillas de probar, porque son solo funciones que dependen completamente de sus argumentos. Un truco es que si está utilizando módulos ES2015 y coloca sus mutaciones dentro de su archivo `store.js`, además de la exportación predeterminada, también debe exportar las mutaciones como una exportación con nombre:

```js
const state = { ... }

// export `mutations` as a named export
export const mutations = { ... }

export default createStore({
  state,
  mutations
})
```
Ejemplo probando una mutación usando Vitest (puede usar cualquier biblioteca de framework/assertion que desee):
```js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```
```js
// mutations.spec.js
import { mutations } from '@/store/mutations'

// destructure assign `mutations`
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock state
    const state = { count: 0 }
    // apply mutation
    increment(state)
    // assert result
    expect(state.count).toEqual(1)
  })
})
```
## Prueba de Acciones

Las acciones pueden ser un poco más complicadas porque pueden llamar a API externas. Cuando probamos acciones, generalmente necesitamos hacer algún nivel de simulación; por ejemplo, podemos abstraer las llamadas a la API en un servicio y simular ese servicio dentro de nuestras pruebas. Para simular fácilmente las dependencias, podemos usar algún módulo _mock_ para agrupar nuestros archivos de prueba.

Ejemplo probando una acción asíncrona:
```js
export const actions = {    
  incrementAsync({ commit, state }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('increment', state)
        resolve()
      }, 1000)
    })
  }
}
```
```js
// actions.spec.js
import { actions } from "@/store/actions"

const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(type).toEqual(mutation.type)      
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).toEqual(0)
    done()
  }
}

describe('actions', () => {
  it('incrementAsync', done => {
    testAction(actions.incrementAsync, null, {}, [{type: 'increment'}], done)
  })
})
```
Con los espías disponibles en su entorno de prueba, puede usarlos en lugar del ayudante `testAction`:
```js
// actions.spec.js
import { actions } from "@/store/actions"

describe('actions', () => {
  it('incrementAsync', () => {  
    const commit = vi.spyOn(actions, 'incrementAsync')    
    const state = {}

    actions.incrementAsync({ commit, state})

    expect(commit).toHaveBeenCalledTimes(1)
  })
})
```
## Pruebas de Captadores

Si sus _getters_ tienen cálculos complicados, vale la pena probarlos. Los _getters_ también son muy sencillos de probar por la misma razón que los _mutations_.

Ejemplo probando un _getters_:

```js
// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```
```js
// getters.spec.js
import { getters } from '@/store/getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // mock state
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // mock getter
    const filterCategory = 'fruit'

    // get the result from the getter
    const result = getters.filteredProducts(state, { filterCategory })

    // assert the result
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```
## Ejecución de Pruebas

Si sus mutaciones y acciones están escritas correctamente, las pruebas no deberían depender directamente de las API del navegador después de una simulación adecuada.
