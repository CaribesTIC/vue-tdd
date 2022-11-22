# Crear Una Nueva Tarea


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

```ts
// omitted for brevity ...

export interface TodoAdd{
  title: string;
}
```

```bash
npm i uuid
```

```ts
import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";
import type { Todo, TodoAdd, TodoState } from "../types/todo"

// omitted for brevity ...

const actions = {
  add(this:TodoState, partialTodo: TodoAdd) {
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

Las pruebas pasan...


