# Consultar Tareas

## Consultar una tarea

Empezaremos creando la prueba que espera que nuestra aplicación permita consultar una tarea.

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

Teniendo la respectiva prueba lista, ahora es momento de construir la funcionalidad...

## Captador `getById`

Avancemos creando el **getters** `getById`.

Tenga en cuenta que consultaremos una tarea específica según el argumento `id` que le pasemos a la función `getById`. Por lo tanto, para que esto funcione, debemos crear una primera función que devuelva otra segunda función.

En otras palabras, en la primera función pasamos el `state` tipo `TodoState` y en la segunda función pasamos el argumento `id` tipo `string`.

```ts
// omitted for brevity ...
const getters = {
  getById: (state: TodoState) => (id: string) => {
    return state.items.find((item: Todo) => item.id === id)
  }
}
// omitted for brevity ...
```

Finalmente, retorna la tarea buscada, si existe, a traveś del método [`find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).

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

Y las pruebas pasan.

## Consultar todas las tareas

Para este caso, empezamos preparando la prueba creando el arreglo `items` con tres supuestas tareas.

>Tenga en cuenta que **solo** estamos estableciendo la propiedad `createdAt` (con fechas no ordenadas) a cada tarea. Por lo que, a continuación, hay que colocar el correspondiente comentario `// @ts-ignore` para que **Typescript** acepte el tipado.

Luego de ejecutar la consulta con el método `getOrderedTodos`, haremos dos comprobaciones:

1. Devuelver las tareas de manera ordenada según la fecha.
2. No altera el estado original de las tareas.

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

## Captador `getOrderedTodos`


Tenga en cuenta que este **getter** solo recibe un argumento, `state` tipo `TodoState`.

>Utilizaremos el método [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) para ordenar el arreglo que será devuelto. Es importante mencionar, que _"este método ordena los elementos de un arreglo en su lugar y devuelve la referencia al mismo arreglo, ahora ordenado"._
>
>- Por lo tanto, este código **mutará** el estado:
>```ts
>array.sort((a, b) => { /* … */ })
>```
>- Para evitar este comportamiento, será:
>```ts
>[...array].sort((a, b) => { /* … */ })
>```

Avancemos creando el **getters** `getOrderedTodos`.

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

Y las pruebas pasan.


