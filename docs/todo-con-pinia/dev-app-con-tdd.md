# Dev App con TDD

:::info Objetivos
- Construiremos un formulario TODO List implementando [TDD](../comenzar/tdd.html).
- Para este ejemplo usaremos Pinia y Typescript.
:::

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
