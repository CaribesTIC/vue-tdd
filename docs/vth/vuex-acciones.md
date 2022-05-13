# Vuex Acciones

## Probando Acciones

Probar acciones de forma aislada es muy sencillo. Es muy similar a probar mutaciones de forma aislada; consulte [aquí](../vth/vuex-mutaciones) para obtener más información sobre las pruebas de mutaciones. Probar acciones en el contexto de un componente es discutida correctamente [aquí](../vth/probando-vuex-en-componentes-mutaciones-y-acciones).

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/actions.spec.js).

## Creando la Acción

Escribiremos una acción que siga un patrón Vuex común:

1. Hacer una llamada asíncrona a una API
1. Hacer algún procesamiento en los datos (opcional)
1. Cometer una mutación con el resultado como carga útil

Esta es una acción de `authenticate`, que envía un nombre de usuario y una contraseña a una API externa para verificar si coinciden. Luego, el resultado se usa para actualizar el estado al realizar una mutación `SET_AUTHENTICATED` con el resultado como carga útil.

```js
import axios from "axios"

export default {
  async authenticate({ commit }, { username, password }) {
    const authenticated = await axios.post("/api/authenticate", {
      username, password
    })

    commit("SET_AUTHENTICATED", authenticated)
  }
}
```

La prueba de acción debe afirmar:

1. ¿Se utilizó el punto final de la API correcto?
1. ¿La carga útil es correcta?
1. Fue la mutación correcta cometida con el resultado

Avancemos y escribamos la prueba, y dejemos que los mensajes de error nos guíen.

## Escribiendo la Prueba

```js
import actions from "@/store/actions.js"

describe("authenticate", () => {
  it("authenticated a user", async () => {
    const commit = vi.fn()
    const username = "alice"
    const password = "password"

    await actions.authenticate({ commit }, { username, password })

    expect(url).toBe("/api/authenticate")
    expect(body).toEqual({ username, password })
    expect(commit).toHaveBeenCalledWith(
      "SET_AUTHENTICATED", true)
  })
})
```

Dado que `axios` es asíncrono, para garantizar que Vitest espere a que finalice la prueba, debemos declararla como `async` y luego esperar la llamada a `actions.authenticate`. De lo contrario, la prueba terminará antes de la afirmación `expect` y tendremos una prueba perenne - una prueba que nunca puede fallar.

Ejecutar la prueba anterior nos da el siguiente mensaje de falla:

```
FAIL  tests/unit/actions.spec.js
  ● authenticate › authenticated a user

    SyntaxError: The string did not match the expected pattern.

      at XMLHttpRequest.open (node_modules/jsdom/lib/jsdom/living/xmlhttprequest.js:482:15)
      at dispatchXhrRequest (node_modules/axios/lib/adapters/xhr.js:45:13)
      at xhrAdapter (node_modules/axios/lib/adapters/xhr.js:12:10)
      at dispatchRequest (node_modules/axios/lib/core/dispatchRequest.js:59:10)

```

Este error proviene de algún lugar dentro de `axios`. Estamos haciendo una solicitud a `/api...`, y dado que estamos ejecutando en un entorno de prueba, ni siquiera hay un servidor para realizar una solicitud, por lo tanto, el error. Tampoco definimos la `url` o el `body` - lo haremos mientras resolvemos el error de `axios`.

Como estamos usando Vitest, podemos simular fácilmente la llamada API usando `vi.mock`. Usaremos un `axios` simulado en lugar del real, lo que nos dará más control sobre su comportamiento. Vitest proporciona [simulacros de clase ES6](https://jestjs.io/docs/es6-class-mocks), que son perfectos para simular `axios`.

El simulacro de `axios` se ve así:

```js
import axios from "axios"

let url = ''
let body = {}

axios.post = vi.fn(
  (_url, _body) => { 
    return new Promise((resolve) => {
      url = _url
      body = _body
      resolve(true)
    })
  }
);
```

Guardamos la `url` y el `body` en las variables para poder afirmar que el punto final correcto está recibiendo la carga útil correcta. Dado que en realidad no queremos llegar a un punto final real, resolvemos la promesa de inmediato, lo que simula una llamada API exitosa.

¡La prueba ahora produce una aprobación!

## Prueba del Error de la API

Solo probamos el caso en el que la llamada a la API tuvo éxito. Es importante probar todos los resultados posibles. Escribamos una prueba para el caso en que ocurra un error. Esta vez, primero escribiremos la prueba, seguida de la implementación.

La prueba se puede escribir así:

```js
it("catches an error", async () => {
  let mockError = true

  await expect(actions.authenticate({ commit: vi.fn() }, {}))
    .rejects.toThrow("API Error occurred.")
})
```

Necesitamos encontrar una manera de forzar el simulacro de `axios` para que arroje un error. Para eso está la variable `mockError`. Actualice el simulacro de `axios` de esta manera:

```js{10,11,12}
import axios from "axios"

let url = ''
let body = {}
let mockError = false

axios.post = vi.fn(
  (_url, _body) => { 
    return new Promise((resolve) => {
      if (mockError) 
        throw Error()

      url = _url
      body = _body
      resolve(true)
    })
  }
);
```

Vitest solo permitirá acceder a una variable fuera del alcance en un simulacro de clase ES6 si el nombre de la variable está precedido por `mock`. Ahora podemos simplemente hacer `mockError = true` y `axios` arrojará un error.

Ejecutar esta prueba nos da este error fallido:

```
FAIL  tests/unit/actions.spec.js
● authenticate › catchs an error

  expect(function).toThrow(string)

  Expected the function to throw an error matching:
    "API Error occurred."
  Instead, it threw:
    Mock error
```

Detectó con éxito un error... pero no el que esperábamos. Actualice `authenticate` para arrojar el error que espera la prueba:

```js
import axios from "axios"

export default {
  async authenticate({ commit }, { username, password }) {
    try {
      const authenticated = await axios.post("/api/authenticate", {
        username, password
      })

      commit("SET_AUTHENTICATED", authenticated)
    } catch (e) {
      throw Error("API Error occurred.")
    }
  }
}
```

Ahora la prueba está pasando. Aquí el ejemplo completo:

```js
import actions from "@/store/actions.js"
import axios from "axios"

let url = ''
let body = {}
let mockError = false

axios.post = vi.fn(
  (_url, _body) => { 
    return new Promise((resolve) => {
      if (mockError) 
        throw Error()

      url = _url
      body = _body
      resolve(true)
    })
  }
);

describe("authenticate", () => {
  it("authenticated a user", async () => {
    const commit = vi.fn()   
    
    const username = "alice"
    const password = "password"

    await actions.authenticate({ commit }, { username, password })

    expect(url).toBe("/api/authenticate")
    expect(body).toEqual({ username, password })
    expect(commit).toHaveBeenCalledWith(
      "SET_AUTHENTICATED", true)
  })
  
  it("catches an error", async () => {
    mockError = true

    await expect(actions.authenticate({ commit: vi.fn() }, {}))
      .rejects.toThrow("API Error occurred.")
  })

})
```

## Mejoras

Ahora ya sabe cómo probar acciones de forma aislada. Hay al menos una mejora potencial que se puede hacer, que es implementar el simulacro de `axios` como un [simulacro manual](https://jestjs.io/docs/manual-mocks). Esto implica crear un directorio `__mocks__` en el mismo nivel que `node_modules` e implementar el módulo simulado allí. Al hacer esto, puede compartir la implementación simulada en todas sus pruebas. Vitest usará automáticamente una implementación simulada de `__mocks__`. Hay muchos ejemplos en el sitio web de Vitest y en Internet sobre cómo hacerlo. La refactorización de esta prueba para usar un simulacro manual se deja como ejercicio para el lector.

## Conclusión

Esta guía discutió:

- Usando simulacros de clase Vitest ES6
- Probando los casos de éxito y fracaso de una acción

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app/tests/unit/actions.spec.js).
