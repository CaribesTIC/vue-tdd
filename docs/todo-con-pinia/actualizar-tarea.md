# Actualizar Tarea

## Crear la prueba

Empezaremos creando la prueba que espera que nuestra aplicación permita actualizar una tarea.

```ts
// omitted for brevity ...
describe("useTodoStore", () => {
  // omitted for brevity ...
  it("updates a todo", () => {
    store.add({title: 'test'})    
    const todo = store.items[0]

    store.update(todo.id, {done: true})
    const updated = store.items[0]

    expect(updated.done).toBe(true)
  })
})
```

Tome en cuenta que en cada prueba el estado inicial del arreglo `items` es vacio. Entonces, primero necesitamos preparar la prueba agregando una tarea a través de la acción `add`. Luego ejecutaremos la acción `update` pasándole como argumento primero el `id` de la tarea que queremos actualizar y el objeto tipo `TodoUpdate` con valor(es) modificado(s). Finalmente esperamos que la tarea en cuestión haya sido actualizada.

Avancemos construyendo la acción `updated`.

## El Tipado `TodoUpdate`

Como estamos usuando **TypeScript**, definamos el tipo de argumento que recivirá la acción `update`. 

```ts
// omitted for brevity ...
export interface TodoUpdate{
  title?: string;
  done?: boolean;
}
// omitted for brevity ...
```
Tome en cuenta que, declaramos que el argumento debe ser un objeto tipo `TodoUpdate` con las propiedades `title` y/o `done`, que pueden ser modificables.

## Acción `updated`

Avancemos creando el método `updated`. Tenga en cuenta que estamos pasando tres argumentos, el primero es `this` del tipo `TodoState` que en realidad no lo estamos pasando sino declarando para que **TypeScript** no encienda la alarma.

El segundo argumento `id` del tipo `string` permitará buscar dentro del arreglo `this.items` la tarea que se quiere actualizar.

El tercer argumento `update` del tipo `TodoUpdate` contiene el objeto con valor(es) con que será actualizada la tarea.

```ts
import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";
import type { Todo, TodoAdd, TodoState, TodoUpdate } from "../types/todo"

// omitted for brevity ...
const actions = {
  // omitted for brevity ...
  update(this:TodoState, id: string, update: TodoUpdate) {
    const index = this.items.findIndex(item => item.id === id)
    this.items[index] = {
      ...this.items[index],
      ...update,
      updatedAt: new Date()
    }
  }
}
// omitted for brevity ...
```

Tome en cuenta que el método [`findIndex`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 
devolverá el índice de la tarea del arreglo `this.items` que cumpla con la condición de la función de prueba proporcionada. En este caso `item => item.id === id`.

Seguidamente actualizamos la tarea que corresponda a la posición del valor de la constante `index`.

```ts
this.items[index] = { /* omitted for brevity ... */ }
```

Una vez aclarado esto, entonces ejecutamos las pruebas.

```bash
 DEV /vue-todo-pinia-tdd/src

 ✓ stores/__tests__/todo.spec.ts (7)

Test Files  1 passed (1)
     Tests  7 passed (7)
  Start at  15:35:16
  Duration  1.72s (transform 682ms, setup 0ms, collect 197ms, tests 14ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Y las pruebas pasan.


