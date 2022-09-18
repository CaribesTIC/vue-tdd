# Filtrado de Pruebas

>Filtrado, tiempos de espera, concurrente para suite y pruebas.

## CLI

Puede usar CLI para filtrar archivos de prueba por nombre:

```bash
$ vitest basic
```

Solo ejecutará archivos de prueba que contengan `basic`, ejemplo.

```bash
basic.test.ts
basic-foo.test.ts
```

## Especificación de un Timeout

Opcionalmente, puede pasar un tiempo de espera en milisegundos como tercer argumento para las pruebas. El valor predeterminado es 5 segundos.

```js
import { test } from 'vitest'

test('name', async () => { /* ... */ }, 1000)
```

Los ganchos también pueden recibir un tiempo de espera, con el mismo valor predeterminado de 5 segundos.

```js
import { beforeAll } from 'vitest'

beforeAll(async () => { /* ... */ }, 1000)
```

## Saltarse suites y pruebas

Use `.skip` para evitar ejecutar ciertas suites o pruebas

```js
import { assert, describe, it } from 'vitest'

describe.skip('skipped suite', () => {
  it('test', () => {
    // Suite skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('suite', () => {
  it.skip('skipped test', () => {
    // Test skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
})
```

## Selección de suites y pruebas para ejecutar

Use `.only` para ejecutar solo ciertas suites o pruebas

```js
import { assert, describe, it } from 'vitest'

// Only this suite (and others marked with only) are run
describe.only('suite', () => {
  it('test', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('another suite', () => {
  it('skipped test', () => {
    // Test skipped, as tests are running in Only mode
    assert.equal(Math.sqrt(4), 3)
  })

  it.only('test', () => {
    // Only this test (and others marked with only) are run
    assert.equal(Math.sqrt(4), 2)
  })
})
```

## Suites y pruebas no implementadas

Use `.todo` para agregar conjuntos y pruebas que deben implementarse

```js
import { describe, it } from 'vitest'

// An entry will be shown in the report for this suite
describe.todo('unimplemented suite')

// An entry will be shown in the report for this test
describe('suite', () => {
  it.todo('unimplemented test')
})
```
