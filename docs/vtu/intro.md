# ¿Qué es Vue Test Utils?

Vue Test Utils (VTU), ¡la biblioteca oficial de utilidades de prueba para Vue.js! Es un conjunto de funciones de utilidad destinadas a simplificar las pruebas de los componentes de Vue.js. Proporciona algunos métodos para montar e interactuar con los componentes de Vue de forma aislada.

Veamos un ejemplo:

```js
import { mount } from '@vue/test-utils'

// The component to test
const MessageComponent = {
  template: '<p>{{ msg }}</p>',
  props: ['msg']
}

test('displays message', () => {
  const wrapper = mount(MessageComponent, {
    props: {
      msg: 'Hello world'
    }
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Hello world')
})
```

## ¿Qué Sigue?


Para ver Vue Test Utils en acción, realice el Curso Acelerado, donde construimos una aplicación sencilla de Todo utilizando un enfoque de prueba primero.

Los documentos se dividen en dos secciones principales:

- **Esenciales**, para cubrir los casos de uso comunes que enfrentará al probar los componentes de Vue.
- **Vue Test Utils en Profundidad**, para explorar otras funciones avanzadas de la biblioteca.

También puede explorar la [API](https://test-utils.vuejs.org/api/) completa.

Alternativamente, si prefiere aprender a través de video, hay [una serie de conferencias disponibles aquí](https://www.youtube.com/playlist?list=PLC2LZCNWKL9ahK1IoODqYxKu5aA9T5IOA).

