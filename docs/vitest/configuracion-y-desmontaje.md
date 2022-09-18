# Configuración y Desmontaje

>A menudo, mientras escribe las pruebas, tiene que realizar algún trabajo de configuración antes de que se ejecuten las pruebas, y tiene que realizar algún trabajo de finalización después de que se ejecuten las pruebas. Existen funciones auxiliares para manejar esto.

## Configuración Repetida Para Muchas Pruebas

Si tiene algún trabajo que debe hacer repetidamente para muchas pruebas, puede usar `beforeEach` y `afterEach`.

Por ejemplo, digamos que varias pruebas interactúan con una base de datos de ciudades. También tiene un método `initializeCityDatabase()` que debe llamarse antes de cada una de estas pruebas y un método `clearCityDatabase()` que debe llamarse después de cada una de estas pruebas. Supongamos que dichos métodos están en el siguiente módulo `src/models/City.js`:

```js
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('Initializing the city database ...');
    setTimeout(
      () => console.log("Initialized the City database !!!"),
      1000
    );
  })
};

export const clearDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('Clearing City Database ...');
    setTimeout(
      () => console.log("Clearing City Database ...!"),
      1000
    );
  })
};

export const isIt = req => {
  return new Promise((resolve, reject) => {
    console.log('Ready....go!');
    setTimeout(() => {
      console.log("Time's up -- stop!");
      return req === 'Vienna'
    }, 1000);
  })
};
```

Puedes hacer esto con:

```js
import * as City from '@/models/City';

beforeEach(() => {
  City.initializeDatabase();
});

afterEach(() => {
  City.clearDatabase();
});

test('city database has Vienna', () => {
  expect(City.isIt('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(City.isIt('San Juan')).toBeTruthy();
});
```

`beforeEach` y `afterEach` pueden manejar código asíncrono de la misma manera que [las pruebas pueden manejar código asíncrono](../vitest/probando-codigo-asincrono.html) - pueden tomar un parámetro `done` o devolver una promesa. Por ejemplo, si `initializeCityDatabase()` devolvió una promesa que se resolvió cuando se inicializó la base de datos, nos gustaría devolver esa promesa:

```js
beforeEach(() => {
  return City.initializeDatabase();
});
```

## Configurar Una-Vez

En algunos casos, solo necesita realizar la configuración una vez, al principio de un archivo. Esto puede ser especialmente molesto cuando la configuración es asíncrona, por lo que no puede hacerlo en línea. Existe `beforeAll` y `afterAll` para manejar esta situación.

```js
import * as City from '@/models/City';

beforeAll(() => {
  City.initializeDatabase();
});

afterAll(() => {
  City.clearDatabase();
});

test('city database has Vienna', () => {
  expect(City.isIt('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(City.isIt('San Juan')).toBeTruthy();
});
```

## Alcance

De forma predeterminada, los bloques `beforeAll` y `afterAll` se aplican a todas las pruebas de un archivo. También puede agrupar pruebas usando un bloque de `describe`. Cuando están dentro de un bloque de `describe`, los bloques `beforeAll` y `afterAll` solo se aplican a las pruebas dentro de ese bloque de `describe`.

Por ejemplo, podríamos hacer diferentes configuraciones para diferentes pruebas:

```js
import * as City from '@/models/City';

describe('matching cities with each', () => {
  beforeEach(() => {
    City.initializeDatabase();
  });

  afterEach(() => {
    City.clearDatabase();
  });

  test('city database has Vienna', () => {
    expect(City.isIt('Vienna')).toBeTruthy();
  });

  test('city database has San Juan', () => {
    expect(City.isIt('San Juan')).toBeTruthy();
  });
});

describe('matching cities with all', () => {
  beforeAll(() => {
    City.initializeDatabase();
  });

  afterAll(() => {
    City.clearDatabase();
  });

  test('city database has Vienna', () => {
    expect(City.isIt('Vienna')).toBeTruthy();
  });

  test('city database has San Juan', () => {
    expect(City.isIt('San Juan')).toBeTruthy();
  });
});
```
Tenga en cuenta que `beforeEach` de nivel superior se ejecuta antes de `beforeEach` dentro del bloque de `describe`.

Puede ser útil ilustrar el orden de ejecución de todos los ganchos.

```js
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 1 - beforeEach
// 2 - beforeEach 
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - beforeAll
// 2 - afterAll 
// 1 - afterAll
```

## Orden de ejecución de los bloques describe y test

Se ejecutan todos los manejadores `describe` en un archivo de prueba _antes_ de ejecutar cualquiera de las pruebas reales. Esta es otra razón para realizar la configuración y el desmontaje dentro de los controladores `before*` y `after*` en lugar de dentro de los bloques `describe`. Una vez que se completan los bloques `describe`, de forma predeterminada, se ejecutan todas las pruebas en serie en el orden en que se encontraron en la fase de recopilación, esperando que cada una termine y se ordene antes de continuar.

Considere el siguiente archivo de prueba ilustrativo y salida:

```js

describe('outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');
    test('test 1', () => {
      console.log('test for describe inner 1');
      expect(true).toEqual(true);
    });
  });

  console.log('describe outer-b');

  test('test 1', () => {
    console.log('test for describe outer');
    expect(true).toEqual(true);
  });

  describe('describe inner 2', () => {
    console.log('describe inner 2');
    test('test for describe inner 2', () => {
      console.log('test for describe inner 2');
      expect(false).toEqual(false);
    });
  });

  console.log('describe outer-c');
});

// describe outer-a
// describe outer-b
// describe outer-c
// describe inner 1
// describe inner 2
// test for describe inner 1
// test for describe outer
// test for describe inner 2
```
## Consejos Generales

Si una prueba falla, una de las primeras cosas que debe verificar es si la prueba falla cuando es la única prueba que se ejecuta. Para ejecutar solo una prueba, cambie temporalmente ese comando de prueba a `test.only`:

```js
test.only('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});
```

Si tiene una prueba que a menudo falla cuando se ejecuta como parte de una suite más grande, pero no falla cuando la ejecuta solo, es una buena apuesta que algo de una prueba diferente esté interfiriendo con esta. A menudo, puede solucionar esto borrando algún estado compartido con `beforeEach`. Si no está seguro de si se está modificando algún estado compartido, también puede probar un `beforeEach` que registra datos.
