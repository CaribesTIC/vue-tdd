# Vuex Captadores

## Probando Captadores

Probar captadores de forma aislada es sencillo, ya que básicamente son solo funciones de JavaScript. Las técnicas son similares a las pruebas de mutaciones y acciones, más información [aquí](../vth/vuex-mutaciones).

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/getters.spec.js).

Veremos dos captadores, que operan en una tienda que se ve así:

```js
const state = {
  dogs: [
    { name: "lucky", breed: "poodle", age: 1 },
    { name: "pochy", breed: "dalmatian", age: 2 },
    { name: "blackie", breed: "poodle", age: 4 }
  ]
}
```

Los captadores que probaremos son:

1. `poodles`: obtiene todos los `poodles`
1. `poodlesByAge`: obtiene todos los `poodles` y acepta un argumento `age`

## Creando los Captadores

Primero, vamos a crear los captadores.

```js
// store/getters.js
export default {
  poodles: (state) => {
    return state.dogs.filter(dog => dog.breed === "poodle")
  },

  poodlesByAge: (state, getters) => (age) => {
    return getters.poodles.filter(dog => dog.age === age)
  }
}
```

Nada demasiado emocionante: recuerde que los captadores reciben a otros captadores como segundo argumento. Como ya tenemos un captador `poodles`, podemos usarlo en `poodlesByAge`. Al devolver una función en `poodlesByAge` que toma un argumento, podemos pasar argumentos a captadores. El captador `poodlesByAge` se puede usar así:

```js
computed: {
  puppies() {
    return this.$store.getters.poodlesByAge(1)
  }
}
```

Comencemos con una prueba para `poodles`.

## Escribiendo las Pruebas

Dado que un captador es solo una función de JavaScript que toma un objeto `state` como primer argumento, la prueba es muy simple. Escribiré mi prueba en un archivo `getters.spec.js`, con el siguiente código:

```js
import getters from "@/store/getters.js"

const dogs = [
  { name: "lucky", breed: "poodle", age: 1 },
  { name: "pochy", breed: "dalmatian", age: 2 },
  { name: "blackie", breed: "poodle", age: 4 }
]
const state = { dogs }

describe("poodles", () => {
  it("returns poodles", () => {
    const actual = getters.poodles(state)

    expect(actual).toEqual([ dogs[0], dogs[2] ])
  })
})
```
Vuex pasa automáticamente el `state` al captador. Dado que estamos probando los captadores de forma aislada, tenemos que pasar manualmente el `state`. Aparte de eso, solo estamos probando una función JavaScript normal.

`poodlesByAge` es un poco más interesante. El segundo argumento para un captador son otros `getters`. Estamos probando `poodlesByAge`, por lo que no queremos involucrarnos en la implementación de `poodles`. En su lugar, podemos talonar `getters.poodles`. Esto nos dará un control más detallado sobre la prueba.

```js
describe("poodlesByAge", () => {
  it("returns poodles by age", () => {
    const poodles = [ dogs[0], dogs[2] ]
    const actual = getters.poodlesByAge(state, { poodles })(1)

    expect(actual).toEqual([ dogs[0] ])
  })
})
```
En lugar de pasar realmente el captador de `poodles` real, pasamos el resultado que devolvería. Ya sabemos que está funcionando, ya que escribimos una prueba para ello. Esto nos permite centrarnos en probar la lógica exclusiva de `poodlesByAge`.

Es posible tener captadores `async`. Se pueden probar con la misma técnica que las acciones `async`, sobre las que puede leer [aquí](../vth/vuex-acciones).

## Conclusión

- Los `getters` son simplemente funciones de JavaScript.
- Al probar `getters` de forma aislada, debe pasar el estado manualmente.
- Si un captador usa otro captador, debe agregar el resultado de retorno esperado del primer captador. Esto le dará un control más detallado sobre la prueba y le permitirá concentrarse en probar el captador en cuestión.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/getters.spec.js).
