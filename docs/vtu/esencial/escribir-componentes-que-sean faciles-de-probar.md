# Escribir componentes que sean fáciles de probar

Vue Test Utils lo ayuda a escribir pruebas para los componentes de Vue. Sin embargo, no hay mucho que VTU pueda hacer.

A continuación se incluye una lista de sugerencias para escribir código que sea más fácil de probar y para escribir pruebas que sean significativas y fáciles de mantener.

La siguiente lista proporciona una guía general y puede ser útil en escenarios comunes.

## No probar los detalles de implementación

Piense en términos de entradas y salidas desde la perspectiva del usuario. Aproximadamente, esto es todo lo que debe tener en cuenta al escribir una prueba para un componente de Vue:

| Entradas        | Ejemplos                                                  |
| ----------------| ----------------------------------------------------------|
| Interacciones   | Hacer click, escribir... cualquier interacción "humana"   |
| Props           | Los argumentos que recibe un componente                   |
| Flujos de datos | Datos entrantes de llamadas API, suscripciones de datos...|
 
| Salidas             | Ejemplos                                              |
| --------------------| ------------------------------------------------------|
| Elementos DOM       | Cualquier nodo observable representado en el documento|
| Eventos             | Eventos emitidos (usando `$emit`)                     |
| Efectos secundarios | Como `console.log` o llamadas API                     | 

## Todo lo demás son detalles de implementación.

Observe cómo esta lista no incluye elementos como métodos internos, estados intermedios o incluso datos.
 
La regla general es que **una prueba no debe fallar en un refactor**, es decir, cuando cambiamos su implementación interna sin cambiar su comportamiento. Si eso sucede, la prueba podría depender de los detalles de implementación.

Por ejemplo, supongamos un componente de contador básico que presenta un botón para incrementar un contador:

```vue
<template>
  <p class="paragraph">Times clicked: {{ count }}</p>
  <button @click="increment">increment</button>
</template>

<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```
Podríamos escribir la siguiente prueba:
```js
import { mount } from '@vue/test-utils'
import Counter from '@/Counter.vue'

test('counter text updates', async () => {
  const wrapper = mount(Counter)
  const paragraph = wrapper.find('.paragraph')

  expect(paragraph.text()).toBe('Times clicked: 0')

  await wrapper.setData({ count: 2 })

  expect(paragraph.text()).toBe('Times clicked: 2')
})
```
Observe cómo aquí estamos actualizando sus datos internos y también confiamos en los detalles (desde la perspectiva del usuario) como las clases de CSS.

::: tip CONSEJO
Tenga en cuenta que cambiar los datos o el nombre de la clase CSS haría que la prueba fallara. Sin embargo, el componente seguiría funcionando como se esperaba. Esto se conoce como **falso positivo**.
:::

En cambio, la siguiente prueba intenta apegarse a las entradas y salidas enumeradas anteriormente:
```js
import { mount } from '@vue/test-utils'
import Counter from '@/Counter.vue'

test('text updates on clicking', async () => {
  const wrapper = mount(Counter)

  expect(wrapper.text()).toContain('Times clicked: 0')

  const button = wrapper.find('button')
  await button.trigger('click')
  await button.trigger('click')

  expect(wrapper.text()).toContain('Times clicked: 2')
})
```
Las bibliotecas como [Vue Testing Library](https://github.com/testing-library/vue-testing-library/) se basan en estos principios. Si está interesado en este enfoque, asegúrese de comprobarlo.

## Construya componentes más pequeños y simples

Una regla general es que si un componente hace menos, será más fácil probarlo.

Hacer componentes más pequeños los hará más componibles y más fáciles de entender. A continuación se incluye una lista de sugerencias para simplificar los componentes.

## Extraer llamadas a la API

Por lo general, realizará varias solicitudes HTTP a lo largo de su aplicación. Desde una perspectiva de prueba, las solicitudes HTTP proporcionan entradas al componente y un componente también puede enviar solicitudes HTTP.

::: tip CONSEJO
Consulte la guía [Realizando solicitudes HTTP](../vue-test-utils-en-profundidad/solicitudes-http.html) si no está familiarizado con la prueba de llamadas API.
:::

## Extraer métodos complejos

A veces, un componente puede presentar un método complejo, realizar cálculos pesados o usar varias dependencias.

La sugerencia aquí es **extraer este método e importarlo al componente**. De esta forma, puede probar el método de forma aislada usando Vitest o cualquier otro corredor de prueba.

Esto tiene el beneficio adicional de terminar con un componente que es más fácil de entender porque la lógica compleja está encapsulada en otro archivo.

Además, si el método complejo es difícil de configurar o lento, es posible que desee simularlo para que la prueba sea más simple y rápida. Los ejemplos sobre [realizando solicitudes HTTP](../vue-test-utils-en-profundidad/solicitudes-http.html) son un buen ejemplo: ¡axios es una biblioteca bastante compleja!

## Escribir pruebas antes de escribir el componente.

¡No puede escribir código no verificable si escribe pruebas de antemano!

Nuestro [Curso Acelerado](../esencial/un-curso-acelerado.html) ofrece un ejemplo de cómo escribir pruebas antes del código conduce a componentes comprobables. También lo ayuda a detectar y probar casos extremos.
