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
## ¿ Qué aprenderemos aquí ?

Aquí hay una colección de ejemplos breves y enfocados en cómo probar los componentes de Vue. Utiliza vue-test-utils, la biblioteca oficial para probar los componentes de Vue, y Vitest, un marco de prueba moderno. Cubre la API vue-test-utils, así como las mejores prácticas para probar componentes.

Cada sección es independiente de las demás. Comenzamos a escribir una prueba simple. A continuación, se analizan dos formas de renderizar un componente: montar y montaje superficial. Las diferencias serán demostradas y explicadas.

De ahí en adelante, cubriremos cómo probar varios escenarios que surgen al probar componentes, como probar componentes que:

- Reciben accesorios
- Usan propiedades calculadas
- Renderizan otros componentes
- Emiten eventos

Y así sucesivamente. Luego pasamos a casos más interesantes, como:

- Mejores prácticas para probar Vuex (en componentes e independientemente)
- Probando el enrutador Vue
- Pruebas con componentes de terceros

También exploraremos cómo usar la API de Vitest para hacer que nuestras pruebas sean más sólidas, como por ejemplo:

- Burlarse de las respuestas de la API
- Burlarse y espiar módulos
- Uso de instantáneas
