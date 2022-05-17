# Probando Vuex en componentes 

## Mutaciones y Acciones

La guía anterior discutió la prueba de componentes que usan `$store.state` y `$store.getters`, que proporcionan el estado actual del componente. Cuando afirmar un componente correctamente comete una mutación o envía una acción, lo que realmente queremos hacer es afirmar `$store.commit` y `$store.dispatch` se llama con el controlador correcto (la mutación o acción a llamar) y la carga útil.

Hay dos maneras de hacer esto. Una es usar una tienda Vuex real con `createStore` y otra es usar una tienda simulada. Ambas técnicas se demuestran [aquí](/vth/probando-vuex-en-componentes). Veámoslos de nuevo, en el contexto de mutaciones y acciones.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/ComponentWithButtons.spec.js).

## Crear el componente

Para estos ejemplos, probaremos un componente `<ComponentWithButtons>`:

```vue
<template>
  <div>
    <button 
      class="commit" 
      @click="handleCommit">
      Commit
    </button>

    <button 
      class="dispatch" 
      @click="handleDispatch">
      Dispatch
    </button>

    <button 
      class="namespaced-dispatch" 
      @click="handleNamespacedDispatch">
      Namespaced Dispatch
    </button>
  </div>
</template>

<script>
export default {
  name: "ComponentWithButtons",

  methods: {
    handleCommit() {
      this.$store.commit("testMutation", { msg: "Test Commit" })
    },

    handleDispatch() {
      this.$store.dispatch("testAction", { msg: "Test Dispatch" })
    },

    handleNamespacedDispatch() {
      this.$store.dispatch("namespaced/very/deeply/testAction", { msg: "Test Namespaced Dispatch" })
    }
  }
}
</script>
```

## Probando con una tienda Vuex real

Primero escribamos un `ComponentWithButtons.spec.js` con una prueba para la mutación. Recuerda, queremos verificar dos cosas:

1. ¿Se cometió la mutación correcta?
1. ¿La carga útil era correcta?

Veamos la prueba.

```js
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import ComponentWithButtons from "@/components/ComponentWithButtons.vue"

const mutations = {
  testMutation: vi.fn()
}

const store = createStore({
  mutations
})

describe("ComponentWithButtons", () => {

  it("commits a mutation when a button is clicked", async () => {
    const wrapper = mount(ComponentWithButtons, {
      global: {
        plugins: [store]
      }
    })

    wrapper.find(".commit").trigger("click")
    await wrapper.vm.$nextTick()    

    expect(mutations.testMutation).toHaveBeenCalledWith(
      {},
      { msg: "Test Commit" }
    )
  })
})
```

Observe que las pruebas están marcadas como `await` y llame a `nextTick`. Vea [aquí](../vth/simulando-la-entrada-del-usuario.html#escribiendo-la-prueba) para más detalles sobre por qué.

Hay mucho código en la prueba anterior; sin embargo, no está sucediendo nada demasiado emocionante. Creamos una nueva tienda con `createStore`, pasando una función simulada de Vitest (vi.fn()) en lugar de `testMutation`. Las mutaciones de Vuex siempre se llaman con dos argumentos: el primero es el estado actual y el segundo es la carga útil. Dado que no declaramos ningún estado para la tienda, esperamos que se llame con un objeto vacío. Se espera que el segundo argumento sea `{ msg: "Test Commit" }`, que está codificado en el componente.

Esto es mucho código repetitivo para escribir, pero es una forma correcta y válida de verificar que los componentes se comporten correctamente. Otra alternativa que requiere menos código es usar una tienda simulada. Veamos cómo hacerlo mientras se escribe una prueba para afirmar que se envía `testAction`.

## Probando usando una tienda simulada

Veamos el código, luego comparemos y contrastemos con la prueba anterior. Recuerda, queremos verificar:

1. Se envía la acción correcta
1. La carga útil es correcta

```js
import { mount } from "@vue/test-utils"
import ComponentWithButtons from "@/components/ComponentWithButtons.vue"

describe("ComponentWithButtons", () => {
  it("dispatches an action when a button is clicked", async () => {
    const mockStore = { dispatch: vi.fn() }
    const wrapper = mount(ComponentWithButtons, {
      global: {
        mocks: {
          $store: mockStore 
        }
      }
    })

    wrapper.find(".dispatch").trigger("click")
    await wrapper.vm.$nextTick()
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "testAction" , { msg: "Test Dispatch" })
  })
})
```

Esto es mucho más compacto que el ejemplo anterior. Sin crear tienda. En lugar de burlarnos de la función, en el caso anterior donde hicimos `testMutation = vi.fn()`, en realidad nos burlamos de la función `dispatch` en sí. Dado que `$store.dispatch` es solo una función normal de JavaScript, podemos hacer esto. Luego afirmamos que el controlador de acción correcto, `testAction`, es el primer argumento, y el segundo argumento, la carga útil, es correcto. No nos importa lo que realmente hace la acción - eso se puede probar de forma aislada. El objetivo de esta prueba es simplemente verificar que hacer click en un botón envía la acción correcta con la carga útil.

Ya sea que use una tienda real o una tienda simulada, sus pruebas se reducen a sus preferencias personales. Ambos son correctos. Lo importante es que estás probando tus componentes.

## Probando una Acción (o Mutación) con Espacio de Nombre

El tercer y último ejemplo muestra otra forma de probar que se envió una acción (o se cometió una mutación) con los argumentos correctos. Esto combinó las dos técnicas discutidas anteriormente: una tienda `Vuex` real y un método `dispatch` simulado.

```js
it("dispatch a namespaced action when button is clicked", async () => {
  const store = createStore()
  store.dispatch = vi.fn()

  const wrapper = mount(ComponentWithButtons, {
    global: {
      plugins: [store]
    }
  })

  wrapper.find(".namespaced-dispatch").trigger("click")
  await wrapper.vm.$nextTick()

  expect(store.dispatch).toHaveBeenCalledWith(
    'namespaced/very/deeply/testAction',
    { msg: "Test Namespaced Dispatch" }
  )
})
```

Comenzamos creando una tienda Vuex, con los módulos que nos interesan. Declaro el módulo `namespacedModule` dentro de la prueba, pero en una aplicación del mundo real, solo importaría los módulos de los que depende su componente. Luego reemplazamos el método `dispatch` con un simulacro de `vi.fn` y hacemos afirmaciones en contra de eso.

## Conclusión

En esta sección cubrimos:

- Usando Vuex con `createStore` y burlándose de una mutación
- Burlándose de la API de Vuex (`dispatch` y `commit`)
- Usar una tienda Vuex real con una función de `dispatch` simulada

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/ComponentWithButtons.spec.js).


