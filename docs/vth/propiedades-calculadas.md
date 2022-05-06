# Propiedades Calculadas

## Prueba de Propiedades Calculadas

Puede encontrar la prueba descrita en esta página [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/NumberRenderer.spec.js)

Probar las propiedades calculadas es especialmente simple, ya que son simplemente funciones tradicionales de JavaScript.

Comencemos mirando dos formas diferentes de probar una propiedad `computed`. Desarrollaremos un componente `<NumberRenderer>`, que representa números pares o impares, en función de una propiedad calculada de `numbers`.

## Escribiendo la prueba

El componente `<NumberRenderer>` recibirá una propiedad `even`, que es un valor booleano. Si `even` es `true`, el componente debe generar 2, 4, 6 y 8. Si es `false`, debe generar 1, 3, 5, 7 y 9. La lista de valores se calculará en una propiedad `computed` llamada `numbers`.

## Probando renderizando el valor

La prueba:

```js
import { mount } from "@vue/test-utils"
import NumberRenderer from "@/components/NumberRenderer.vue"

describe("NumberRenderer", () => {
  it("renders even numbers", () => {
    const wrapper = mount(NumberRenderer, {
      props: {
        even: true
      }
    })

    expect(wrapper.text()).toBe("2, 4, 6, 8")
  })
})
```

Antes de ejecutar la prueba, declaremos `<NumberRenderer>`:

```vue
<template>
  <div>
  </div>
</template>

<script>
export default {
  name: "NumberRenderer",

  props: {
    even: {
      type: Boolean,
      required: true
    }
  }
}
</script>
```
Ahora comenzamos el desarrollo y dejamos que los mensajes de error guíen nuestra implementación:

```
● NumberRenderer › renders even numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "2, 4, 6, 8"
  Received: ""
```

Parece que todo está enganchado correctamente. Comencemos implementando `numbers`:

```js
computed: {
  numbers() {
    const evens = []

    for (let i = 1; i < 10; i++) {
      if (i % 2 === 0) {
        evens.push(i)
      }
    }

    return evens
  }
}
```

Y actualice la plantilla para usar la nueva propiedad calculada:

```html
<template>
  <div>
    {{ numbers }}
  </div>
</template>
```

La prueba ahora produce:

```
FAIL  tests/unit/NumberRenderer.spec.js
● NumberRenderer › renders even numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "2, 4, 6, 8"
  Received: "[
    2,
    4,
    6,
    8
  ]"
```

Los números son correctos, pero queremos que la lista tenga un buen formato. Actualicemos el valor `return`:

```js
return evens.join(", ")
```

¡Ahora la prueba pasa!

## Prueba con `call`

Ahora agregaremos una prueba para el caso de `even: false`. Esta vez, veremos una forma alternativa de probar una propiedad calculada, sin renderizar el componente.

La prueba, primero:

```js
it("renders odd numbers", () => {
  const localThis = { even: false }

  expect(NumberRenderer.computed.numbers.call(localThis)).toBe("1, 3, 5, 7, 9")
})
```

En lugar de renderizar el componente y hacer una afirmación en `wrapper.text()`, estamos usando `call` para proporcionar el contexto `this` alternativo a `numbers`. Veremos qué sucede si no usamos `call` después de que pasemos la prueba.

Ejecutar la prueba actual produce:

```
FAIL  tests/unit/NumberRenderer.spec.js
● NumberRenderer › renders odd numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "1, 3, 5, 7, 9"
  Received: "2, 4, 6, 8"
```

Actualizar `numbers`:

```js
numbers() {
  const evens = []
  const odds = []

  for (let i = 1; i < 10; i++) {
    if (i % 2 === 0) {
      evens.push(i)
    } else {
      odds.push(i)
    }
  }

  return this.even === true ? evens.join(", ") : odds.join(", ")
}
```

¡Ahora ambas pruebas pasan! Pero, ¿y si no hubiéramos usado `call` en la segunda prueba? Intenta actualizarlo así:

```js
it("renders odd numbers", () => {
  const localThis = { even: false }

  expect(NumberRenderer.computed.numbers()).toBe("1, 3, 5, 7, 9")
})
```

La prueba ahora falla:

```
FAIL  tests/unit/NumberRenderer.spec.js
● NumberRenderer › renders odd numbers

  expect(received).toBe(expected) // Object.is equality

  Expected: "1, 3, 5, 7, 9"
  Received: "2, 4, 6, 8"
```

vue vincula automáticamente las `props` a `this`. Sin embargo, no estamos renderizando el componente con `mount`, por lo que Vue no vincula nada a `this`. Si haces `console.log(this)`, puedes ver que el contexto es simplemente el objeto `computed`:

```
{ numbers: [Function: numbers] }
```

Entonces necesitamos usar `call`, lo que nos permite vincular un objeto alternativo a `this`, en nuestro caso, uno con una propiedad `even`.

Aquí el ejemplo completo del componente `NumberRenderer.vue`:

```vue
<template>
  <div>
    {{ numbers }}
  </div>
</template>

<script>
export default {
  name: "NumberRenderer",

  props: {
    even: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    numbers() {
      const evens = []
      const odds = []

      for (let i = 1; i < 10; i++) {
        if (i % 2 === 0) {
          evens.push(i)
        } else {
          odds.push(i)
        }
      }

      return this.even === true ? evens.join(", ") : odds.join(", ")
    }
  }
}
</script>
```

Y las dos pruebas en `NumberRenderer.spec.js`:

```js
import { mount } from "@vue/test-utils"
import NumberRenderer from "@/components/NumberRenderer.vue"

describe("NumberRenderer", () => {
  it("renders even numbers", () => {
    const wrapper = mount(NumberRenderer, {
      props: {
        even: true
      }
    })

    expect(wrapper.text()).toBe("2, 4, 6, 8")
  })
  
  it("renders odd numbers", () => {
    const localThis = { even: false }

    // console.log(this)    
    // expect(NumberRenderer.computed.numbers()).toBe("1, 3, 5, 7, 9")    
    
    expect(NumberRenderer.computed.numbers.call(localThis)).toBe("1, 3, 5, 7, 9")    
  })

})
```

## ¿Llamar o Montar?

Ambas técnicas presentadas son útiles para probar propiedades calculadas. La llamada puede ser útil cuando:

- Está probando un componente que realiza algunas operaciones que consumen mucho tiempo en un método de ciclo de vida que le gustaría evitar ejecutar en su prueba de unidad computada.
- Desea extraer algunos valores de `this`. Usar `call` y pasar un contexto personalizado puede ser útil.

Por supuesto, también desea asegurarse de que el valor se renderice correctamente, así que asegúrese de elegir la técnica correcta al probar sus propiedades calculadas y pruebe todos los casos extremos.

## Conclusión

- Las propiedades calculadas pueden usar `mount` haciendo aserciones en el marcado renderizado
- Las propiedades calculadas complejas se pueden probar de forma independiente mediante el uso de `call`
