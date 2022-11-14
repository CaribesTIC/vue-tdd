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


```ts
// omitted for brevity ...
describe("useTodoStore", () => {
  // omitted for brevity ...
  it("should gets by id", () => {
    store.add({title: 'Test'})

    const item = store.items[0]
    const todo = store.getById(item.id)

    expect(todo).toStrictEqual(item)   
  })
})
```

```ts
// omitted for brevity ...
const getters = {
  getById: (state: TodoState) => (id: string) => {
    return state.items.find((item: Todo) => item.id === id)
  }
}
// omitted for brevity ...
```

Las pruebas pasan...

```ts
// omitted for brevity ...
describe("useTodoStore", () => {
  // omitted for brevity ...
  it("should gets ordered todos without mutating state", () => {
    const items = [
      { createdAt: new Date(2021, 2, 14) },
      { createdAt: new Date(2019, 2, 14) },
      { createdAt: new Date(2020, 2, 14) }
   ]

    // @ts-ignore
    store.items = items
    const orderedTodos = store.getOrderedTodos

    expect(orderedTodos[0].createdAt.getFullYear()).toBe(2019)
    expect(orderedTodos[1].createdAt.getFullYear()).toBe(2020)
    expect(orderedTodos[2].createdAt.getFullYear()).toBe(2021)
    expect(store.items[0].createdAt.getFullYear()).toBe(2021)
    expect(store.items[1].createdAt.getFullYear()).toBe(2019)
    expect(store.items[2].createdAt.getFullYear()).toBe(2020)
  })
})
```

```ts
// omitted for brevity ...
const getters = {
  // omitted for brevity ...
  getOrderedTodos: (state: TodoState) =>
    [...state.items].sort(
      (a: Todo, b: Todo) => a.createdAt.getTime() - b.createdAt.getTime()     
    )
}
// omitted for brevity ...
```

Las pruebas pasan...


```ts
// omitted for brevity ...
describe("useTodoStore", () => {
  // omitted for brevity ...
  it("should removes a todo", () => {
    store.add({title: 'test'})
    const todo = store.items[0]

    store.remove(todo.id)

    expect(store.items).toStrictEqual([])
  })
})
```

```ts
// omitted for brevity ...
const actions = {
  // omitted for brevity ...
  remove(this:TodoState, id: string) {
    this.items = this.items.filter(item => item.id !== id)
  }
}
// omitted for brevity ...
```

Las pruebas pasan...


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

Las pruebas pasan...


```ts
export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}
  
export interface TodoAdd{
  title: string;
}

export interface TodoState {    
  items: Todo[];
}

export interface TodoUpdate{
  title?: string;
  done?: boolean;
}
```

```ts
import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";
import type { Todo, TodoAdd, TodoState, TodoUpdate } from "../types/todo"

const state = (): TodoState => ({
  items: []
})

const getters = {
  getById: (state: TodoState) => (id: string) => {
    return state.items.find((item: Todo) => item.id === id)
  },
  getOrderedTodos: (state: TodoState) =>
    [...state.items].sort(
      (a: Todo, b: Todo) => a.createdAt.getTime() - b.createdAt.getTime()     
    )
}

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
  },
  remove(this:TodoState, id: string) {
    this.items = this.items.filter(item => item.id !== id)
  },
  update(this:TodoState, id: string, update: TodoUpdate) {
    const index = this.items.findIndex(item => item.id === id)
    this.items[index] = {
      ...this.items[index],
      ...update,
      updatedAt: new Date()
    }
  }
}

export const useTodoStore = defineStore('todoStore',{
  state,
  getters,
  actions
})
```

```ts
import { createPinia, setActivePinia } from "pinia"
import { describe, it, expect, beforeAll, afterEach, beforeEach } from "vitest";
import { useTodoStore } from "../todo";

beforeAll(() => {
  setActivePinia(createPinia())
})

describe("useTodoStore", () => {
  let store: ReturnType<typeof useTodoStore>

  beforeEach(() => {
    store = useTodoStore()
  })

  afterEach(() => {
    store.$reset()
  })

  it("should creates a store", () => {
    expect(store).toBeDefined()
  })

  it("should initializes with empty items", () => {
    expect(store.items).toStrictEqual([])
  })

  it("should creates a todo", () => {
    store.add({title: 'Test my code!'})

    expect(store.items[0]).toBeDefined()
    expect(store.items[0].title).toBe('Test my code!')   
  })

  it("should gets by id", () => {
    store.add({title: 'Test'})

    const item = store.items[0]
    const todo = store.getById(item.id)

    expect(todo).toStrictEqual(item)   
  })

  it("should gets ordered todos without mutating state", () => {
    const items = [
      { createdAt: new Date(2021, 2, 14) },
      { createdAt: new Date(2019, 2, 14) },
      { createdAt: new Date(2020, 2, 14) }
    ]

    // @ts-ignore
    store.items = items
    const orderedTodos = store.getOrderedTodos

    expect(orderedTodos[0].createdAt.getFullYear()).toBe(2019)
    expect(orderedTodos[1].createdAt.getFullYear()).toBe(2020)
    expect(orderedTodos[2].createdAt.getFullYear()).toBe(2021)
    expect(store.items[0].createdAt.getFullYear()).toBe(2021)
    expect(store.items[1].createdAt.getFullYear()).toBe(2019)
    expect(store.items[2].createdAt.getFullYear()).toBe(2020)
  })

  it("should removes a todo", () => {
    store.add({title: 'test'})
    const todo = store.items[0]

    store.remove(todo.id)

    expect(store.items).toStrictEqual([])
  })

  it("updates a todo", () => {
    store.add({title: 'test'})    
    const todo = store.items[0]

    store.update(todo.id, {done: true})
    const updated = store.items[0]

    expect(updated.done).toBe(true)
  })
})
```
