# Eliminar Tareas

## Crear la prueba

Empezaremos creando la prueba que espera que nuestra aplicación permita eliminar una tarea.

📃`stores/__tests__/todo.spec.ts`
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

Tome en cuenta que en cada prueba el estado inicial del arreglo `items` es vacio.
Entonces, primero necesitamos preparar la prueba agregando una tarea a través de la acción `add`.
Luego ejecutaremos la acción `remove` pasándole como argumento el `id` de la tarea que acabamos de agregar.
Finalmente esperamos que el estado del arreglo `items` sea el de un arreglo vacio.

Avancemos construyendo la acción `remove`.

## Acción `remove`

Ya sabemos que para que la acción `remove` funcione necesita recibir como argumento el `id` tipo `string` del la tarea que queremos eliminar.

📃`stores/todo.ts`
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

Tome en cuenta que para que **TypeScript** no se incomode necesitamos antes pasar como argumento el `this` tipo `TodoState`. Finalmente, aplicamos el [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) al arreglo `this.items` devolviendo todas las tareas que cumplan con la condición donde el `item.id` sea distinto al `id` pasado como argumento.

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

Y las pruebas pasan.


