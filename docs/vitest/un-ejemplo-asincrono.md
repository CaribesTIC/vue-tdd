# Un Ejemplo Asíncrono

Implementemos un módulo que obtenga datos de usuario de una API y devuelva el nombre de usuario.

📃`models/user.js`
```js
import request from '@/services/request';

export function getUserName(userID) {
  return request(`/users/${userID}`).then(user => user.name);
}
```

En la implementación anterior, esperamos que el módulo `request.js` devuelva una promesa. Encadenamos una llamada a `then` para recibir el nombre de usuario.

Ahora imagine una implementación de `request.js` que va a la red y obtiene algunos datos del usuario:

📃`services/request.js`
```js 
import http from 'http'

export default function request(url) {
  return new Promise(resolve => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in 'services/__mocks__/request.js'
    http.get({path: url}, response => {
      let data = '';
      response.on('data', _data => (data += _data));
      response.on('end', () => resolve(data));
    });
  });
}
```

Debido a que no queremos ir a la red en nuestra prueba, vamos a crear una simulación manual para nuestro módulo `request.js` en la carpeta `__mocks__` (la carpeta distingue entre mayúsculas y minúsculas, `__MOCKS__` no funcionará). Podría verse algo como esto:

📃`services/__mocks__/request.js`
```js
const users = {
  4: {name: 'Mark'},
  5: {name: 'Paul'},
};

export default function request(url) {
  return new Promise((resolve, reject) => {
    const userID = parseInt(url.substr('/users/'.length), 10);
    process.nextTick(() =>
      users[userID]
        ? resolve(users[userID])
        : reject({
            error: `User with ${userID} not found.`,
          }),
    );
  });
}
```

Ahora escribamos una prueba para nuestra funcionalidad asíncrona.

📃`tests/models/user.spec.js`
```js
vi.mock('@/services/request');
import * as user from '@/models/user';

// The assertion for a promise must be returned.
it('works with promises', () => {
  expect.assertions(1);
  return user.getUserName(4).then(data => expect(data).toEqual('Mark'));  
});
```

Llamamos a `vi.mock('@/services/request')` para decirle a Vitest que use nuestro simulacro manual. `it` espera que el valor de retorno sea una _**Promise**_ que se va a resolver. Puede encadenar tantas _**Promises**_ como desee y llamar a `expect` en cualquier momento, siempre que devuelva una _**Promise**_ al final.

## `.resolves`

Hay una forma menos detallada de usar `resolves` para desenvolver el valor de una promesa cumplida junto con cualquier otro comparador. Si la promesa es rechazada, la afirmación fallará.

```js
it('works with resolves', () => {  
  expect.assertions(1);
  return expect(user.getUserName(5)).resolves.toEqual('Paul');
});
```

## `async`/`await`
También es posible escribir pruebas utilizando la sintaxis `async`/`await`. Así es como escribirías los mismos ejemplos de antes:

```js
// async/await can be used.
it('works with async/await', async () => {
  expect.assertions(1);
  const data = await user.getUserName(4);
  expect(data).toEqual('Mark');
});

// async/await can also be used with `.resolves`.
it('works with async/await and resolves', async () => {
  expect.assertions(1);
  await expect(user.getUserName(5)).resolves.toEqual('Paul');
});
```

## Manejo de errores

Los errores se pueden manejar usando el método `.catch`. Asegúrese de agregar `expect.assertions` para verificar que se llame a un cierto número de afirmaciones. De lo contrario, una promesa cumplida no fallaría la prueba:

```js
// Testing for async errors using Promise.catch.
it('tests error with promises', () => {
  expect.assertions(1);
  return user.getUserName(2).catch(e =>
    expect(e).toEqual({
      error: 'User with 2 not found.',
    }),
  );
});

// Or using async/await.
it('tests error with async/await', async () => {
  expect.assertions(1);
  try {
    await user.getUserName(1);
  } catch (e) {
    expect(e).toEqual({
      error: 'User with 1 not found.',
    });
  }
});
```

## `.rejects`

El ayudante .`rejects` funciona como el ayudante `.resolves`. Si se cumple la promesa, la prueba fallará automáticamente. `expect.assertions(number)` no es necesario, pero se recomienda para verificar que se llama a un cierto número de [afirmaciones](https://vitest.dev/api/#expect-assertions) durante una prueba. De lo contrario, es fácil olvidar a `return`/`await` las afirmaciones `.resolves`.

```js
// Testing for async errors using `.rejects`.
it('tests error with rejects', () => {
  expect.assertions(1);
  return expect(user.getUserName(3)).rejects.toEqual({
    error: 'User with 3 not found.',
  });
});

// Or using async/await with `.rejects`.
it('tests error with async/await and rejects', async () => {
  expect.assertions(1);
  await expect(user.getUserName(3)).rejects.toEqual({
    error: 'User with 3 not found.',
  });
});
```

El código de este ejemplo está disponible en [ejemplos/asíncronos](https://github.com/facebook/jest/tree/main/examples/async).

Si desea probar los temporizadores, como setTimeout, eche un vistazo a la documentación de las [Simulaciones de Temporizador](../vitest/simulaciones-de-temporizador.html).
