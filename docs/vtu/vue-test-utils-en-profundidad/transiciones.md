# Transiciones

En general, es posible que desee probar el DOM resultante después de una transición, y es por eso que Vue Test Utils se burla de `<transition>` y `<transition-group>` de forma predeterminada.

El siguiente es un componente simple que alterna un contenido envuelto en una transición de desvanecimiento:

```vue
<template>
  <button @click="show = !show">Toggle</button>

  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const show = ref(false)

    return {
      show
    }
  }
}
</script>

<style lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```
Dado que Vue Test Utils incluye transiciones integradas, puede probar el componente anterior como probaría cualquier otro componente:
```js
import { mount } from '@vue/test-utils'
import Component from '@/Component.vue'

test('works with transitions', async () => {
  const wrapper = mount(Component)

  expect(wrapper.find('hello').exists()).toBe(false)

  await wrapper.find('button').trigger('click')

  // After clicking the button, the <p> element exists and is visible
  expect(wrapper.get('p').text()).toEqual('hello')
})
```
