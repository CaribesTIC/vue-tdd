# Pasando Datos a Componentes

Vue Test Utils proporciona varias formas de establecer datos y accesorios en un componente, para permitirle probar completamente el comportamiento del componente en diferentes escenarios.

En esta sección, exploramos las opciones de montaje `data` y `props`, así como `VueWrapper.setProps()` para actualizar dinámicamente los accesorios que recibe un componente.

## El Componente Password

Demostraremos las funciones anteriores creando un componente `<Password>`. Este componente verifica que una contraseña cumpla con ciertos criterios, como la longitud y la complejidad. Comenzaremos con lo siguiente y agregaremos funciones, así como pruebas para asegurarnos de que las funciones trabajen correctamente:

```js
const Password = {
  template: `
    <div>
      <input v-model="password">
    </div>
  `,
  data() {
    return {
      password: ''
    }
  }
}
```

El primer requisito que agregaremos es una longitud mínima.

## Usando `props` para establecer una longitud mínima

Queremos reutilizar este componente en todos nuestros proyectos, cada uno de los cuales puede tener requisitos diferentes. Por esta razón, haremos de `minLength` un **accesorio** que le pasaremos a `<Password>`:

Mostraremos un error si `password` es inferior a `minLength`. Podemos hacer esto creando una propiedad calculada `error` y renderizándola condicionalmente usando `v-if`:

```js
const Password = {
  template: `
    <div>
      <input v-model="password">
      <div v-if="error">{{ error }}</div>
    </div>
  `,
  props: {
    minLength: {
      type: Number
    }
  },
  computed: {
    error() {
      if (this.password.length < this.minLength) {
        return `Password must be at least ${this.minLength} characters.`
      }
      return
    }
  }
}
```

Para probar esto, necesitamos configurar `minLength`, así como un `password` que sea menor que ese número. Podemos hacer esto usando las opciones de montaje `data` y `props`. Finalmente, afirmaremos que se muestra el mensaje de error correcto:

```js
test('renders an error if length is too short', () => {
  const wrapper = mount(Password, {
    props: {
      minLength: 10
    },
    data() {
      return {
        password: 'short'
      }
    }
  })

  expect(wrapper.html()).toContain('Password must be at least 10 characters')
})
```
Escribir una prueba para una regla `maxLength` se deja como ejercicio para el lector. Otra forma de escribir esto sería usar `setValue` para actualizar la entrada con una contraseña demasiado corta. Puede obtener más información en [Formularios](../esencial/formularios.html).

## Usando `setProps`

A veces, es posible que deba escribir una prueba para un efecto secundario del cambio de un accesorio. Este componente simple `<Show>` renderiza un saludo si el accesorio `show` es `true`.

```vue
<template>
  <div v-if="show">{{ greeting }}</div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      greeting: 'Hello'
    }
  }
}
</script>
```

Para probar esto completamente, es posible que deseemos verificar que `greeting` se renderiza de manera predeterminada. Podemos actualizar el accesorio `greeting` usando `setProps()`, lo que hace que `greeting` se oculte:

```js
import { mount } from '@vue/test-utils'
import Show from '@/Show.vue'

test('renders a greeting when show is true', async () => {
  const wrapper = mount(Show)
  expect(wrapper.html()).toContain('Hello')

  await wrapper.setProps({ show: false })

  expect(wrapper.html()).not.toContain('Hello')
})
```

También usamos la palabra clave `await` cuando llamamos a `setProps()`, para asegurarnos de que el DOM se haya actualizado antes de que se ejecuten las afirmaciones.

## Conclusión

- Use las opciones de montaje `props` y `data` para preestablecer el estado de un componente.
- Use `setProps()` para actualizar un accesorio durante una prueba.
- Use la palabra clave `await` antes de `setProps()` para asegurarse de que Vue actualice el DOM antes de que continúe la prueba.
- La interacción directa con su componente puede brindarle una mayor cobertura. Considere usar `setValue` o `trigger` en combinación con `data` para asegurarse de que todo funcione correctamente.
