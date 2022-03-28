# Código Asíncrono

Es común en JavaScript que el código se ejecute de forma asíncrona. Cuando tiene un código que se ejecuta de forma asíncrona, Vitest necesita saber cuándo se ha completado el código que está probando, antes de poder pasar a otra prueba. Vitest tiene varias formas de manejar esto.

## Devoluciones de llamada

El patrón asincrónico más común son las devoluciones de llamada.

Por ejemplo, supongamos que tiene una función `fetchData(callback)` que obtiene algunos datos y llama a `callback(data)` cuando se completa. Desea probar que estos datos devueltos son la cadena `'peanut butter'`.

Supongamos que la función `src/js/fetchData.js` consiste en el siguiente código:

```js
export default function (callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback("peanut butter");
  }, 1000);
}
```

De forma predeterminada, las pruebas de se completan una vez que llegan al final de su ejecución. Eso significa que esta prueba no funcionará según lo previsto:

```js
import fetchData from '@/js/fetchData';
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
import fetchData from '@/js/jest/callback/fetchData';

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

Si la declaración de `expect` falla, arroja un error y no se llama a `done()`. Si queremos ver en el registro de prueba por qué falló, tenemos que envolver `expect` en un bloque `try` y pasar el error en el bloque `catch` a `done`. De lo contrario, terminaremos con un error de tiempo de espera opaco que no muestra qué valor recibió `expect(data)`.

Nota: `done()` no debe mezclarse con Promesas, ya que esto tiende a provocar pérdidas de memoria en las pruebas.

## Promises
