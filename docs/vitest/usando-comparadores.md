# Usando comparadores

Los _"comparadores"_ permiten probar valores de diferentes maneras.

>Este documento presentará algunos comparadores de uso común. Para ver la lista completa, consulte la [`expect API doc`](https://vitest.dev/api/#expect).

## Comparadores comunes

La forma más sencilla de probar un valor es con igualdad exacta.

```js
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```
En este código, `expect(2 + 2)` devuelve un objeto de _"expectativa"_. Por lo general, no hará mucho con estos objetos, excepto comparar llamadas en ellos. En este código, `.toBe(4)` es el comparador. Cuando es ejecutado, realiza un seguimiento de todos los comparadores que fallan para poder imprimir mensajes de error.

`toBe` usa `Object.is` para probar la igualdad exacta. Si desea verificar el valor de un objeto, use `toEqual` en su lugar:
```js
test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});
```
`toEqual` verifica recursivamente cada campo de un objeto o arreglo.

También puede probar el opuesto de un comparador:

```js
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```
## Veracidad

En las pruebas, a veces necesita distinguir entre `undefined`, `null` y `false`, pero a veces no desea tratarlos de manera diferente. Hay ayudantes que te permiten ser explícito sobre lo que quieres.

- `toBeNull` solo coincide con `null`
- `toBeUndefined` coincide solo con `undefined`
- `toBeDefined` es lo contrario de `toBeUndefined`
- `toBeTruthy` coincide con todo lo que una instrucción `if` trata como `true`
- `toBeFalsy` coincide con cualquier cosa que una instrucción `if` trata como `false`

Por ejemplo:

```js
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```
Debe usar el comparador que corresponda con mayor precisión a lo que desea que haga su código.

## Números

La mayoría de las formas de comparar números tienen equivalentes de comparación.

```js
test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```
Para la igualdad de punto flotante, use `toBeCloseTo` en lugar de `toEqual`, porque no desea que una prueba dependa de un pequeño error de redondeo.

```js
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  //expect(value).toBe(0.3);      This won't work because of rounding error
  expect(value).toBeCloseTo(0.3); // This works.
});
```
## Cadenas

Puede comparar cadenas con expresiones regulares con `toMatch`:

```js
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
```
## Arreglos e iterables

Puede verificar si un arreglo o iterable contiene un elemento en particular usando `toContain`:

```js
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'milk',
];

test('the shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});
```

## Excepciones

Si desea probar si una función en particular arroja un error cuando se llama, use `toThrow`.

```js
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrowError();
  expect(() => compileAndroidCode()).toThrowError(Error);

  // You can also use the exact error message or a regexp
  expect(() => compileAndroidCode()).toThrowError('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrowError(/JDK/);
});
```
**Nota**: la función que arroja una excepción debe invocarse dentro de una función de ajuste - de lo contrario, la aserción `toThrow` fallará.

## Y más

Esto es solo una muestra. Para obtener una lista completa de comparadores, consulte los [documentos de referencia](https://vitest.dev/api/).

Una vez que haya aprendido acerca de los comparadores que están disponibles, un buen siguiente paso es verificar cómo [probar el código asíncrono](../vitest/probando-codigo-asincrono.html).
