# Encontrando elementos y componentes

## Encontrando elementos

`vue-test-utils` proporciona varias formas de encontrar y afirmar la presencia de elementos html u otros componentes de Vue mediante los métodos `find` y `findComponent`. El uso principal de `find` es afirmar que un componente renderiza correctamente un elemento o un componente secundario.

>Nota: si usó Vue Test Utils antes de la versión 1, es posible que recuerde `find` trabajando con componentes así como elementos DOM. Ahora usa `find` y `findAll` para elementos DOM, y `findComponent` y `findAllComponents` para componentes Vue. También hay un par `get` y `getComponent`, que son exactamente iguales que `find` y `findComponent`, pero generarán un error si no encuentran nada. Esta guía elige usar `find` y `findComponent`.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/Parent.spec.js).

## Creando los componentes

Para este ejemplo, crearemos un componente `<Child>` y `<Parent>`.

Child:

```vue
<template>
  <div>Child</div>
</template>

<script>
export default {
  name: "Child"
}
</script>
```

Parent:

```vue
<template>
  <div>
    <span v-show="showSpan">
      Parent Component
    </span>
    <Child v-if="showChild" />
  </div>
</template>

<script>
import Child from "./Child.vue"

export default {
  name: "Parent",

  components: { Child },

  data() {
    return {
      showSpan: false,
      showChild: false
    }
  }
}
</script>
```

## `find` con la sintaxis de `querySelector`

Los elementos regulares se pueden seleccionar fácilmente utilizando la sintaxis utilizada con `document.querySelector`. `vue-test-utils` también proporciona un método `isVisible` para verificar si los elementos renderizados condicionalmente con `v-show` son visibles. Cree un `Parent.spec.js` y dentro agregue la siguiente prueba:

```js
import { mount } from "@vue/test-utils"
import Parent from "@/components/Parent.vue"

describe("Parent", () => {
  
  it("does not render a span", () => {
    const wrapper = mount(Parent)

    expect(wrapper.find("span").isVisible()).toBe(false)
  })
  
})
```

Como `v-show="showSpan"` por defecto es `false`, esperamos que los elementos `<span>` encontrados no sean visibles. Las pruebas pasan cuando se ejecutan. A continuación, una prueba en torno al caso cuando `showSpan` es `true`.


```js
  it("does render a span", () => {
    const wrapper = mount(Parent, {
      data() {
        return { showSpan: true }
      }
    })

    expect(wrapper.find("span").isVisible()).toBe(true)
  })
```

¡Pasó!

## Encontrando componentes con `name` y `Component`

Encontrar componentes secundarios es un poco diferente a encontrar elementos HTML regulares. Hay dos formas principales de afirmar la presencia de componentes secundarios de Vue:

1. `findComponent(Component)`
1. `findComponent({ name: "ComponentName" })`

Estos son un poco más fáciles de entender en el contexto de una prueba de ejemplo. Comencemos con la sintaxis de `findComponent(Component)`. Esto requiere `import` al componente y lo pasemos a la función `findComponent`.

```js
import Child from "@/components/Child.vue"

it("does not render a Child component", () => {
  const wrapper = mount(Parent)

  expect(wrapper.findComponent(Child).exists()).toBe(false)
})
```

La implementación de `find` y `findComponent` es bastante compleja, ya que funciona con `querySelector` para elementos DOM, así como con varias otras sintaxis para componentes de Vue. Puede ver la parte de la fuente que encuentra los componentes secundarios de Vue [aquí](https://github.com/vuejs/vue-test-utils/blob/dev/packages/test-utils/src/find.js). Básicamente, comprueba el nombre del componente con cada elemento secundario renderizado y, a continuación, comprueba el `constructor` y algunas otras propiedades.

Como se mencionó en el párrafo anterior, la propiedad `name` es una de las comprobaciones que realiza `find` cuando pasa un componente. En lugar de pasar el componente, simplemente puede pasar un objeto con la propiedad `name` correcta. Esto significa que no necesita `import` el componente. Probemos el caso en el que `<Child>` debe renderizarce:

```js
it("renders a Child component", () => {
  const wrapper = mount(Parent, {
    data() {
      return { showChild: true }
    }
  })

  expect(wrapper.findComponent({ name: "Child" }).exists()).toBe(true)
})
```

¡Pasó! El uso de la propiedad `name` puede ser poco intuitivo, por lo que importar el componente real es una alternativa. Otra opción es simplemente agregar una `class` o `id` y consultar usando la sintaxis de estilo `querySelector` presentada en los dos primeros ejemplos.

## `findAll` y `findAllComponents`

A menudo, hay casos en los que desea afirmar que se renderizan varios elementos. Un caso común es una lista de elementos renderizados con `v-for`. Aquí hay un `<ParentWithManyChildren>` que representa varios componentes `<Child>`.

```vue
<template>
  <div>
    <Child v-for="id in [1, 2 ,3]" :key="id" />
  </div>
</template>

<script>
import Child from "./Child.vue"

export default {
  name: "ParentWithManyChildren",

  components: { Child }
}
</script>
```

Podemos escribir una prueba usando `findAllComponents` para afirmar que tres componentes `<Child>` se renderizan así:

```js{3,42,43,44,45,46}
import { mount } from "@vue/test-utils"
import Parent from "@/components/Parent.vue"
import ParentWithManyChildren from "@/components/ParentWithManyChildren.vue"
import Child from "@/components/Child.vue"

describe("Parent", () => {
  
  it("does not render a span", () => {
    const wrapper = mount(Parent)

    expect(wrapper.find("span").isVisible()).toBe(false)
  })
  
  it("does render a span", () => {
    const wrapper = mount(Parent, {
      data() {
        return { showSpan: true }
      }
    })

    expect(wrapper.find("span").isVisible()).toBe(true)
  })
  
  it("does not render a Child component", () => {
    const wrapper = mount(Parent)

    expect(wrapper.findComponent(Child).exists()).toBe(false)
  })
  
  it("renders a Child component", () => {
    const wrapper = mount(Parent, {
      data() {
        return { showChild: true }
      }
    })

    expect(wrapper.findComponent({ name: "Child" }).exists()).toBe(true)
  })
  
  it("renders many children", () => {
    const wrapper = mount(ParentWithManyChildren)

    expect(wrapper.findAllComponents(Child).length).toBe(3)
  })
  
})
```

La ejecución de prueba muestra que la prueba pasa. También puede usar la sintaxis de `querySelector` con `findAll`.

## Conclusión

Esta página cubre:

- Usando `find` y `findAll` con la sintaxis de `querySelector` para elementos DOM
- Use `findComponent` y `findAllComponents` para los componentes de Vue
- Utilice `exists` para comprobar si hay algo presente. `isVisible()).toBe(false)` para ver si hay algo presente pero no visible

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/Parent.spec.js)

