# Ranuras

Vue Test Utils proporciona algunas características útiles para probar componentes usando `slots`.

## Un Ejemplo Sencillo

Es posible que tenga un componente genérico `<layout>` que use una ranura predeterminada para representar algún contenido. Por ejemplo:

```js
const Layout = {
  template: `
    <div>
      <h1>Welcome!</h1>
      <main>
        <slot />
      </main>
      <footer>
        Thanks for visiting.
      </footer>
    </div>
  `
}
```
Es posible que desee escribir una prueba para asegurarse de que se represente el contenido de ranura predeterminado. VTU proporciona la opción de montaje de `slots` para este propósito:
```js
import { mount } from '@vue/test-utils'

test('layout default slot', () => {
  const wrapper = mount(Layout, {
    slots: {
      default: 'Main Content'
    }
  })

  expect(wrapper.html()).toContain('Main Content')
})
```
¡Pasó! En este ejemplo, estamos pasando algún contenido de texto a la ranura predeterminada. Si desea ser aún más específico y verificar que el contenido de la ranura predeterminada se muestra dentro de `<main>`, puede cambiar la afirmación:
```js
import { mount } from '@vue/test-utils'

test('layout default slot', () => {
  const wrapper = mount(Layout, {
    slots: {
      default: 'Main Content'
    }
  })

  expect(wrapper.find('main').text()).toContain('Main Content')
})
```
## Ranuras nombradas

Puede tener un componente `<layout>` más complejo con algunas ranuras con nombre. Por ejemplo:
```js
const Layout = {
  template: `
    <div>
      <header>
        <slot name="header" />
      </header>

      <main>
        <slot name="main" />
      </main>
      <footer>
        <slot name="footer" />
      </footer>
    </div>
  `
}
```

VTU también es compatible con esto. Puedes escribir una prueba de la siguiente manera. Tenga en cuenta que en este ejemplo estamos pasando HTML en lugar de contenido de texto a las ranuras.
```js
import { mount } from '@vue/test-utils'

test('layout full page layout', () => {
  const wrapper = mount(Layout, {
    slots: {
      header: '<div>Header</div>',
      main: '<div>Main Content</div>',
      footer: '<div>Footer</div>'
    }
  })

  expect(wrapper.html()).toContain('<div>Header</div>')
  expect(wrapper.html()).toContain('<div>Main Content</div>')
  expect(wrapper.html()).toContain('<div>Footer</div>')
})
```
## Múltiples ranuras

También puede pasar un arreglo de ranuras, observe este ejemplo:
```js
import { mount } from '@vue/test-utils'

const Layout = {
  template: `
    <div>
      <h1>Welcome!</h1>
      <main>
        <slot />
      </main>
      <footer>
        Thanks for visiting.
      </footer>
    </div>
  `
}

test('layout full page layout', () => {
  const wrapper = mount(Layout, {
    slots: {
      default: [
        '<div id="one">One</div>',
        '<div id="two">Two</div>'
      ]
    }
  })

  expect(wrapper.find('#one').exists()).toBe(true)
  expect(wrapper.find('#two').exists()).toBe(true)
})
```

## Uso avanzado

También puede pasar una función de renderizado, un objeto con plantilla o incluso un SFC importado desde un archivo `vue` a una opción de montaje de ranura:
```vue
<template>
  <div>Header</div>
</template>
```
```js
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Header from '@/Header.vue'

const Layout = {
  template: `
    <div>
      <header>
        <slot name="header" />
      </header>     
      <div>
        <slot name="sidebar" />
      </div>
      <main>
        <slot name="main" />
      </main>
      <footer>
        <slot name="footer" />
      </footer>
    </div>
  `
}

test('layout full page layout', () => {
  const wrapper = mount(Layout, {
    slots: {
      header: Header,
      main: h('div', 'Main Content'),
      sidebar: { template: '<div>Sidebar</div>' },
      footer: '<div>Footer</div>',
    }
  })

  expect(wrapper.html()).toContain('<div>Header</div>')
  expect(wrapper.html()).toContain('<div>Main Content</div>')
  expect(wrapper.html()).toContain('<div>Footer</div>')
})
```
[Consulte las pruebas](https://github.com/vuejs/test-utils/blob/9d3c2a6526f3d8751d29b2f9112ad2a3332bbf52/tests/mountingOptions/slots.spec.ts#L124-L167) para ver más ejemplos y casos de uso.

## Ranuras con alcance

También se admiten enlaces y [ranuras con alcance](https://vuejs.org/guide/components/slots.html#scoped-slots).

```js
import { mount } from '@vue/test-utils'

const ComponentWithSlots = {
  template: `
    <div class="scoped">
      <slot name="scoped" v-bind="{ msg }" />
    </div>
  `,
  data() {
    return {
      msg: 'world'
    }
  }
}

test('scoped slots', () => {
  const wrapper = mount(ComponentWithSlots, {
    slots: {
      scoped: `<template #scoped="params">
        Hello {{ params.msg }}
        </template>
      `
    }
  })

  expect(wrapper.html()).toContain('Hello world')
})
```
## Conclusión

- Use la opción de montaje `slots` para probar que los componentes que usan `<slot>` están procesando el contenido correctamente.
- El contenido puede ser una cadena, una función de representación o un SFC importado.
- Use `default` para la ranura predeterminada y el nombre correcto para las ranuras con nombre.
- También se admiten las ranuras con ámbito y la abreviatura **(`#`)**.

