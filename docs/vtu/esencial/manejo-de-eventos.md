# Manejo de Eventos

Los componentes de Vue interactúan entre sí a través de accesorios y emitiendo eventos llamando a `$emit`. En esta guía, veremos cómo verificar que los eventos se emitan correctamente mediante la función `emitted()`.

Este artículo también está disponible como un [video corto](https://www.youtube.com/watch?v=U_j-nDur4oU&list=PLC2LZCNWKL9ahK1IoODqYxKu5aA9T5IOA&index=14).

## El componente Contador

Aquí hay un componente `<Counter>` simple. Cuenta con un botón que, cuando se hace click, incrementa una variable interna de conteo y emite su valor:

```js
const Counter = {
  template: '<button @click="handleClick">Increment</button>',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count += 1
      this.$emit('increment', this.count)
    }
  }
}
```

Para probar completamente este componente, debemos verificar que se emita un evento `increment` con el último valor `count`.

## Afirmar los eventos emitidos

Para hacerlo, nos basaremos en el método `emitted()`. **Devuelve un objeto con todos los eventos que ha emitido el componente** y sus argumentos en un arreglo. Vamos a ver cómo funciona:

```js
test('emits an event when clicked', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')

  expect(wrapper.emitted()).toHaveProperty('increment')
})
```
>Si no ha visto `trigger()` antes, no se preocupe. Se utiliza para simular la interacción del usuario. Puede obtener más información en [Formularios](../esencial/formularios.html).

Lo primero que debe notar es que `emitted()` devuelve un objeto, donde cada clave coincide con un evento emitido. En este caso, `increment`.

Esta prueba debe pasar. Nos aseguramos de emitir un evento con el nombre apropiado.

## Afirmar los argumentos del evento

Esto es bueno, ¡pero podemos hacerlo mejor! Necesitamos comprobar que emitimos los argumentos correctos cuando se llama a `this.$emit('increment', this.count)`.

Nuestro siguiente paso es afirmar que el evento contiene el valor `count`. Lo hacemos pasando un argumento a `emitted()`.

```js
test('emits an event with count when clicked', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')

  // `emitted()` accepts an argument. It returns an array with all the
  // occurrences of `this.$emit('increment')`.
  const incrementEvent = wrapper.emitted('increment')

  // We have "clicked" twice, so the array of `increment` should
  // have two values.
  expect(incrementEvent).toHaveLength(2)

  // Assert the result of the first click.
  // Notice that the value is an array.
  expect(incrementEvent[0]).toEqual([1])

  // Then, the result of the second one.
  expect(incrementEvent[1]).toEqual([2])
})
```
Recapitulemos y analicemos la salida de `emitted()`. Cada una de estas claves contiene los diferentes valores emitidos durante la prueba:

```js
/**
 *  console.log(wrapper.emitted('increment'));
 * [
 *   [1], // first time it is called, `count` is 1
 *   [2]  // second time it is called, `count` is 2
 * ]
 */
```
## Afirmar eventos complejos

Imagina que ahora nuestro componente `<Counter>` necesita emitir un objeto con información adicional. Por ejemplo, necesitamos decirle a cualquier componente principal que escuche el evento `@increment` si `count` es par o impar:

```js{12,13,14,15}
const Counter = {
  template: `<button @click="handleClick">Increment</button>`,
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count += 1

      this.$emit('increment', {
        count: this.count,
        isEven: this.count % 2 === 0
      })
    }
  }
}
```
Como hicimos antes, necesitamos activar el evento `click` en el elemento `<button>`. Luego, usamos `emitted('increment')` para asegurarnos de que se emitan los valores correctos.

```js
test('emits an event with count when clicked', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  wrapper.find('button').trigger('click')

  // We have "clicked" twice, so the array of `increment` should
  // have two values.
  expect(wrapper.emitted('increment')).toHaveLength(2)

  // Then, we can make sure each element of `wrapper.emitted('increment')`
  // contains an array with the expected object.
  expect(wrapper.emitted('increment')[0]).toEqual([
    {
      count: 1,
      isEven: false
    }
  ])

  expect(wrapper.emitted('increment')[1]).toEqual([
    {
      count: 2,
      isEven: true
    }
  ])
})
```
Probar cargas útiles de eventos complejos, como Objetos, no es diferente de probar valores simples, como números o cadenas.

## Composition API

Si está utilizando la Composition API, llamará a `context.emit()` en lugar de `this.$emit()`. `emitted()` captura eventos de ambos, por lo que puede probar su componente utilizando las mismas técnicas descritas aquí.

## Conclusión

- Use `emitted()` para acceder a los eventos emitidos desde un componente Vue.
- `emitted(eventName)` devuelve un arreglo, donde cada elemento representa un evento emitido.
- Los argumentos se almacenan en `emitted(eventName)[index]` en un arreglo en el mismo orden en que se emiten.
