# Pobando Componentes con Eventos Emitidos

Los eventos emitidos, como las propiedades, son estrictamente parte de la API del componente. El usuario final de su aplicación ni siquiera conoce el concepto de eventos emitidos. Esto significa que cuando esté probando eventos emitidos, el usuario que debe tener en cuenta al escribir la prueba es el desarrollador que usará su componente.

Desea probar el contrato API del componente -- en Vue, la API de un componente consta de _props_, _slots_, _events_ y, **si es necesario**, la jerarquía del componente circundante.

Ahora, cuando interactúe con el componente, aún debe hacerlo como lo haría un usuario; sin embargo, sus afirmaciones se centran en las expectativas del desarrollador. ¿Emite ese componente los eventos correctos con los argumentos correctos en el momento adecuado al interactuar con el componente?

## Prueba de Eventos Emitidos

En el componente `Stepper`, vinculamos a los _listeners_ de clics DOM nativos con devoluciones de llamada a botones que aumentan y disminuyen el valor del contador interno.

Debido a que el componente administra todo el estado internamente, es opaco para el desarrollador o el componente principal que consume `Stepper`.

📃`Stepper.vue`
```html
<button aria-label="decrement" @click="counter--">-</button>
<span data-cy="counter">{{ count }}</span>
<button aria-label="increment" @click="counter++">+</button>
```

Esto puede estar bien, pero dependiendo de las necesidades del desarrollador, puede ser difícil para el consumidor de `Stepper` (por ejemplo, otros componentes) escuchar cuando se produce un cambio o cuando el usuario interactúa con los diversos botones de `Stepper`.

Una solución es emitir un evento llamado `change` al componente consumidor con el nuevo estado interno del `Stepper`.

Usaría el `<Stepper>` desde un componente padre así:

📃`Parent.vue`
```html
<div>
  What's your age?
  <Stepper @change="onAgeChange" />
  <!-- onAgeChange is a method the parent component defines -->
</div>
```

Así es como se vería la implementación:

📃`Stepper.vue`
```vue
<script setup>
  import { ref } from 'vue'
  const props = defineProps(['initial'])

  const emit = defineEmits(['change'])

  const count = ref(props.initial || 0)

  const increment = () => {
    count.value++
    emit('change', count.value)
  }

  const decrement = () => {
    count.value--
    emit('change', count.value)
  }
</script>

<template>
  <div>
    <button aria-label="decrement" @click="decrement">-</button>
    <span data-cy="counter">{{ count }}</span>
    <button aria-label="increment" @click="increment">+</button>
  </div>
</template>
```

Arriba, agregamos un nuevo evento `change` emitido y abstrajimos los eventos `click` de los botones en sus propios métodos.

Como desarrollador del componente `Stepper`, desea asegurarse de que cuando el usuario final haga clic en los botones de `increment` y `decrement`, el evento ``change`` se emita al componente consumidor.

Cypress utiliza _**"spies"**_ para lograr esto.

## Utilizando Spies

¿Cómo probamos que el evento `change` personalizado está disparando los valores `increment` y `decrement` para el `Stepper`? Podemos usar espías cuando **Arreglamos**, **Actuamos** y **Afirmamos** en nuestra prueba.

## Arreglar

Primero, arreglamos nuestra prueba.

Configuremos los espías y vinculémoslos al componente:

📃`Stepper.cy.js`
```js
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
})
```

>Estamos [asignando un alias](https://docs.cypress.io/guides/core-concepts/variables-and-aliases) al espía con `cy.as('onChangeSpy')` para que _**Cypress Reporter**_ imprima el nombre del espía cada vez que se invoque. Esto le permite inspeccionar visualmente los argumentos del evento emitido en su navegador. También podemos acceder al espía por su nombre más tarde.

:::warning
Puede notar que la sintaxis anterior en el ejemplo se basa en vincular eventos a la clave `props` en el montaje. Si bien esto no es "Vue idiomático", es la firma actual de _Vue Test Utils_.

En el futuro, Cypress puede proponer un cambio de API a _Vue Test Utils_ para que esta sintaxis se sienta más natural, porque **onChange** no es en realidad una propiedad, es un evento.
:::

## Actuar

A continuación, **Actuamos** disparando un evento de clic para el botón `increment`.

📃`Stepper.cy.js`
```js
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
  // Act
  cy.get(incrementSelector).click()
})
```

## Afirmar

Finalmente, **Afirmamos** que el evento `change` fue emitido con el valor correcto.

📃`Stepper.cy.js`
```js
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get('@onChangeSpy').should('have.been.calledWith', 1)
})
```

Podemos decidir combinar esta prueba con las pruebas anteriores que hemos escrito que prueban varias cosas a la vez en un escenario determinado.

Hacerlo queda a discreción del desarrollador. La combinación de pruebas dará como resultado una ejecución de prueba general más rápida. Sin embargo, puede ser más difícil aislar por qué falló una prueba en primer lugar. Recomendamos tener pruebas más largas para las pruebas **_end-to-end_** porque la configuración y las páginas de visita son costosas. Las pruebas más largas no son necesariamente un problema para las pruebas de componentes porque son relativamente rápidas.

## Usando _Vue Test Utils_

Para fomentar la interoperabilidad entre sus pruebas de componentes existentes y Cypress, se admite el uso de la API de _Vue Test Utils_.

```js
cy.mount(Stepper).then((wrapper) => {
  // this is the Vue Test Utils wrapper
})
```

Si tiene la intención de usar el `wrapper` con frecuencia y usa la API de Vue Test Util, le recomendamos que escriba un [comando de montaje personalizado](https://docs.cypress.io/api/commands/mount) y cree un alias de Cypress para volver al contenedor.

📃`cypress/support/component.js`
```js
// omitted for brevity ...
import { mount } from 'cypress/vue'

// Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(MyComponent)

Cypress.Commands.add('mount', (...args) => {
  return mount(...args).then((wrapper) => {
    return cy.wrap(wrapper).as('vue')
  })
})

// the "@vue" alias will now work anywhere
// after you've mounted your component
cy.mount(Stepper).doStuff().get('@vue') // The subject is now the Vue Wrapper
```

Esto significa que puede acceder al `wrapper` resultante devuelto por el comando `mount` y usar `wrapper.emitted()` para obtener acceso a los eventos DOM nativos que se activaron, así como a los eventos personalizados que emitió su componente bajo prueba.

Debido a que `wrapper.emited()` es solo datos y NO está basado en espionaje, tendrá que desempaquetar sus resultados para escribir afirmaciones.

Sus mensajes de falla de la prueba no serán tan útiles porque no puede usar la biblioteca Sinon-Chai que Cypress envía, que viene con métodos como `to.have.been.called` y `to.have.been.calledWith`.

El uso del alias `cy.get('@vue')` puede parecerse al siguiente fragmento de código.

Tenga en cuenta que estamos usando la firma de la función `'should'` para aprovechar la capacidad de [reintento](https://docs.cypress.io/guides/guides/test-retries) de Cypress. Si nos encadenamos usando `cy.then` en lugar de `cy.should`, podemos encontrarnos con los tipos de problemas que tiene en las pruebas de Vue Test Utils donde tiene que usar `await` con frecuencia para asegurarse de que el DOM se haya actualizado o que se haya activado cualquier evento reactivo.

**Con emitido:**
```js
it('With emitted', () => {  
  cy.mount(Stepper, { props: { initial: 100 } })

  cy.get(incrementSelector).click()

  cy.get('@vue').should((wrapper) => {
    expect(wrapper.emitted('change')).to.have.length
    expect(wrapper.emitted('change')[0][0]).to.equal(101)
  })  
}) 
```

**Con espía:**
```js
it('With spies', () => {   
  const onChangeSpy = cy.spy().as('onChangeSpy')     
  cy.mount(Stepper, { props: { initial: 100, onChange: onChangeSpy } })

  cy.get(incrementSelector).click()

  cy.get('@onChangeSpy').should('have.been.calledWith', 101)  
}) 
```

Independientemente de nuestra recomendación de usar espías en lugar de la API interna de _Vue Test Utils_, puede decidir continuar usando `emited`, ya que registra automáticamente todos los eventos emitidos desde el componente, por lo que no tendrá que crear un espía para cada evento emitido.

Este comportamiento de espionaje automático podría ser útil para los componentes que emiten muchos eventos personalizados.

## Aprende Más

El espionaje es una técnica poderosa para observar el comportamiento en Cypress. Obtenga más información sobre el uso de Spies en la [guía Stubs, Spies y Clocks](https://docs.cypress.io/guides/guides/stubs-spies-and-clocks).

## ¿Que Sigue?

Vamos a crear un componente de contenedor y aprenderemos a probar los **_"slots"_**.
