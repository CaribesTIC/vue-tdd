# La API de Composición

Vue 3 introdujo una nueva API para crear componentes: la [API de Composición](https://vuejs.org/guide/extras/composition-api-faq.html).

Probar la compilación de un componente con la API de composición no debería ser diferente a probar un componente estándar, ya que no estamos probando la implementación, sino el resultado (_qué_ hace el componente, no _cómo_ lo hace). Este artículo mostrará un ejemplo simple de un componente que usa la API de Composición en Vue 2 y cómo las estrategias de prueba son las mismas que cualquier otro componente.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/CompositionApi.spec.js).

## El Componente

Debajo del "Hello, World" de la API de Composición, más o menos. Si no entiende algo, [lea el RFC](https://vuejs.org/guide/extras/composition-api-faq.html) o tenga un Google; hay muchos recursos sobre la API de Composición.

```vue
<template>
  <div>
    <div class="message">{{ uppercasedMessage }}</div>
    <div class="count">
      Count: {{ state.count }}
    </div>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'

export default {
  name: 'CompositionApi',

  props: {
    message: {
      type: String
    }
  },

  setup(props) {
    const state = reactive({
      count: 0
    })

    const increment = () => {
      state.count += 1
    }

    return {
      state,
      increment,
      uppercasedMessage: computed(() => props.message.toUpperCase())
    }
  }
}
</script>
```

Las dos cosas que tendremos que probar aquí son:

1. ¿Hacer click en el botón de incremento aumenta `state.count` en 1?
1. ¿El mensaje recibido en las propiedades se representa correctamente (transformado a mayúsculas)?

## Probando el Mensaje de Propiedades

Probar que el mensaje se represente correctamente es trivial. Solo usamos `props` para establecer el valor de la propiedad, como se describe aquí.

```js
import { mount } from "@vue/test-utils"
import CompositionApi from "@/components/CompositionApi.vue"

describe("CompositionApi", () => {
  it("renders a message", () => {
    const wrapper = mount(CompositionApi, {
      props: {
        message: "Testing the composition API"
      }
    })

    expect(wrapper.find(".message").text()).toBe("TESTING THE COMPOSITION API")
  })
})
```

Como era de esperar, esto es muy simple - independientemente de la forma en que compongamos los componentes, usamos la misma API y las mismas estrategias para probar. Debería poder cambiar la implementación por completo y no necesitar tocar las pruebas. Recuerde probar las salidas (el HTML renderizado, usualmente) en función de las entradas dadas (`props`, `triggered`, `events`), no la implementación.

## Pruobando el Click del Botón

Escribir una prueba para garantizar que al hacer click en el botón se incremente el `state.count` es igualmente simple. Observe que la prueba está marcada como `async`; lea más sobre por qué esto es necesario en [Simulando la Entrada del Usuario](../vth/simulando-la-entrada-del-usuario.html#escribiendo-la-prueba).

```js{18,19,20,21,22,23,24}
import { mount } from "@vue/test-utils"
import CompositionApi from "@/components/CompositionApi.vue"

const factory = (props) => {
  return mount(CompositionApi, {
    props: { ...props }
  })
}

describe("CompositionApi", () => {
  it("renders a message", () => {
    const wrapper = factory({ message: "Testing the composition API"})

    expect(wrapper.find(".message").text()).toBe("TESTING THE COMPOSITION API")
  })
  
  it("increments a count when button is clicked", async () => {
    const wrapper = factory({ message: ""})

    await wrapper.find('button').trigger('click')

    expect(wrapper.find(".count").text()).toBe("Count: 1")
  })
})
```

Una vez más, nada interesante - con `trigger` activamos el evento click y afirmamos que el renderizado de `count` aumentó. También observará que en cada prueba a este componente es necesario mandar la propiedad `message`, de lo contrario arrojará el siguiente error:

```
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```
Por lo tanto [refactorizamos](../vth/probando-propiedades.html#refactorizando-las-pruebas) siguiendo el principio _"Don't Repeat Yourself"_ (DRY).

## Conclusión

El artículo demuestra cómo probar un componente con la API de Composición es idéntico a probar uno con la API de Opciones tradicional. Las ideas y los conceptos son los mismos. El punto principal que se debe aprender es al escribir pruebas, hacer afirmaciones basadas en entradas y salidas.

Debería ser posible refactorizar cualquier componente tradicional de Vue para usar la API de Composición sin necesidad de cambiar las pruebas unitarias. Si necesita cambiar sus pruebas al refactorizar, es probable que esté probando la _implementación_, no la salida.

Si bien es una característica nueva y emocionante, la API de Composición es completamente aditiva, por lo que no hay una necesidad inmediata de usarla; sin embargo, independientemente de su elección, recuerde que una buena prueba unitaria afirma el estado final del componente, sin considerar los detalles de implementación.

