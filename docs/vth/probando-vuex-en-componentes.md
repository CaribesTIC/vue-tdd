# Probando Vuex en componentes

## Estado y Captadores

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/ComponentWithVuex.spec.js).

## Usando `global.plugins` para probar `$store.state`

En una aplicación Vue normal, instalamos Vuex usando `app.use(store)`, que instala una tienda Vuex disponible globalmente en la aplicación. En una prueba unitaria, podemos hacer exactamente lo mismo. A diferencia de una aplicación Vue normal, no queremos compartir la misma tienda Vuex en cada prueba, queremos una nueva para cada prueba. Veamos cómo podemos hacer eso. Primero, un componente `<ComponentWithVuex>` simple que representa un nombre de usuario en el estado base de la tienda.

```vue
<template>
  <div>
    <div class="username">
      {{ username }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentWithVuex",

  data() {
    return {
      username: this.$store.state.username
    }
  }
}
</script>
```

Podemos usar `createStore` para crear una nueva tienda Vuex. Luego pasamos la nueva tienda en las opciones de montaje de `global.plugins` del componente. Una prueba completa se ve así:

```js
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import ComponentWithVuex from "@/components/ComponentWithVuex.vue"

const store = createStore({
  state() {
    return {
      username: "alice",
    }
  }
})

describe("ComponentWithVuex", () => {
  it("renders a username using a real Vuex store", () => {
    const wrapper = mount(ComponentWithVuex, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.find(".username").text()).toBe("alice")
  })
})
```

Las pruebas pasan. La creación de una nueva tienda Vuex en cada prueba introduce algunos estándares. El código total requerido es bastante largo. Si tiene muchos componentes que usan una tienda Vuex, una alternativa es usar la opción de montaje `global.mocks` y simplemente simular la tienda.

## Usando una tienda simulada

Usando las opciones de montaje `mocks`, puede simular el objeto global `$store`. Esto significa que no necesita para usar crear una nueva tienda Vuex. Usando esta técnica, la prueba anterior se puede reescribir así:

```js
import { mount } from "@vue/test-utils"
import ComponentWithVuex from "@/components/ComponentWithVuex.vue"

describe("ComponentWithVuex", () => {
  it("renders a username using a mock store", () => {
    const wrapper = mount(ComponentWithVuex, {
      global: {
        mocks: {
          $store: {
            state: { username: "alice" }
          }
        }
      }
    })

    expect(wrapper.find(".username").text()).toBe("alice")
  })
})
```

No recomiendo ni uno ni el otro. La primera prueba utiliza una tienda Vuex real, por lo que está más cerca de cómo funcionará su aplicación en producción. Dicho esto, es una introducción muy repetitiva y si tiene una tienda Vuex muy compleja, puede terminar con métodos de ayuda muy grandes para crear la tienda que hacen que sus pruebas sean difíciles de entender.

El segundo enfoque utiliza una tienda simulada. Una de las cosas buenas de esto es que todos los datos necesarios se declaran dentro de la prueba, lo que facilita su comprensión y es un poco más compacto. Sin embargo, es menos probable que detecte regresiones en su tienda Vuex. Podría eliminar toda su tienda Vuex y esta prueba aún pasaría - no es lo ideal.

Ambas técnicas son útiles, y ninguna es mejor o peor que la otra.

## Probando captadores

Usando las técnicas anteriores, los `getters` se prueban fácilmente. Primero, un componente `<ComponentWithGetters>` para probar:

```vue
<template>
  <div class="fullname">
    {{ fullname }}
  </div>
</template>

<script>
export default {
  name: "ComponentWithGetters",

  computed: {
    fullname() {
      return this.$store.getters.fullname
    }
  }
}
</script>
```

Queremos afirmar que el componente representa correctamente el `fullname` del usuario. Para esta prueba, no nos importa de dónde proviene el `fullname`, solo que el componente se represente correctamente.

Primero, usando una tienda Vuex real, la prueba se ve así:

```js
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import ComponentWithGetters from "@/components/ComponentWithGetters.vue"

const store = createStore({
  state: {
    firstName: "Alice",
    lastName: "Doe"
  },

  getters: {
    fullname: (state) => state.firstName + " " + state.lastName
  }
})

describe("ComponentWithGetters", () => {
  it("renders a username using a real Vuex getter", () => {
    const wrapper = mount(ComponentWithGetters, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.find(".fullname").text()).toBe("Alice Doe")
  })
})
```

La prueba es muy compacta: solo dos líneas de código. Sin embargo, hay mucha configuración involucrada: tenemos que usar una tienda Vuex. Tenga en cuenta que no estamos usando la tienda Vuex que usaría nuestra aplicación, creamos una mínima con los datos básicos necesarios para proporcionar el captador de `fullname` que esperaba el componente.

Una alternativa es importar la tienda Vuex real que está utilizando en su aplicación, que incluye los captadores reales. Sin embargo, esto introduce otra dependencia a la prueba, y al desarrollar un sistema grande, es posible que otro programador esté desarrollando la tienda Vuex y aún no se haya implementado, pero no hay razón para que esto no funcione.

Una alternativa sería escribir la prueba usando la opción de montaje `global.mocks`:

```js
import { mount } from "@vue/test-utils"
import ComponentWithGetters from "@/components/ComponentWithGetters.vue"

describe("ComponentWithGetters", () => {
  it("renders a username using computed mounting options", () => {
    const wrapper = mount(ComponentWithGetters, {
      global: {
        mocks: {
          $store: {
            getters: {
              fullname: "Alice Doe"
            }
          }
        }
      }
    })

    expect(wrapper.find(".fullname").text()).toBe("Alice Doe")
  })
})
```

Ahora todos los datos requeridos están contenidos en la prueba. ¡Estupendo! Me gusta esto. La prueba está totalmente contenida, y todo el conocimiento necesario para comprender lo que debe hacer el componente está contenido en la prueba.

## Los ayudantes `mapState` y `mapGetters`

Todas las técnicas anteriores funcionan en conjunto con los ayudantes `mapState` y `mapGetters` de Vuex. Podemos actualizar `ComponentWithGetters` a lo siguiente:

```js
import { mapGetters } from "vuex"

export default {
  name: "ComponentWithGetters",

  computed: {
    ...mapGetters([
      'fullname'
    ])
  }
}
```

Las pruebas aún pasan.

## Conclusión

Esta guía discutió:

- Usando `createStore` para crear una tienda Vuex real e instalarla con `global.plugins`
- Cómo probar `$store.state` y `getters`
- Usando la opción de montaje `global.mocks` para simular `$store.state` y `getters`

En [esta guía](../vth/vuex-captadores) se pueden encontrar técnicas para probar la implementación de captadores de Vuex de forma aislada.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/ComponentWithVuex.spec.js).
