# Funciones Simuladas

Las funciones simuladas le permiten probar los vínculos entre el código borrando la implementación real de una función, capturando llamadas a la función (y los parámetros pasados en esas llamadas), capturando instancias de funciones de constructor cuando se instancian con nuevas y permitiendo la configuración en tiempo de prueba de valores de retorno.

>Hay dos formas de simular funciones: ya sea creando una función simulada para usar en el código de prueba o escribiendo una simulación manual para anular la dependencia de un módulo. Una explicación más específica de cómo hacer simulaciones manuales la podemos encontrar en la documentación oficial de [Jest](https://jestjs.io/docs/manual-mocks).

## Usando una función simulada

Imaginemos que estamos probando una implementación de una función `forEach`, que invoca una devolución de llamada para cada elemento en una matriz proporcionada.

```js
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```
Para probar esta función, podemos usar una función simulada e inspeccionar el estado del simulacro para asegurarnos de que la devolución de llamada se invoque como se esperaba.

```js
test('using a mock function', () => {
  const mockCallback = vi.fn(x => 42 + x);
  forEach([0, 1], mockCallback);

  // The mock function is called twice
  expect(mockCallback.mock.calls.length).toBe(2);

  // The first argument of the first call to the function was 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // The return value of the first call to the function was 42
  expect(mockCallback.mock.results[0].value).toBe(42);
});
```

## Propiedad `.mock`

Todas las funciones simuladas tienen esta propiedad especial `.mock`, que es donde se guardan los datos sobre cómo se llamó a la función y qué devolvió la función. La propiedad `.mock` también rastrea el valor de esto para cada llamada, por lo que también es posible inspeccionar esto:

```js
test('exploring a mock property', () => {
  const myMock = vi.fn();

  const a = new myMock();
  const b = {};
  const bound = myMock.bind(b);
  bound();

  expect(JSON.stringify(myMock.mock.instances)).toBe(JSON.stringify([{},{}]));
  // > [ <a>, <b> ]
});
```
Estos miembros simulados son muy útiles en las pruebas para afirmar cómo se llama a estas funciones, se crean instancias o lo que devuelven:

```js
test('more exploring mock properties', () => {
    const myMock = vi.fn();    
    
    const a = new myMock('first arg', 'second arg');

    // The function was called exactly once
    expect(myMock.mock.calls.length).toBe(1);

    // The first arg of the first call to the function was 'first arg'
    expect(myMock.mock.calls[0][0]).toBe('first arg');

    // The second arg of the first call to the function was 'second arg'
    expect(myMock.mock.calls[0][1]).toBe('second arg');
    
    // This function was instantiated exactly once
    expect(myMock.mock.instances.length).toBe(1);
});
```
## Valores de Retorno Simulados

Las funciones simuladas también se pueden usar para inyectar valores de prueba en su código durante una prueba:

```js
test('mock return value', () => {
    const myMock = vi.fn();

    myMock
        .mockReturnValueOnce('return value')
        .mockReturnValueOnce('return another value')
        .mockReturnValueOnce({name});    
    
    const a = myMock();
    // The return value of the first call to 
    // the function was 'return value'
    expect(myMock.mock.results[0].value)
        .toBe('return value');
    
    const b = myMock();       
    // The return value of the second call to
    // the function was 'return another value'
    expect(myMock.mock.results[1].value)
        .toBe('return another value');
    
    // This function was instantiated exactly twice
   expect(myMock.mock.instances.length).toBe(2);
   
   const c = myMock();
   c.name = 'test';   
   
   // The object returned by the first instantiation of this function
   // had a `name` property whose value was set to 'test'   
   // jest ===>>>> expect(myMock.mock.instances[0].name).toEqual('test');   
   expect(c.name).toEqual('test');
});
```
Más valores de retorno simulado

```js
test('more mock return value', () => {
    const myMock = vi.fn();
  
    const a = myMock();
    expect(myMock.mock.results[0].value).toBe(undefined);

    myMock
        .mockReturnValueOnce(10)
        .mockReturnValueOnce('x')
        .mockReturnValue(true);
    
    const b = myMock();
    expect(myMock.mock.results[1].value).toBe(10);

    const c = myMock();
    expect(myMock.mock.results[2].value).toBe('x');

    const d = myMock();
    expect(myMock.mock.results[3].value).toBe(true);

    const e = myMock();
    expect(myMock.mock.results[3].value).toBe(true);
});
```
Las funciones simuladas también son muy efectivas en el código que usa un estilo funcional de paso de continuación. El código escrito en este estilo ayuda a evitar la necesidad de _**stubs**_ complicados que recrean el comportamiento del componente real que representan, a favor de inyectar valores directamente en la prueba justo antes de que se usen.

```js
test('mock filter', () => {    
    const filterTestFn = vi.fn();

    // Make the mock return `true` for the first call,
    // and `false` for the second call
    filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = [11, 12].filter(num => filterTestFn(num));

    //console.log(result); // > [11]
    expect(result).toEqual([11]);
    
    //console.log(filterTestFn.mock.calls[0][0]); // 11
    expect(filterTestFn.mock.calls[0][0]).toBe(11);
    
    //console.log(filterTestFn.mock.calls[1][0]); // 12
    expect(filterTestFn.mock.calls[1][0]).toBe(12);    
});
```
La mayoría de los ejemplos del mundo real en realidad implican obtener una función simulada en un componente dependiente y configurarlo, pero la técnica es la misma. En estos casos, trate de evitar la tentación de implementar la lógica dentro de cualquier función que no se esté probando directamente.

## Módulos Simulados

Supongamos que tenemos una clase que obtiene usuarios de nuestra API. La clase usa axios para llamar a la API y luego devuelve el atributo de datos que contiene a todos los usuarios:

`models/Users.js`

```js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;
```
Ahora, para probar este método sin tocar la API (y, por lo tanto, crear pruebas lentas y frágiles), podemos usar la función `vi.mock(...)` para simular automáticamente el módulo axios.

Una vez que simulamos el módulo, podemos proporcionar un `mockResolvedValue` para `.get` que devuelve los datos contra los que queremos que se afirme nuestra prueba. En efecto, estamos diciendo que queremos que `axios.get('/users.json')` devuelva una respuesta falsificada.

`users.test.js`
```js
import axios from 'axios';
import Users from '@/models/Users';

//vi.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  //axios.get.mockResolvedValue(resp);
  axios.get = vi.fn().mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get = vi.fn().mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

## Simulaciones Parciales

Los subconjuntos de un módulo se pueden simular y el resto del módulo puede mantener su implementación real:

`foo-bar-baz.js`
```js
export const foo = 'foo';
export const bar = () => 'bar';
export default () => 'baz';
```

`test.js`
```js
import defaultExport, {bar, foo} from '@/foo-bar-baz';

vi.mock('@/foo-bar-baz', async () => {
  //const originalModule = jest.requireActual('../foo-bar-baz');
  const originalModule = vi.importActual('@/foo-bar-baz');

  //Mock the default export and named export 'foo'
  
  return {
    __esModule: true,
    //... originalModule,
    ... await originalModule,
    default: vi.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});

test('should do a partial mock', () => {

  const defaultExportResult = defaultExport();
  expect(defaultExportResult).toBe('mocked baz');
  expect(defaultExport).toHaveBeenCalled();

  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar');
});
```
## Implementaciones Simuladas

Aún así, hay casos en los que es útil ir más allá de la capacidad de especificar valores de retorno y reemplazar completamente la implementación de una función simulada. Esto se puede hacer con `vi.fn` o el método `mockImplementationOnce` en funciones simuladas.

```js
test('mock simulation implementations', () => {
  const myMockFn = vi.fn(cb => cb(null, true));  

  expect(myMockFn((err, val) => val)).toBe(true);
});
```
El método `mockImplementation` es útil cuando necesita definir la implementación predeterminada de una función simulada que se crea a partir de otro módulo:

`foo.js`
```js
export default function () {
  // some implementation;
};
```

`test.js`
```js
import foo from '@/foo';

test('foo is a mock function', () => {
  vi.mock('@/foo'); // this happens automatically with automocking    

  // foo is a mock function
  foo.mockImplementation(() => 42);
  
  expect(foo()).toBe(42);
});
```
Cuando necesite recrear un comportamiento complejo de una función simulada de modo que varias llamadas a funciones produzcan resultados diferentes, use el método `mockImplementationOnce`:

```js
test('mock implementation once', () => {
  const myMockFn = vi
    .fn()
    .mockImplementationOnce(cb => cb(null, true))
    .mockImplementationOnce(cb => cb(null, false));
  
  expect(myMockFn((err, val) => val)).toBe(true);
  expect(myMockFn((err, val) => val)).toBe(false);
});
```

Cuando la función simulada se queda sin implementaciones definidas con `mockImplementationOnce`, ejecutará la implementación predeterminada establecida con `vi.fn` (si está definida):

```js
test('mocked function it will execute the default', () => {
    const myMockFn = vi
      .fn(() => 'default')
      .mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call');

    expect(myMockFn()).toBe('first call');
    expect(myMockFn()).toBe('second call');
    expect(myMockFn()).toBe('default');
    expect(myMockFn()).toBe('default');
});
```
Para los casos en los que tenemos métodos que normalmente están encadenados (y, por lo tanto, siempre necesitamos devolver `this`), tenemos una API azucarada para simplificar esto en forma de una función `.mockReturnThis()` que también se encuentra en todos las simulaciones:

```js
test('mock return this', () => {
  const myObj = {
    myMethod: vi.fn().mockReturnThis(),
  };

  // is the same as

  const otherObj = {
    myMethod: vi.fn(function () {
      return this;
    })
  };

  expect(JSON.stringify(myObj)).toEqual(JSON.stringify(otherObj));
});
```
## Nombres Simulados

Opcionalmente, puede proporcionar un nombre para sus funciones simuladas, que se mostrarán en lugar de "vi.fn()" en la salida de error de prueba. Use esto si desea poder identificar rápidamente la función simulada que informa un error en su salida de prueba.

```js
test('make fun of names', () => {
  const myMockFn = vi
    .fn()
    .mockReturnValue('default')
    //.mockImplementation(scalar => 42 + scalar)
    .mockImplementationOnce(scalar => 42 + scalar)
    .mockName('add42');
  
  myMockFn(2);    
  expect(myMockFn.mock.results[0].value).toBe(44);
  expect(myMockFn.getMockName()).toBe('add42');
    
  myMockFn();    
  expect(myMockFn.mock.results[1].value);
  expect(myMockFn.getMockName()).toBe('add42');
});
```

## Comparadores Personalizados

Finalmente, para que sea menos exigente afirmar cómo se han llamado las funciones simuladas, se han agregado algunas funciones de comparación personalizadas:

```js
test('custom matcher functions', () => {
  const mockFunc = vi.fn();  

  mockFunc("arg1", "arg2");
  expect(mockFunc).toHaveBeenCalled();

  // The mock function was called at least once with the specified args
  expect(mockFunc).toHaveBeenCalledWith("arg1", "arg2");

   mockFunc("arg3", "arg4");
  // The last call to the mock function was called with the specified args
  expect(mockFunc).toHaveBeenLastCalledWith("arg3", "arg4");

  // All calls and the name of the mock is written as a snapshot 
  //expect(mockFunc).toMatchSnapshot();
    /*Snapshots  1 obsolete
            ↳ test/commonMatchers.test.js
              · mock simulation implementations 1*/ 
});
```
Estos comparadores son azúcar para las formas comunes de inspeccionar la propiedad `.mock`. Siempre puede hacerlo manualmente usted mismo si le gusta más o si necesita hacer algo más específico:

```js
test('do this manually whithout sugar', () => {
  const mockFunc = vi.fn().mockName('a mock name');  

  mockFunc("arg1", "arg2");
  // The mock function was called at least once
  expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

  // The mock function was called at least once with the specified args
  expect(mockFunc.mock.calls).toContainEqual(["arg1", "arg2"]);

  mockFunc("arg3", "arg4");
  // The last call to the mock function was called with the specified args
  expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual(["arg3", "arg4"]);

  // The first arg of the last call to the mock function was `42`
  // (note that there is no sugar helper for this specific of an assertion)
  mockFunc(42, 43);
  expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

  // A snapshot will check that a mock was invoked the same number of times,
  // in the same order, with the same arguments. También afirmará en el nombre.
  expect(mockFunc.mock.calls[2]).toEqual([42, 43]);
  expect(mockFunc.getMockName()).toBe('a mock name');
});
```
Para obtener una lista completa de comparadores, consulte los [documentos de referencia](https://vitest.dev/api/).
