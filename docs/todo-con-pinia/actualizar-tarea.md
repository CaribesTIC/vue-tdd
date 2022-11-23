# Actualizar Tarea

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

```ts
// omitted for brevity ...
export interface TodoUpdate{
  title?: string;
  done?: boolean;
}
// omitted for brevity ...
```

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

Ahora ejecutamos las pruebas.

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

Las pruebas pasan.


