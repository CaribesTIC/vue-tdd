# Un Curso Acelerado

¡Vamos a saltar directamente a eso! Aprendamos Vue Test Utils (VTU) creando una aplicación Todo simple y escribiendo pruebas sobre la marcha. Esta guía cubrirá cómo:

- Componentes de montaje
- Buscar elementos
- Llenar formularios
- Activar eventos

## Empezando

Comenzaremos con un componente `TodoApp` simple con una sola tarea pendiente:

```vue
<template>
  <div></div>
</template>

<script>
export default {
  name: 'TodoApp',

  data() {
    return {
      todos: [
        {
          id: 1,
          text: 'Learn Vue.js 3',
          completed: false
        }
      ]
    }
  }
}
</script>
```
## La primera prueba - se procesa una tarea pendiente

La primera prueba que escribiremos verifica que se renderice una tarea pendiente. Veamos primero la prueba, luego analicemos cada parte:

```js
import { mount } from '@vue/test-utils'
import TodoApp from '@/TodoApp.vue'

test('renders a todo', () => {
  const wrapper = mount(TodoApp)

  const todo = wrapper.get('[data-test="todo"]')

  expect(todo.text()).toBe('Learn Vue.js 3')
})
```
Comenzamos importando el montaje: esta es la forma principal de representar un componente en VTU. Declara una prueba utilizando la función de prueba con una breve descripción de la prueba. Las funciones `test` y `expect` están disponibles globalmente en la mayoría de los ejecutores de pruebas (este ejemplo usa [Vitest](https://vitest.dev/)). Si `test` y `expect` parece confuso, [aquí](../comenzar/tdd.html) encontraras lo que debes conocer antes de probar componentes de Vue.

A continuación, llamamos a `mount` y pasamos el componente como primer argumento; esto es algo que casi todas las pruebas (de componentes Vue) que escribas harán. Por convención, asignamos el resultado a una variable llamada `wrapper`, ya que `mount` proporciona un "envoltorio" simple alrededor de la aplicación con algunos métodos convenientes para realizar pruebas.

Finalmente, usamos otra función global común a muchos ejecutores de pruebas - incluido Vitest - `expect`. La idea es que estamos afirmando, o _esperando_, que el resultado real coincida con lo que creemos que debería ser. En este caso, estamos encontrando un elemento con el selector `data-test="todo"` - en el DOM, se verá como `<div data-test="todo">...</div>`. Luego llamamos al método `text` para obtener el contenido, que esperamos sea `'Learn Vue.js 3'`.


>No es requerido usar selectores de `data-test`, pero puede hacer que sus pruebas sean menos frágiles. Las clases y los identificadores tienden a cambiar o moverse a medida que crece la aplicación - al usar `data-test`, queda claro para otros desarrolladores qué elementos se usan en las pruebas y no deben cambiarse.

## Haciendo pasar la prueba

Si ejecutamos esta prueba ahora, falla con el siguiente mensaje de error: `Unable to get [data-test="todo"]`. Esto se debe a que no estamos procesando ningún elemento pendiente, por lo que la llamada `get()` no puede devolver un contenedor (recuerde, VTU envuelve todos los componentes y elementos DOM en un "envoltorio" con algunos métodos convenientes). Actualicemos `<template>` en `TodoApp.vue` para renderizar el arreglo `todos`:

```vue
<template>
  <div>
    <div v-for="todo in todos" :key="todo.id" data-test="todo">
      {{ todo.text }}
    </div>
  </div>
</template>
```
Con este cambio, la prueba está pasando. ¡Felicidades! Escribiste tu primera prueba de componentes.

## Añadir una nueva tarea pendiente

La siguiente función que agregaremos es que el usuario pueda crear una nueva tarea pendiente. Para hacerlo, necesitamos un formulario con una entrada para que el usuario escriba algún texto. Cuando el usuario envía el formulario, esperamos que se muestre el nuevo todo. Echemos un vistazo a la prueba:

```js
import { mount } from '@vue/test-utils'
import TodoApp from '@/TodoApp.vue'

test('creates a todo', () => {
  const wrapper = mount(TodoApp)
  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(1)

  wrapper.get('[data-test="new-todo"]').setValue('New todo')
  wrapper.get('[data-test="form"]').trigger('submit')

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2)
})
```

Como de costumbre, comenzamos usando `mount` para representar el elemento. También estamos afirmando que solo se procesa 1 tarea pendiente; esto deja en claro que estamos agregando una tarea pendiente adicional, como sugiere la línea final de la prueba.

Para actualizar `<input>`, usamos `setValue` - esto nos permite establecer el valor de la entrada.

Después de actualizar `<input>`, usamos el método `trigger` para simular al usuario que envía el formulario. Finalmente, afirmamos que el número de tareas ha aumentado de 1 a 2.

Si ejecutamos esta prueba, obviamente fallará. Actualicemos `TodoApp.vue` para que tenga los elementos `<form>` y `<input>` y pasemos la prueba:

```vue
<template>
  <div>
    <div v-for="todo in todos" :key="todo.id" data-test="todo">
      {{ todo.text }}
    </div>

    <form data-test="form" @submit.prevent="createTodo">
      <input data-test="new-todo" v-model="newTodo" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'TodoApp',

  data() {
    return {
      newTodo: '',
      todos: [
        {
          id: 1,
          text: 'Learn Vue.js 3',
          completed: false
        }
      ]
    }
  },

  methods: {
    createTodo() {
      this.todos.push({
        id: 2,
        text: this.newTodo,
        completed: false
      })
    }
  }
}
</script>

```
Estamos usando `v-model` para vincular a `<input>` y `@submit` para escuchar el envío del formulario. Cuando se envía el formulario, se llama a `createTodo` e inserta un nuevo todo en el arreglo `todos`.

Si bien esto se ve bien, la ejecución de la prueba muestra un error:

```
expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 1
    Received array:  [{"element": <div data-test="todo">Learn Vue.js 3</div>}]

```
El número de todos no ha aumentado. El problema es que Jest ejecuta las pruebas de manera síncrona, finalizando la prueba tan pronto como se llama a la función final. Vue, sin embargo, actualiza el DOM de forma asíncrona. Necesitamos marcar la prueba `async` y llamar a `await` en cualquier método que pueda causar que el DOM cambie. `trigger` es uno de esos métodos, al igual que `setValue`: simplemente podemos anteponer `await` y la prueba debería funcionar como se esperaba:

```js
import { mount } from '@vue/test-utils'
import TodoApp from './TodoApp.vue'

test('creates a todo', async () => {
  const wrapper = mount(TodoApp)

  await wrapper.get('[data-test="new-todo"]').setValue('New todo')
  await wrapper.get('[data-test="form"]').trigger('submit')

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2)
})
```
¡Ahora la prueba finalmente está pasando!

## Completando un todo

Ahora que podemos crear tareas pendientes, démosle al usuario la capacidad de marcar un elemento de tareas pendientes como completado/incompleto con una casilla de verificación. Como anteriormente, comencemos con la prueba fallida:

```js
test('completes a todo', async () => {
  const wrapper = mount(TodoApp)

  await wrapper.get('[data-test="todo-checkbox"]').setValue(true)

  expect(wrapper.get('[data-test="todo"]').classes()).toContain('completed')
})
```
Esta prueba es similar a las dos anteriores; encontramos un elemento e interactuamos con él de la misma manera (usamos `setValue` nuevamente, ya que estamos interactuando con un `<input>`).

Por último, hacemos una afirmación. Aplicaremos una clase `completed` a todos completados - luego podemos usar esto para agregar algo de estilo para indicar visualmente el estado de un todo.

Podemos hacer que pase esta prueba actualizando `<template>` para incluir `<input type="checkbox">` y un enlace de clase en el elemento todo:

```vue
<template>
  <div>
    <div
      v-for="todo in todos"
      :key="todo.id"
      data-test="todo"
      :class="[todo.completed ? 'completed' : '']"
    >
      {{ todo.text }}
      <input
        type="checkbox"
        v-model="todo.completed"
        data-test="todo-checkbox"
      />
    </div>

    <form data-test="form" @submit.prevent="createTodo">
      <input data-test="new-todo" v-model="newTodo" />
    </form>
  </div>
</template>
```
¡Felicidades! Escribiste tus primeras pruebas de componentes.

## Arreglar, Actuar, Afirmar

Es posible que haya notado algunas líneas nuevas entre el código en cada una de las pruebas. Veamos la segunda prueba nuevamente, en detalle:

```js
import { mount } from '@vue/test-utils'
import TodoApp from './TodoApp.vue'

test('creates a todo', async () => {
  const wrapper = mount(TodoApp)

  await wrapper.get('[data-test="new-todo"]').setValue('New todo')
  await wrapper.get('[data-test="form"]').trigger('submit')

  expect(wrapper.findAll('[data-test="todo"]')).toHaveLength(2)
})
```
La prueba se divide en tres etapas distintas, separadas por nuevas líneas. Las tres etapas representan las tres fases de una prueba: `arreglar`, `actuar` y `afirmar`.

En la fase de _arreglar_, estamos configurando el escenario para la prueba. Un ejemplo más complejo puede requerir la creación de una tienda Vuex o el llenado de una base de datos.

En la fase de _actuación_, representamos el escenario, simulando cómo un usuario interactuaría con el componente o la aplicación.

En la fase de _afirmación_, hacemos afirmaciones sobre cómo esperamos que sea el estado actual del componente.

Casi todas las pruebas seguirán estas tres fases. No necesita separarlos con nuevas líneas como lo hace esta guía, pero es bueno tener en cuenta estas tres fases al escribir sus pruebas.

# Conclusión
- Use `mount()` para renderizar un componente.
- Utilice `get()` y `findAll()` para consultar el DOM.
- `trigger()` y `setValue()` son ayudantes para simular la entrada del usuario.
- Actualizar el DOM es una operación asíncrona, así que asegúrese de usar `async` y `await`.
- Las pruebas suelen constar de 3 fases; arreglar, actuar y afirmar.
