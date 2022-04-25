# Reusabilidad & Composición

Mayoritariamente:
- `global.mixins`.
- `global.directives`.

## Probando componibles

Cuando se trabaja con la API de composición y se crean componibles, a menudo desea probar solo los componibles. Comencemos con un ejemplo simple:

```js
import { ref } from "vue"

export function useCounter() {
  const counter = ref(0)

  function increase() {
    counter.value += 1
  }

  return { counter, increase }
}
```
En este caso, en realidad no necesita `@vue/test-utils`. Aquí está la prueba correspondiente:

```js
import { useCounter } from "@/Composable"

test('increase counter on call', () => {
  const { counter, increase } = useCounter()

  expect(counter.value).toBe(0)

  increase()

  expect(counter.value).toBe(1)
})
```
Para componibles más complejos, que usan ganchos de ciclo de vida como `onMounted` o manejo de `provide`/`inject`, puede crear un componente auxiliar de prueba simple. El siguiente componible obtiene los datos del usuario dentro del gancho `onMounted`.
```js
import { ref, onMounted } from "vue"
import axios from "axios"

export function useUser(userId) {
  const user = ref()
  
  function fetchUser(id) {
    axios.get(`users/${id}`)
      .then(response => (user.value = response.data))
  }

  onMounted(() => fetchUser(userId))

  return { user }
}
```
Para probar este componible, puede crear un `TestComponent` simple dentro de las pruebas. `TestComponent` debe usar el componible exactamente de la misma manera en que lo usarían los componentes reales.
```js
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from "vue"
import { useUser } from "@/Composable"
import axios from "axios"

// Mock API request
axios.get = vi.fn().mockResolvedValue({ data: { id: 1, name: 'User' } });

test('fetch user on mount', async () => {
  const TestComponent = defineComponent({
    template: '<div v-if="user">{{user.name}}</div>',
    props: {
      // Define props, to test the composable with different input arguments
      userId: {
        type: Number,
        required: true
      }
    },
    setup (props) {
      return {
        // Call the composable and expose all return values into our
        // component instance so we can access them with wrapper.vm
        ...useUser(props.userId)
      }
    }
  })

  const wrapper = mount(TestComponent, {
    props: {
      userId: 1
    }
  })

  expect(wrapper.vm.user).toBeUndefined()

  await flushPromises()

  expect(wrapper.vm.user).toEqual({ id: 1, name: 'User' })
})
```
## Proveer / Inyectar

Vue ofrece una forma de pasar accesorios a todos los componentes secundarios con `provide` e `inject`. La mejor manera de probar este comportamiento es probar todo el árbol (padre + hijos). Pero a veces esto no es posible porque el árbol es demasiado complejo o solo desea probar un solo componible.

## Probando `provide`

Supongamos que desea probar el siguiente componente:

```vue
<script setup>
import { provide } from "vue"
  
provide('my-key', 'some-data')
</script>

<template>
  <div>
    <slot />
  </div>
</template>
```
En este caso, puede representar un componente secundario real y probar el uso correcto de `provide` o puede crear un componente auxiliar de prueba simple y pasarlo a la ranura predeterminada.

```js
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject } from "vue"
import ParentComponent from "@/ParentComponent.vue"

test('provides correct data', () => {
  const TestComponent = defineComponent({
    template: '<span id="provide-test">{{value}}</span>',
    setup () {
      const value = inject('my-key')
      return { value }
    }
  })

  const wrapper = mount(ParentComponent, {
    slots: {
      default: () => h(TestComponent)
    }
  })

  expect(wrapper.find('#provide-test').text()).toBe('some-data')
})
```
Si su componente no contiene una ranura, puede usar un `stub` y reemplazar un componente secundario con su ayudante de prueba:
```vue
<script setup>
import { provide } from "vue"
import SomeChild from '@/SomeChild.vue'
  
provide('my-key', 'some-data')
</script>

<template>
  <div>
    <SomeChild />
  </div>
</template>
```
Y la prueba:
```js
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject } from "vue"
import ParentComponent from "@/ParentComponent.vue"

test('provides correct data', () => {
  const TestComponent = defineComponent({
    template: '<span id="provide-test">{{value}}</span>',
    setup () {
      const value = inject('my-key')
      return { value }
    }
  })

  const wrapper = mount(ParentComponent, {
    global: {
      stubs: {
        SomeChild: TestComponent
      }
    }
  })

  expect(wrapper.find('#provide-test').text()).toBe('some-data')
})
```
## Probando `inject`

Cuando su Componente usa `inject` y necesita pasar datos con `provide`, entonces puede usar la opción `global.provide`.
```vue
<script setup>
import { inject } from "vue"

const value = inject('my-key')
</script>

<template>
  <div>
    {{ value }}
  </div>
</template>
```
La prueba unitaria podría verse simplemente como:
```js
import { mount } from '@vue/test-utils'
import MyComponent from "@/MyComponent.vue"

test('renders correct data', async () => {
  const wrapper = mount(MyComponent, {
    global: {
      provide: {
        'my-key': 'some-data'
      }
    }
  })
  
  expect(wrapper.text()).toBe('some-data')
})
```
## Conclusión

- Probar componibles simples sin un componente y `@vue/test-utils`
- Crear un componente de ayuda de prueba para probar componibles más complejos
- Crear un componente auxiliar de prueba para probar su componente proporcionando los datos correctos con `provide`
- Use `global.provide` para pasar datos a su componente que usa `inject`
