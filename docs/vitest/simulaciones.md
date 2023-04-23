# Simulaciones

Al escribir pruebas, es solo cuestión de tiempo antes de que necesite crear una versión _"falsa"_ de un servicio interno o externo. Esto se conoce comúnmente como simulación. Vitest proporciona funciones de utilidad para ayudarlo a través de su ayudante **vi**. Puede usar `import { vi } from 'vitest'` o acceder a él globalmente (cuando la [configuración global](https://vitest.dev/config/#globals) está habilitada).

:::warning ADVERTENCIA
¡Recuerde siempre borrar o restaurar los simulacros antes o después de cada ejecución de prueba para deshacer los cambios de estado simulados entre ejecuciones! Consulte los documentos de [mockReset](https://vitest.dev/api/#mockreset) para obtener más información.
:::

Si quiere sumergirse de cabeza primero, consulte la [sección API](https://vitest.dev/api/#vi), de lo contrario, siga leyendo para sumergirse más profundamente en el mundo de la simulación.

## Fechas

A veces es necesario tener el control de la fecha para garantizar la coherencia al realizar las pruebas. Vitest usa el paquete [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers) para manipular los temporizadores, así como la fecha del sistema. Puede encontrar más información detallada sobre la API específica [aquí](https://vitest.dev/api/#vi-setsystemtime).

**Ejemplo**

```js
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const businessHours = [9, 17]

const purchase = () => {
  const currentHour = new Date().getHours()
  const [open, close] = businessHours

  if (currentHour > open && currentHour < close)
    return { message: 'Success' }

  return { message: 'Error' }
}

describe('purchasing flow', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('allows purchases within business hours', () => {
    // set hour within business hours
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    // access Date.now() will result in the date set above
    expect(purchase()).toEqual({ message: 'Success' })
  })

  it('disallows purchases outside of business hours', () => {
    // set hour outside business hours
    const date = new Date(2000, 1, 1, 19)
    vi.setSystemTime(date)

    // access Date.now() will result in the date set above
    expect(purchase()).toEqual({ message: 'Error' })
  })
})
```

## Funciones

Las funciones de simulación se pueden dividir en dos categorías diferentes: espiar y burlarse.

>_spying & mocking_

A veces, todo lo que necesita es validar si se ha llamado o no a una función específica (y posiblemente qué argumentos se pasaron). En estos casos, todo lo que necesitamos es un espía que puede usar directamente con `vi.spyOn()` ([lea más aquí](https://vitest.dev/api/#vi-spyon)).

Sin embargo, los espías solo pueden ayudarlo a espiar funciones, no pueden alterar la implementación de esas funciones. En el caso de que necesitemos crear una versión falsa (o simulada) de una función, podemos usar `vi.fn()` ([lea más aquí](https://vitest.dev/api/#vi-fn)).

Usamos [Tinyspy](https://github.com/tinylibs/tinyspy) como base para las funciones de simulación, pero tenemos nuestro propio envoltorio para que sea compatible con `jest`. Tanto `vi.fn()` como `vi.spyOn()` comparten los mismos métodos, sin embargo, solo se puede llamar al resultado devuelto de `vi.fn()`.

**Ejemplo**

```js
import { afterEach, describe, expect, it, vi } from 'vitest'

const getLatest = (index = messages.items.length - 1) => messages.items[index]

const messages = {
  items: [
    { message: 'Simple test message', from: 'Testman' },
    // ...
  ],
  getLatest, // can also be a `getter or setter if supported`
}

describe('reading messages', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get the latest message with a spy', () => {
    const spy = vi.spyOn(messages, 'getLatest')
    expect(spy.getMockName()).toEqual('getLatest')

    expect(messages.getLatest()).toEqual(
      messages.items[messages.items.length - 1],
    )

    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockImplementationOnce(() => 'access-restricted')
    expect(messages.getLatest()).toEqual('access-restricted')

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should get with a mock', () => {
    const mock = vi.fn().mockImplementation(getLatest)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toHaveBeenCalledTimes(1)

    mock.mockImplementationOnce(() => 'access-restricted')
    expect(mock()).toEqual('access-restricted')

    expect(mock).toHaveBeenCalledTimes(2)

    expect(mock()).toEqual(messages.items[messages.items.length - 1])
    expect(mock).toHaveBeenCalledTimes(3)
  })
})
```

**Más**

- [Funciones simuladas de Jest](https://jestjs.io/docs/mock-function-api)

## Globales

Puede simular variables globales que no están presentes con `jsdom` o `node` usando el ayudante [`vi.stubGlobal`](https://vitest.dev/api/#vi-stubglobal). Pondrá el valor de la variable global en un objeto `globalThis`.

```js
import { vi } from 'vitest'

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// now you can access it as `IntersectionObserver` or `window.IntersectionObserver`
```

## Módulos

Los módulos simulados observan bibliotecas de terceros, que se invocan en algún otro código, lo que le permite probar argumentos, producir o incluso volver a declarar su implementación.

Consulte la [**sección api** `vi.mock()`](https://vitest.dev/api/#vi-mock) para obtener una descripción más detallada de la API.

## Algoritmo de simulación automática

Si su código está importando un módulo simulado, sin ningún archivo `__mocks__` asociado o fábrica para este módulo, Vitest se burlará del módulo invocándolo y burlándose de cada exportación.

Los siguientes principios se aplican

- Todas las matrices se vaciarán
- Todas las primitivas y colecciones permanecerán igual.
- Todos los objetos serán profundamente clonados.
- Todas las instancias de clases y sus prototipos se clonarán profundamente.

**Ejemplo**

```js
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from 'pg'
import { failure, success } from './handlers'

// handlers
export function success(data) {}
export function failure(data) {}

// get todos
export const getTodos = async (event, context) => {
  const client = new Client({
    // ...clientOptions
  })

  await client.connect()

  try {
    const result = await client.query('SELECT * FROM todos;')

    client.end()

    return success({
      message: `${result.rowCount} item(s) returned`,
      data: result.rows,
      status: true,
    })
  }
  catch (e) {
    console.error(e.stack)

    client.end()

    return failure({ message: e, status: false })
  }
}

vi.mock('pg', () => {
  const Client = vi.fn()
  Client.prototype.connect = vi.fn()
  Client.prototype.query = vi.fn()
  Client.prototype.end = vi.fn()

  return { Client }
})

vi.mock('./handlers', () => {
  return {
    success: vi.fn(),
    failure: vi.fn(),
  }
})

describe('get a list of todo items', () => {
  let client

  beforeEach(() => {
    client = new Client()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return items successfully', async () => {
    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await getTodos()

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith('SELECT * FROM todos;')
    expect(client.end).toBeCalledTimes(1)

    expect(success).toBeCalledWith({
      message: '0 item(s) returned',
      data: [],
      status: true,
    })
  })

  it('should throw an error', async () => {
    const mError = new Error('Unable to retrieve rows')
    client.query.mockRejectedValueOnce(mError)

    await getTodos()

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith('SELECT * FROM todos;')
    expect(client.end).toBeCalledTimes(1)
    expect(failure).toBeCalledWith({ message: mError, status: false })
  })
})
```

## Peticiones

Debido a que Vitest se ejecuta en Node, simular solicitudes de red es complicado; Las API web no están disponibles, por lo que necesitamos algo que imite el comportamiento de la red para nosotros. Recomendamos [Mock Service Worker](https://mswjs.io/) para lograr esto. Le permitirá burlarse de las solicitudes de red `REST` y `GraphQL`, y es independiente del marco.

Mock Service Worker (MSW) funciona al interceptar las solicitudes que realizan sus pruebas, lo que le permite usarlo sin cambiar el código de su aplicación. En el navegador, esto utiliza la [API de Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API). En Node.js, y para Vitest, usa [node-request-interceptor](https://mswjs.io/docs/api/setup-server#operation). Para obtener más información sobre RSU, lea su [introducción](https://mswjs.io/docs/).

## Configuración

Agregue lo siguiente a su archivo de [configuración de prueba](https://vitest.dev/config/#setupfiles).

```js
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { graphql, rest } from 'msw'

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
]

export const restHandlers = [
  rest.get('https://rest-endpoint.example/path/to/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts))
  }),
]

const graphqlHandlers = [
  graphql.query('https://graphql-endpoint.example/api/v1/posts', (req, res, ctx) => {
    return res(ctx.data(posts))
  }),
]

const server = setupServer(...restHandlers, ...graphqlHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
```

>Configurar el servidor con `onUnhandleRequest: 'error'` asegura que se arroje un error cada vez que haya una solicitud que no tenga un controlador de solicitud correspondiente.

**Ejemplo**

Tenemos un ejemplo de trabajo completo que usa MSW: [React Testing with MSW](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib-msw).

**Más**

Hay mucho más en RSU. Puede acceder a cookies y parámetros de consulta, definir respuestas de error simuladas y mucho más. Para ver todo lo que puede hacer con MSW, [lea su documentación](https://mswjs.io/docs/recipes).

## Temporizadores

Cada vez que probamos código que implica tiempos de espera o intervalos, en lugar de que nuestras pruebas esperen o se agoten. Podemos acelerar nuestras pruebas usando temporizadores "falsos" simulando llamadas a `setTimeout` y `setInterval` también.

Consulte la [**sección api** `vi.mock()`](https://vitest.dev/api/#vi-usefaketimer) para obtener una descripción más detallada de la API.

**Ejemplo**

```js
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const executeAfterTwoHours = (func) => {
  setTimeout(func, 1000 * 60 * 60 * 2) // 2 hours
}

const executeEveryMinute = (func) => {
  setInterval(func, 1000 * 60) // 1 minute
}

const mock = vi.fn(() => console.log('executed'))

describe('delayed execution', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should execute the function', () => {
    executeAfterTwoHours(mock)
    vi.runAllTimers()
    expect(mock).toHaveBeenCalledTimes(1)
  })
  it('should not execute the function', () => {
    executeAfterTwoHours(mock)
    // advancing by 2ms won't trigger the func
    vi.advanceTimersByTime(2)
    expect(mock).not.toHaveBeenCalled()
  })
  it('should execute every minute', () => {
    executeEveryMinute(mock)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(1)
    vi.advanceTimersToNextTimer()
    expect(mock).toHaveBeenCalledTimes(2)
  })
})
```

