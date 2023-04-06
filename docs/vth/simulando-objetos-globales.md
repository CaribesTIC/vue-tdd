# Simulando Objetos Globales

`vue-test-utils` proporciona una forma sencilla de simular objetos globales adjuntos a `Vue.prototype`, tanto en base a prueba por prueba como para establecer una simulación predeterminada para todas las pruebas.

La prueba utilizada en el siguiente ejemplo se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/Bilingual.spec.js)

## La opción de montaje simulado

La [opción de montaje simulado](https://vue-test-utils.vuejs.org/api/options.html#mocks) es una forma de establecer el valor de cualquier propiedad adjunta a `Vue.prototype`. Esto comúnmente incluye:

- `$store`, para Vuex
- `$router`, para Vue Router
- `$t`, para vue-i18n

y muchos otros.

## Ejemplo con vue-i18n

El uso con Vuex y Vue Router se analiza en las secciones respectivas, [aquí](../vth/probando-vuex-en-componentes) y [aquí](../vth/vue-router). Veamos un ejemplo con [vue-i18n](https://github.com/kazupon/vue-i18n). Si bien sería posible usar `createLocalVue` e instalar `vue-i18n` para cada prueba, eso rápidamente se volvería engorroso e introduciría una gran cantidad de repeticiones. Primero, un componente `<Bilingual>` que usa `vue-i18n`:

```vue
<template>
  <div class="hello">
    {{ $t("helloWorld") }}
  </div>
</template>

<script>
  export default {
    name: "Bilingual"
  }
</script>
```

La forma en que funciona `vue-i18n` es declarar su traducción en otro archivo, luego hacer referencia a ellos con `$t`. A los efectos de esta prueba, en realidad no importa cómo se vea el archivo de traducción, pero para este componente podría verse así:

```js
export default {
  "en": {
    helloWorld: "Hello world!"
  },
  "ja": {
    helloWorld: "こんにちは、世界！"
  }
}
```
Según el entorno local, se representa la traducción correcta. Intentemos renderizar el componente en una prueba, sin ninguna burla.

Ejecutar esta prueba arroja un enorme rastro de pila. Si observa cuidadosamente la salida, puede ver:

```sh
"TypeError: _ctx.$t is not a function"
```

Esto se debe a que no instalamos `vue-i18n`, por lo que el método global `$t` no existe. Vamos a simularlo usando la opción de montaje `mocks`:

```js
import { mount } from "@vue/test-utils"
import Bilingual from "@/components/Bilingual.vue"

describe("Bilingual", () => {
  it("renders successfully", () => {
    const wrapper = mount(Bilingual, {
      global: {
        mocks: {
          $t: (msg) => msg
        }
      }
    })
  })
})
```

¡Ahora pasa la prueba! Hay muchos usos para la opción `mocks`. La mayoría de las veces me encuentro simulando los objetos globales proporcionados por los tres paquetes mencionados anteriormente.

## Estableciendo simulacros predeterminados usando config

A veces, desea tener un valor predeterminado para el simulacro, por lo que no lo crea prueba por prueba. Puede hacerlo utilizando la API de [config](https://v1.test-utils.vuejs.org/api/#config) proporcionada por `vue-test-utils`. Expandamos el ejemplo de `vue-i18n`. Puede configurar simulacros predeterminados en cualquier lugar haciendo lo siguiente:

```js
import { config } from "@vue/test-utils"

config.global.mocks = {
  mock: "Default Mock Value"
}
```

Declararé el simulacro predeterminado que se carga antes de que las pruebas se ejecuten automáticamente. También importaré el objeto de traducción de ejemplo anterior y lo usaré en la implementación simulada.

```js
import { mount, config } from "@vue/test-utils"
import Bilingual from "@/components/Bilingual.vue"
import translations from "@/translations.js"

const locale = "en"

config.global.mocks = {
  $t: (msg) => translations[locale][msg]
}
```

Ahora se generará una traducción real, a pesar de usar una función `$t` simulada. Vuelva a ejecutar la prueba, esta vez usando `console.log` en `wrapper.html()` y eliminando la opción de montaje `mocks`:


```js
describe("Bilingual", () => {

  it("renders successfully", () => {
    const wrapper = mount(Bilingual)

    console.log(wrapper.html())
  })
})
```

La prueba pasa y se renderiza el siguiente marcado:

```html
<div class="hello">
  Hello world!
</div>
```

Puede leer sobre el uso de simulacros para probar Vuex [aquí](../vth/probando-vuex-en-componentes). La técnica es la misma.

## Conclusión

Esta guía discutió:

- Usar `global.mocks` para simular un objeto global en una base de prueba por prueba
- Usar `config.global.mocks` para establecer un simulacro predeterminado
