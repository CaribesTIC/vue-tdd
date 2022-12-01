# Crear Nueva Tarea

## Crear la prueba

Empezaremos creando la prueba que espera que nuestra aplicación permita agregar una nueva tarea.

📃`stores/__tests__/todo.spec.ts`
```ts
// omitted for brevity ...
describe("useTodoStore", () => {
  // omitted for brevity ...
  it("should creates a todo", () => {
    store.add({title: 'Test my code!'})

    expect(store.items[0]).toBeDefined()
    expect(store.items[0].title).toBe('Test my code!')   
  })
})
```

Teniendo la respectiva prueba lista, ahora es momento de construir la funcionalidad...

## El Tipado

Ya que estamos usuando **TypeScript**, definamos el tipo de valor que recivirá la función. Con esto estamos indicando que el único argumento que necesitamos será el `title` de la tarea.

📃`types/todo.ts`
```ts
// omitted for brevity ...

export interface TodoAdd {
  title: string;
}
```

## `uuid`

Antes de continuar, instalaremos el paquete para la creación de [Universally Unique IDentifier](https://www.npmjs.com/package/uuid) el cual usaremos para asignarlo a cada tarea.

```bash
npm i -D uuid
```

## Acción `add`

Avancemos creando el método `add`. Tenga en cuenta que estamos pasando dos argumentos, el primero es `this` del tipo `TodoState` que en realidad no lo estamos pasando sino declarando para que **TypeScript** no chille.

El segundo argumento `partialTodo` del tipo `TodoAdd` si es el que nos interesa.

📃`stores/todo.ts`
```ts
import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";
import type { Todo, TodoAdd, TodoState } from "../types/todo"

// omitted for brevity ...

const actions = {
  add(this: TodoState, partialTodo: TodoAdd) {
    const todo: Todo = {
      id: uuid(),
      ...partialTodo,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.items.push(todo)
  }  
}

// omitted for brevity ...
```
Tenga en cuenta que el método `add`, después de recibir los argumentos, crea la constante `todo` asignándole un objeto con las propiedades del tipo [`Todo`](../todo-con-pinia/definiendo-la-tienda.html#tipado-inicial). Luego, hace [`push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) de este objeto al arreglo `this.items` el cual representa el estado de la tienda.

Ahora ejecutamos las pruebas.

```bash
 DEV /vue-todo-pinia-tdd/src

 ✓ stores/__tests__/todo.spec.ts (3)

Test Files  1 passed (1)
     Tests  3 passed (3)
  Start at  17:41:01
  Duration  1.72s (transform 684ms, setup 1ms, collect 206ms, tests 11ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Y las pruebas pasan.

