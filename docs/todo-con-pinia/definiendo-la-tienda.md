# Definiendo la Tienda

## Tipado Inicial

Partiremos dejando claro el tipo de información que manejaremos a continuación. Por lo que vamos a crear un archivo para tal definición.

📃`types/todo.ts`
```ts
export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoState {
  items: Todo[];
}
```

Tenga en cuenta que partimos definiendo el tipo `Todo` el cual representa el objeto con las propiedadades de cada tarea. A su vez, definimos `TodoState` cuya propiedad `items` declarada es del tipo `Todo[]`, en otras plalabras, se trata de un arreglo de tareas.

## Crear un Bosquejo de la Tienda

Para definir tienda `todo` empezaremos creando un bosquejo de la misma.

Primero importaremos el complemento `pinia` y también importamos el tipo `TodoState` para la declaración del `state`.

📃`stores/todo.ts`
```ts
import { defineStore } from "pinia";
import type { TodoState } from "../types/todo"

const state = (): TodoState => ({
  items: []
})

const getters = {}

const actions = {}

export const useTodoStore = defineStore('todoStore',{
  state,
  getters,
  actions
})
```
Tenga en cuenta que hasta ahora solo tenemos una estructura básica de la tienda más el estado inicial de la misma. Ahora, vamos a probar si está funcionando.

## Probar la Definición de la Tienda

Para probar si la tienda está definida es necesario crea una instancia de pinia y establecerla como activa. Por ello importamos [setActivePinia](https://pinia.vuejs.org/api/modules/pinia.html#setactivepinia) y [createPinia](https://pinia.vuejs.org/api/modules/pinia.html#createpinia). 

También importamos, los correspondientes métodos que aplicaremos en las pruebas:
- [afterEach](https://vitest.dev/api/#aftereach)
- [beforeAll](https://vitest.dev/api/#beforeall)
- [beforeEach](https://vitest.dev/api/#beforeeach)
- [describe](https://vitest.dev/api/#describe)
- [expect](https://vitest.dev/api/#expect)
- [it](https://vitest.dev/api/#test)

Luego, finalizamos las importaciones con `useTodoStore`.

📃`stores/__tests__/todo.spec.ts`
```ts
import { createPinia, setActivePinia } from "pinia"
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
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
})
```

Tenga en cuenta que:

1. `setActivePinia(createPinia())` se ejecutará antes de que cada prueba se ejecute.
2. Declaramos la variable `store` para ser usada en cada una de las pruebas.
3. La asignación de `useTodoStore()` al `store` se realizará en cada prueba.
4. Al finalizar cada prueba se ejecutará `store.$reset()` para resetear el `store`.

Ahora ejecutamos las pruebas.

```bash
npm run test:unit
```

Y las pruebas pasan...
