# Consultar Tareas

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


