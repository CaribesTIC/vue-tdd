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

Ahora ejecutamos las pruebas.

```bash
 DEV /vue-todo-pinia-tdd/src

 ✓ stores/__tests__/todo.spec.ts (6)

Test Files  1 passed (1)
     Tests  6 passed (6)
  Start at  15:33:51
  Duration  1.72s (transform 671ms, setup 1ms, collect 195ms, tests 14ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Las pruebas pasan.


