# Consultar Tareas

## Consultar una tarea

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

Ahora ejecutamos las pruebas.

```bash
 DEV /vue-todo-pinia-tdd/src

 ✓ stores/__tests__/todo.spec.ts (4)

Test Files  1 passed (1)
     Tests  4 passed (4)
  Start at  15:29:20
  Duration  1.73s (transform 687ms, setup 1ms, collect 215ms, tests 12ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit


```

Las pruebas pasan.

## Consultar todas las tarea

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

Ahora ejecutamos las pruebas.

```bash
 DEV /vue-todo-pinia-tdd/src

 ✓ stores/__tests__/todo.spec.ts (5)

Test Files  1 passed (1)
     Tests  5 passed (5)
  Start at  15:31:36
  Duration  1.76s (transform 704ms, setup 1ms, collect 198ms, tests 13ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Las pruebas pasan.


