# Entorno de prueba

## Instalar Vue Tests Utils

Una vez creado el proyecto con [Vite](../../vitest/entorno-de-prueba.html#crear-proyecto-con-vite) y haber instalado [Vitest](../../vitest/entorno-de-prueba.html#instalar-vitest) hay que ejecutar la siguiente línea de comando para así instalar [Vue Tests Utils](https://test-utils.vuejs.org/installation/) 
```
npm i -D @vue/test-utils@next
```
Así de fácil, ahora, Escribamos la primera prueba a un componente Vue.

## Escribamos la primera prueba

Ensuciémonos las manos, escribiendo nuestro propio componente y una prueba. Tradicionalmente, al hacer TDD, primero escribe la prueba fallida y luego implementa el código que permite que pase la prueba. Por ahora, escribiremos primero el componente.

Creando el componente Greeting

Cree un archivo `Greeting.vue` en `src/components`. Dentro de `Greeting.vue`, agregue lo siguiente:
```vue
<template>
  <div>
    {{ greeting }}
  </div>
</template>

<script>
export default {
  name: "Greeting",

  data() {
    return {
      greeting: "Vue and TDD"
    }
  }
}
</script>
```
## Escribir la Prueba
`Greeting` tiene una sola responsabilidad: representar el valor de `greeting`. La estrategia será:

1. Renderizar el componente con `mount`
1. Afirmar que el texto del componente contiene "Vue y TDD"

Cree un `Greeting.spec.js` dentro de `tests/unit`. En el interior, importe `Greeting.vue`, así como `mount`, y agregue el trazado de la prueba:
```js
import { mount } from '@vue/test-utils'
import Greeting from '@/components/Greeting.vue'

describe('Greeting.vue', () => {
  it('renders a greeting', () => {

  })
})
```
Hay diferentes sintaxis usadas para TDD, usaremos la sintaxis de `describe` e `it` comúnmente que viene con Vitest. `describe` generalmente describe de qué se trata la prueba, en este caso `Greeting.vue`. Representa una sola responsabilidad que debe cumplir el sujeto de la prueba. A medida que agregamos más funciones al componente, agregamos más bloques `it`.

Ahora deberíamos renderizar el componente con `mount`. La práctica estándar es asignar el componente a una variable llamada `wrapper`. También imprimiremos la salida, para asegurarnos de que todo funciona correctamente:

```js{7,8,9,10}
import { mount } from '@vue/test-utils'
import Greeting from '@/components/Greeting.vue'

describe('Greeting.vue', () => {
  it('renders a greeting', () => {
  
    const wrapper = mount(Greeting)

    console.log(wrapper.html())

  })
})
```

## Ejecutando la prueba

Ejecute la prueba escribiendo `npm run test` en su terminal. Cualquier archivo en el directorio de pruebas que termine con `.spec.js` o `.test.js` se ejecuta automáticamente. Si todo ha ido bien, deberías ver:

```
<div>Vue and TDD</div>

 √ tests/unit/Greeting.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  6.28s (in thread 16ms, 39195.30%)
```
Podemos ver que el marcado es correcto y la prueba pasa. La prueba pasa porque no hubo fallas; esta prueba nunca puede fallar, por lo que aún no es muy útil. Incluso si cambiamos `Greeting.vue` y eliminamos `greeting` de la plantilla, seguirá pasando. Cambiemos eso.

## Hacer afirmaciones

Necesitamos hacer una afirmación para asegurarnos de que el componente se comporta correctamente. Podemos hacer eso usando `expect` de la API  de Vitest. Tiene este aspecto: `expect(result).to [matcher] (actual)`.

[Los comparadores](../../vitest/usando-comparadores.html) son métodos para comparar valores y objetos. Por ejemplo:

```js
expect(1).toBe(1)
```
Una lista completa de comparadores está disponible en la [documentación de Vitest](https://vitest.dev/api/#expect). `vue-test-utils` no incluye ningún comparador - los que proporciona Vitest son más que suficientes. Queremos comparar el texto de `Greeting`. Podríamos escribir:

```js
expect(wrapper.html().includes("Vue and TDD")).toBe(true)
```
Pero `vue-test-utils` tiene una forma aún mejor de obtener el marcado: `wrapper.text`. Terminemos la prueba:
```js
import { mount } from '@vue/test-utils'
import Greeting from '@/components/Greeting.vue'

describe('Greeting.vue', () => {
  it('renders a greeting', () => {
    const wrapper = mount(Greeting)

    expect(wrapper.text()).toMatch("Vue and TDD")
  })
})
```
Ya no necesitamos el ningún `console.log`, por lo que puede eliminarlo. Ejecute las pruebas con `npm run test`, y si todo salió bien, debería obtener:

```
 √ tests/unit/Greeting.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  12ms
```
Luciendo bien. Pero siempre debe ver que una prueba falla y luego pasa, para asegurarse de que realmente funciona. En TDD tradicional, escribiría la prueba antes de la implementación real, vería que falla y luego usaría los errores fallidos para guiar su código. Asegurémonos de que esta prueba realmente funcione. Actualizar `Greeting.vue`:

```vue
<template>
  <div>
    {{ greeting }}
  </div>
</template>

<script>
export default {
  name: "Greeting",

  data() {
    return {
      greeting: "Vue without TDD"
    }
  }
}
</script>
```
Y ahora ejecuta la prueba con `npm run test`:

```
FAIL  tests/unit/Greeting.spec.js > Greeting.vue > renders a greeting
AssertionError: expected 'Vue without TDD' to include 'Vue and TDD'
 ❯ tests/test.test.js:9:28
      7|     const wrapper = mount(Greeting)
      8|     
      9|     expect(wrapper.text()).toMatch("Vue and TDD")
       |                            ^
     10|   })
     11| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

Test Files  1 failed (1)
     Tests  1 failed (1)
      Time  14ms
```
Vitest nos da buenos comentarios. Podemos ver el resultado esperado y el real, así como en qué línea falló la expectativa. La prueba falló, como se esperaba. Revierta `Greeting.vue` y asegúrese de que la prueba vuelva a pasar.

## Uso de Vue 3 y la _Composition API_

Vue 3 agrega otra API para crear componentes: la _Composition API_. Una señal de una buena prueba es que evitamos probar los detalles de implementación (cómo funciona el código), sino que nos enfocamos en el comportamiento (lo que hace el código). Refactoricemos el componente anterior y veamos qué sucede. Si la prueba aún pasa, sabemos que está probando las cosas correctas. Si falla, podríamos estar probando un detalle de implementación.

```vue
<template>
  <div>
    {{ greeting }}
  </div>
</template>

<script>
export default {
  name: 'Greeting',
  setup() {
    const greeting = 'Vue and TDD';

    return {
      greeting,
    };
  },
};
</script>
```
Al comenzar con la _Composition API_, a menudo se olvida de agregar la variable a la devolución. Intente omitir esto y vea cómo falla la prueba. Si planea convertir algunos de los componentes de la _Options API_ a la _Composition API_, algunas pruebas pueden brindarle confianza y proporcionar un ciclo de retroalimentación positiva durante la refactorización.

## _Script Setup_

Agreguemos una refactorización más llevando `Greeting.vue` a `<script setup>`:
```vue
<script setup>
const greeting = 'Vue and TDD';
</script>

<template>
  <div>
    {{ greeting }}
  </div>
</template>
```

## ¿Qué Sigue?

Para ver Vue Test Utils en acción, realice el Curso Acelerado, donde construimos una aplicación sencilla de Todo utilizando un enfoque de prueba primero.

Los documentos se dividen en dos secciones principales:

- **Esenciales**, para cubrir los casos de uso comunes que enfrentará al probar los componentes de Vue.
- **Vue Test Utils en Profundidad**, para explorar otras funciones avanzadas de la biblioteca.

También puede explorar la [API](https://test-utils.vuejs.org/api/) completa.

Alternativamente, si prefiere aprender a través de video, hay [una serie de conferencias disponibles aquí](https://www.youtube.com/playlist?list=PLC2LZCNWKL9ahK1IoODqYxKu5aA9T5IOA).

