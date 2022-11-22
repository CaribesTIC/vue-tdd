# Eliminar Tareas

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


