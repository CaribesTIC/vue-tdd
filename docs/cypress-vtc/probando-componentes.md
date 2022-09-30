# Probando Componentes

Ahora que el componente está montado, el siguiente paso es comenzar a seleccionar e interactuar con partes del componente. Este es el paso **Actuar** en "Arreglar, Actuar, Afirmar".

Una vez que hayamos terminado de actuar sobre el componente, podemos verificar que el estado esperado del componente es el que creemos que debería ser. Este es el paso **Afirmar**.

## Seleccionando el Componente Paso a Paso

De forma predeterminada, el contador del componente `Stepper` se inicializa en `0`. También tiene un propiedad que puede especificar un conteo inicial.

Probemos que montar el componente (Arrange) en su estado predeterminado tiene un conteo de `0` (Assert).

Luego, probaremos que configurar el conteo inicial también funciona.

En su archivo de especificaciones, agregue lo siguiente dentro del bloque `describe` existente:

📃`Stepper.cy.js`
```js
// Set up some constants for the selectors
const counterSelector = '[data-cy=counter]'
const incrementSelector = '[aria-label=increment]'
const decrementSelector = '[aria-label=decrement]'

it('stepper should default to 0', () => {
  // Arrange
  cy.mount(Stepper)
  // Assert
  cy.get(counterSelector).should('have.text', '0')
})

it('supports an "initial" prop to set the value', () => {
  // Arrange
  cy.mount(Stepper, { props: { initial: 100 } })
  // Assert
  cy.get(counterSelector).should('have.text', '100')
})
```

::: info
Dependiendo de su versión de Vue, la sintaxis de cómo montar su componente cambiará ligeramente. Consulte la [documentación de Vue Test Utils](https://test-utils.vuejs.org/) para obtener la sintaxis más reciente al usar la Object API de la función `mount`.

La principal diferencia es que `props` debe ser `propsData` para aplicaciones Vue 2.
:::

## ¿Qué Más Debe Probar en Este Componente?

En las pruebas anteriores, arreglamos y afirmamos, pero no actuamos sobre el componente. También deberíamos probar que cuando un usuario interactúa con el componente haciendo clic en los botones `increment` y `decrement` el valor de `count` cambia.

Sin embargo, haremos una pausa aquí.

Notará que estamos hablando de cómo un usuario interactuaría con el componente, y no de conceptos técnicos específicos de Vue.

Puede realizar una prueba completa y bien escrita para nuestro componente `Stepper` abordando esta prueba como lo haría un usuario.

No pienses en `data`, `methods` o `props`. Piense únicamente en la interfaz de usuario y use su prueba para automatizar lo que haría naturalmente como usuario.

Probarás el componente a fondo sin perderte en los detalles. Todo lo que importa es que si el desarrollador usa el componente con una API dada, el usuario final podrá usarlo como se espera.

¡Ahora, probemos el componente `Stepper`! Agregue las siguientes pruebas:

1. Puedes incrementar y disminuir el paso a paso.

📃`Stepper.cy.js`
```js
it('when the increment button is pressed, the counter is incremented', () => {
  // Arrange
  cy.mount(Stepper)
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get(counterSelector).should('have.text', '1')
})

it('when the decrement button is pressed, the counter is decremented', () => {
  // Arrange
  cy.mount(Stepper)
  // Act
  cy.get(decrementSelector).click()
  // Assert
  cy.get(counterSelector).should('have.text', '-1')
})
```

2. A continuación, ejecute el comportamiento del `Stepper` como lo haría un usuario. Hay duplicación de cobertura aquí, pero está bien porque ejercita el componente en un uso más real. Es más probable que esta prueba falle si hay algún problema en el componente, no solo con botones específicos o el texto representado.

📃`Stepper.cy.js`
```js
it('when clicking increment and decrement buttons, the counter is changed as expected', () => {
  cy.mount(Stepper, { props: { initial: 100 } })
  cy.get(counterSelector).should('have.text', '100')
  cy.get(incrementSelector).click()
  cy.get(counterSelector).should('have.text', '101')
  cy.get(decrementSelector).click().click()
  cy.get(counterSelector).should('have.text', '99')
})
```

## Aprende Más

La guía [Introducción a Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress) profundiza en cómo escribir pruebas con Cypress.

## ¿Qué Sigue?

Vamos a emitir un evento personalizado desde nuestro componente `Stepper` y aprenderemos cómo probar que fue llamado.
