# Escribir Formularios Comprobables

Puede encontrar el código fuente completo (incluidos los ejercicios) en el repositorio de GitHub en [`examples/form-validatio`](https://github.com/lmiller1990/design-patterns-for-vuejs-source-code/tree/master/examples/form-validation).

---

Los formularios son la forma principal en que un usuario ingresa información en cualquier sistema basado en la web, por lo que es importante hacerlo bien. El enfoque de esta sección estará en los formularios, específicamente en _escribir buenos formularios_.

¿Qué es exactamente una _buen formulario_?

Queremos asegurarnos de que la lógica del formulario esté desacoplada de los componentes de Vue; esto nos permitirá probar de forma aislada. También tenemos que pensar en la validación.

En las aplicaciones tradicionales renderizadas por el servidor, solo obtendría la validación después de enviar el formulario, lo que no es una gran experiencia para el usuario. Vue nos permite ofrecer una excelente experiencia de usuario al implementar una validación del lado del cliente altamente dinámica. Haremos uso de esto e implementaremos dos niveles de validación:

1. **Validación de campo**: si un usuario ingresa datos incorrectos o no válidos en un solo campo, mostraremos un error de inmediato.
2. **Validación del formulario**: el botón de envío solo debe habilitarse cuando todo el formulario se haya completado correctamente.

Finalmente, necesitamos dos tipos de pruebas. El primero es en torno a la lógica de negocio; dado algún formulario, qué campos no son válidos y cuándo se considera que el formulario está completo? El segundo tiene que ver con las interacciones: garantizar que la capa de la UI funcione correctamente y que el usuario pueda ingresar datos, ver mensajes de error y enviar el formulario si todos los campos son válidos.

## El Formulario del Paciente

Para este ejemplo, estamos creando un formulario para ingresar datos de pacientes para una aplicación de hospital. El formulario se verá así cuando se llene sin ningún error:

![the-patient-form](./img/the-patient-form-1.png)

>Formulario válido con información de depuración

Hay dos entradas. El primero es el `name` del paciente, que es obligatorio y puede ser cualquier texto. El segundo es el `weight` del paciente, que puede estar en unidades métricas o imperiales. Las restricciones son las siguientes:

|Constraint|Imperial|Metric|
|-|-|-|
|min|66|30|
|max|440|200|

Necesitaremos validar tanto el `name` como el `weight`. El formulario con errores se ve así:

![the-patient-form](./img/the-patient-form-2.png)

>Formulario no válido con información de depuración

Definiremos las restricciones usando un objeto:

```js
const limits = {
  kg: { min: 30, max: 200 },
  lb: { min: 66, max: 440 }
}
```

El botón **Submit** solo debe habilitarse si ambas entradas son válidas. Finalmente, debemos mostrar la validación para cada campo.

## Un Framework de Validación de Mini Formularios

Hay muchos frameworks de validación de formularios Vue (y no Vue) con todas las funciones. Para este ejemplo simple, escribiremos el nuestro; esto nos permitirá analizar algunas ideas y evitar aprender una API o biblioteca específica.

Necesitamos dos tipos de validaciones:

1. **Un campo obligatorio**. Tanto el `name` como el `weight` del paciente son campos obligatorios.
2. **Restricciones mínimas y máximas**. Esto es para el campo `weight`, tiene que estar dentro de un rango específico. También necesita admitir unidades métricas e imperiales.

Además de validar los campos, nuestro framework de validación de formularios también debería devolver un mensaje de error por cada entrada no válida.

Escribiremos dos funciones de validación: `required` y `isBetween`. Si bien el desarrollo dirigido por pruebas (abreviado como [TDD](../../comenzar/tdd.html), donde primero escribe las pruebas y deja que las pruebas fallidas guíen la implementación) no siempre es la herramienta adecuada, creo que para escribir estas dos funciones lo es. Esto se debe a que conocemos las entradas y salidas, y todos los posibles estados del sistema, solo es cuestión de escribir las pruebas y luego hacerlas pasar.

Hagámoslo, comenzando con las pruebas para el validador `required`. Cada validador devolverá un objeto con el estado de validación y un mensaje si hay un error. Una entrada validada debe tener esta forma:

```ts
interface ValidationResult {
  valid: boolean
  message?: string
}
```

Este será el formato al que deberán ajustarse nuestros dos validadores (y los futuros). Ahora que nos hemos decidido por nuestra API de validación, podemos escribir las pruebas para `required`.

## El validador `required`

📃`__tests__/form.spec.js`
```js
import {
  required
} from '../form.js'

describe('required', () => {
  it('is invalid when undefined', () => {
    expect(required(undefined)).toEqual({
      valid: false,
      message: 'Required'
    })
  })
  
  it('is invalid when empty string', () => {
    expect(required('')).toEqual({
      valid: false,
      message: 'Required'
    })
  })

  it('returns true false value is present', () => {
    expect(required('some value')).toEqual({ valid: true })
  })
})
```
>Pruebas para el validador `required`.

Básicamente, todo lo que no se evalúe como verdadero no es válido; cualquier otra cosa se considera válida. Podemos hacer que todas las pruebas pasen con esta implementación:

📃`form.js`
```js
export function required(value) {
  if (!value) {
    return {
      valid: false,
      message: 'Required'
    }
  }
  return { valid: true }
}
```
>Implementación `required` del validador.

Me gusta verificar primero el caso `null`, cuando el valor no está definido. Eso es solo una preferencia personal.

## El validador `isBetween`

`isBetween` es un poco más interesante. Necesitamos admitir imperial y métrico; construiremos otra función encima de `isBetween` que pasará las restricciones correctas.

Comencemos identificando todos los casos extremos. Si el `weight` mínimo es `66 lb` y el `weight` es `440 lb`, obviamente `65 lb` y `441 lb` no son válidos. Sin embargo, `66 lb` y `440 lb` son válidos, por lo que debemos asegurarnos de agregar pruebas para esos casos.

Esto significa que necesitamos 5 pruebas:
1. El camino "feliz", donde la entrada es válida.
2. El valor está por encima del valor máximo.
3. El valor está por debajo del valor mínimo.
4. El valor es igual al valor máximo.
5. El valor es igual al valor mínimo.

Para esta función, es seguro asumir que solo se pueden pasar números como valor de entrada; esta validación es algo que manejaremos en un nivel superior.

📃`__tests__/form.spec.js`
```js
import {
  isBetween
  required,  
} from '../form.js'

describe('required', () => {
  // omitted for brevity ...
})

describe('isBetween', () => {
  it('returns true when value is equal to min', () => {
    expect(isBetween(5, { min: 5, max: 10 }))
      .toEqual({ valid: true })
  })

  it('returns true when value is between min/max', () => {
    expect(isBetween(7, { min: 5, max: 10 }))
      .toEqual({ valid: true })
  })

  it('returns true when value is equal to max', () => {
    expect(isBetween(10, { min: 5, max: 10 }))
      .toEqual({ valid: true })
  })

  it('returns false when value is less than min', () => {
    expect(isBetween(4, { min: 5, max: 10 }))
      .toEqual({
        valid: false,
        message: 'Must be between 5 and 10'
      })
  })

  it('returns false when value is greater than max', () => {
    expect(isBetween(11, { min: 5, max: 10 }))
      .toEqual({
        valid: false,
        message: 'Must be between 5 and 10'
    })
  })
})
```
>Pruebas para el validador `isBetween`.

Creo que las pruebas son lo suficientemente simples como para tener todo en una sola declaración de expectativa. Si las pruebas fueran más complejas, probablemente asignaría el resultado de `isBetween()` a una variable (me gusta llamarlo real) y lo pasaría a la afirmación esperada. Más información sobre la estructuración de pruebas más grandes y complejas más adelante.

La implementación es mucho menos código que las pruebas; esto no es inusual.

📃`form.js`
```js
export function isBetween(value, { min, max }) {
  if (value < min || value > max) {
    return {
      valid: false,
      message: `Must be between ${min} and ${max}`
    }
  }
  return { valid: true }
}

export function required(value) {
  // omitted for brevity ...
}
```
>Implementación del validador `isBetween`.

Nuevamente, me gusta tener la validación al comienzo de la función.

## Construyendo `validateMeasurement` con `isBetween`

Ahora que hemos escrito nuestro pequeño framework de validación (bueno, dos funciones), es hora de validar el `weight` del paciente. Construiremos una función de `validateMeasurement` utilizando `isBetween` y `required`.

Dado que admitimos el sistema métrico e imperial, pasaremos las restricciones como argumento. El manejo de cuál se selecciona se hará más adelante, en la capa de la UI.

Hay tres escenarios a considerar:

1. El camino feliz cuando el valor es válido.
2. El valor es nulo/indefinido.
3. El valor está definido, pero fuera de las restricciones.

No siento la necesidad de agregar pruebas para todos los casos como hicimos con `isBetween`, ya que ya lo probamos a fondo.

📃`__tests__/form.spec.js`
```js
import {
  isBetween,
  required,
  validateMeasurement
} from '../form.js'

describe('required', () => {
 // omitted for brevity ...
})

describe('isBetween', () => {
  // omitted for brevity ...
})

describe('validateMeasurement', () => {
  it('returns invalid for input', () => {
    const constraints = { min: 10, max: 30 }
    const actual = validateMeasurement(undefined, { constraints })

    expect(actual).toEqual({ valid: false, message: 'Required' })
  })

  it('returns invalid when outside range', () => {
    const constraints = { min: 10, max: 30 }
    const actual = validateMeasurement(40, { constraints })

    expect(actual).toEqual({
      valid: false,
      message: 'Must be between 10 and 30'
    })
  })
})
```
>Pruebas para el validador `validateMeasurement`.

Dado que la prueba es un poco más compleja, decidí asignar el resultado a `actual` y afirmar contra eso. Creo que esto lo deja más claro.

No necesitamos usar las restricciones específicas para libras y kilogramos descritas en la tabla anterior. Mientras las pruebas pasen con las restricciones que pasamos aquí, podemos estar seguros de que `validateMeasurement` funcionará correctamente para cualquier conjunto dado de restricciones `min`/`max`.

También dejé una línea en blanco entre el cuerpo de la prueba y la afirmación. Esta es una preferencia personal, vagamente inspirada en las tres fases de una prueba: **_arreglar_**, **_actuar_** y **_afirmar_**. Hablaremos de eso más tarde.

No tienes que escribir tus pruebas de esta manera. Encuentro útil pensar en términos de _"hacer cosas"_ (por ejemplo, crear algunas variables, llamar a algunas funciones) y afirmar (donde decimos _"dado este escenario, esto debería suceder"_).

Dejando a un lado la filosofía personal: la implementación, nuevamente, es mucho más corta que el código de prueba. ¿Notas un patrón? Es común que el código de prueba sea más largo que la implementación. Puede parecer un poco extraño al principio, pero no es un problema y se espera para una lógica compleja.

📃`form.js`
```js
export function isBetween(value, { min, max }) {
  // omitted for brevity ...
}

export function required(value) {
  // omitted for brevity ...
}

export function validateMeasurement(value, { constraints }) {
  const result = required(value)
  if (!result.valid) {
    return result
  }

  return isBetween(value, constraints)
}
```
>Componiendo `validateMeasurement` con `required` y `isBetween`.

¡Bonito! Pudimos reutilizar `required` e `isBetween`. _“Compusimos”_ un validador usando dos pequeños. La reutilización es buena. La componibilidad es buena.

## 5.6 The Form Object and Full Form Validation
