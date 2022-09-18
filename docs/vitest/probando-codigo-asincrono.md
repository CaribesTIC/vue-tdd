# Probando Código Asíncrono

>Es común en JavaScript que el código se ejecute de forma asíncrona.

Cuando tiene un código que se ejecuta de forma asíncrona, Vitest necesita saber cuándo se ha completado el código que está probando, antes de poder pasar a otra prueba. Vitest tiene varias formas de manejar esto.

## Callback

El patrón asincrónico más común son las devoluciones de llamada.

Supongamos que en nuestro _Servicio de Api_ tenemos una función `fetchData(callback)` que obtiene algunos datos y llama a `callback(data)` cuando se completa. Deseamos probar que estos datos devueltos son la cadena `'peanut butter'`.

Ejemplo: `src/apiService/fetchData.js` :

```js
export default function (callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback("peanut butter");
  }, 1000);
}
```

De forma predeterminada, las pruebas se completan una vez que llegan al final de su ejecución. Eso significa que esta prueba no funcionará según lo previsto:

```js
import fetchData from '@/apiService/fetchData';
// Don't do this!
test('the data is peanut butter', () => {
  function callback(data) {
    expect(data).toBe('peanut butter');
  }

  fetchData(callback);
});
```
El problema es que la prueba se completará tan pronto como se complete `fetchData`, antes de llamar a la devolución de llamada.

Hay una forma alternativa de prueba que soluciona esto. En lugar de poner la prueba en una función con un argumento vacío, usa un solo argumento llamado `done`. Así se esperará hasta que se llame el callback `done` antes de terminar la prueba.

```js
import fetchData from '@/apiService/fetchData';

test('the data is peanut butter', async done => {
  function callback(data) {
    try {      
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
}, 30000);

```
Si nunca se llama a `done()`, la prueba fallará (con un error de tiempo de espera), que es lo que desea que suceda.

Si la declaración de `expect` falla, arroja un error y no se llama a `done()`. Si queremos ver en el registro de prueba porqué falló, tenemos que envolver `expect` en un bloque `try` y pasar el error en el bloque `catch` a `done`. De lo contrario, terminaremos con un error de tiempo de espera opaco que no muestra qué valor recibió `expect(data)`.

>**Nota:** `done()` no debe mezclarse con [Promise](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise), ya que esto tiende a provocar pérdidas de memoria en las pruebas.

## Promise

Si su código usa [Promise](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise), hay una forma más sencilla de manejar las pruebas asincrónicas. 

>Devuelve una promesa de tu prueba y se esperará a que se resuelva esa promesa. Si se rechaza la promesa, la prueba fallará automáticamente.

Por ejemplo, digamos que `fetchData`, en lugar de usar una devolución de llamada, devuelve una promesa que se supone que debe resolverse en la cadena `'peanut butter'`. 

Supongamos que en nuestro _Servicio de Api_ - del archivo `src/apiService/fetchData.js` - llamamos a la siguiente función:
```js
export default function (req = true) {
  return new Promise((resolve, reject) => {
    console.log('Ready....go!');
    setTimeout(function(){
      console.log("Time's up -- stop!");
      req
        ? resolve("peanut butter")
        : reject("error");      
    }, 1000);
  })
};
```
>**Nota:** Tomemos en cuenta que para el llamado del código anterior usaremos el argumento `req` con el valor `true` de manera predeterminada para que la promesa sea exitosa (`resolve`). De otro modo, cuando queramos que la prueba falle (`reject`) le pasaremos el valor `false`.

Podríamos probarlo con:
```js
import fetchData from '@/apiService/fetchData';

test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```
Asegúrese de devolver la promesa: si omite esta declaración de `return`, su prueba se completará antes de que se resuelva la promesa retornada por `fetchData` y `then()` tenga la oportunidad de ejecutar la devolución de llamada.

Si espera que se rechace una promesa, use el método `.catch`. Asegúrese de agregar `expect.assertions` para verificar que se llame a un cierto número de afirmaciones. De lo contrario, una promesa cumplida no fallaría la prueba.

```js
import fetchData from '@/apiService/fetchData';

test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData(false).catch(e => expect(e).toMatch('error'));
});
```

## .resolves / .rejects

También puede usar el comparador `.resolves` en su declaración de expectativa, y se esperará a que se resuelva esa promesa. Si se rechaza la promesa, la prueba fallará automáticamente.
```js
import fetchData from '@/apiService/fetchData';

test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});

// or

test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toMatch('peanut butter');
});
```

Asegúrese de retornar la afirmación: si omite esta declaración de retorno, su prueba se completará antes de que se resuelva la promesa devuelta por `fetchData` y `then()` tenga la oportunidad de ejecutar la devolución de llamada.

Si espera que se rechace una promesa, use el comparador `.rejects`. Funciona de forma análoga al comparador `.resolves`. Si se cumple la promesa, la prueba fallará automáticamente.
```js
import fetchData from '@/apiService/fetchData';

test('the fetch fails with an error', () => {
  return expect(fetchData(false)).rejects.toBe('error');
});

// or

test('the fetch fails with an error', () => {
  return expect(fetchData(false)).rejects.toMatch('error');
});
```

## Async/Await

Alternativamente, puede usar `async` y `await` en sus pruebas. Para escribir una prueba asíncrona, use la palabra clave `async` delante de la función que se pasó a prueba. Por ejemplo, el mismo escenario de `fetchData` se puede probar con:

```js
import fetchData from '@/apiService/fetchData';

test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData(false);
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```
Puede combinar `async` y `await` con `.resolves` o `.rejects`.

```js
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toMatch('peanut butter');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData(false)).rejects.toBe('error');
});

test('the fetch fails with an error', async () => {
  await expect(fetchData(false)).rejects.toMatch('error');
});
```
En estos casos, `async` y `await` son efectivamente azúcar sintáctico para la misma lógica que usa el ejemplo de Promise.

:::warning PRECAUCIÓN
Asegúrese de devolver (`return`) o esperar (`await`) la promesa - si omite la declaración de `return`/`await`, su prueba se completará antes de que la promesa devuelta por `fetchData` se resuelva o rechace.
:::

Ninguno de estas formas es particularmente superior a las demás, y puede mezclarlos y combinarlos en una base de código o incluso en un solo archivo. Solo depende del estilo que sienta que hace que sus pruebas sean más simples.
