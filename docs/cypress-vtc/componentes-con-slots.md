# Componentes con Solts

Los _**slots**_ son una de las características de lenguaje más poderosas en Vue. Con la capacidad de definir contenido alternativo, _**slots**_ con nombre y _**slots**_ con alcance. Permiten que los componentes principales inyecten su marcado, estilos y comportamiento.

Al igual que las _**props**_ y los _**events**_, los _**slots**_ son parte de la API pública del componente.

Los componentes comunes, como los _**Buttons**_ y los _**Inputs**_, a menudo usan _**slots**_ como "prefijo" y "sufijo" para permitirle definir la ubicación de los íconos y usar SVG o componentes de íconos completos.

Los componentes de diseño a nivel de página, como el _**Sidebar**_ o el _**Footer**_, también suelen utilizar _**slots**_.

Por último, los componentes sin representación, como un componente _**Loading**_ o un componente _**ApolloQuery**_, hacen un uso intensivo de los _**slots**_ para definir qué renderizar en varios estados como: _error_, _loading_, y _success_.


## El Stot Más Simple

Mostraremos cómo probar un Modal que usa un `<slot/>` predeterminado. Al igual que en las secciones anteriores, comenzaremos de manera simple.

📃`Modal.vue`
```vue
<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <div class="overlay">
    <div class="modal" v-if="show">
      <button @click="show = !show">Close</button>
      <slot  />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  display: flex;
  padding-top: 120px;
  justify-content: center;
  background: rgba(100, 100, 100, 30%);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.modal {
  position: absolute;
  min-height: 350px;
  min-width: 400px;
  background: white;
  color: black;
}
</style>
```

<div style="color: #424949; position: relative; display: flex; justify-content: center; align-items: center; background: rgba(0, 0, 0, 0.2); width: 400px; height: 320px;">
  <div style="padding: 10px; position: absolute; background: white; border-radius: 3px; min-height: 300px; min-width: 350px; margin: 0px auto;">
    <div>
      Modal's body content (passed in via slot)
    </div>
  </div>
</div>

📃`Modal.cy.js`
```js
import Modal from '../Modal.vue'

const modalSelector = '.overlay'
const closeButtonSelector = 'button'

describe('<Modal>', () => { 
  it('renders the modal content', () => {
    cy.mount(Modal, { slots: { default: () => 'Content' } })
      .get(modalSelector)
      .should('have.contain', 'Content')
  })

  it('can be closed', () => {
    cy.mount(Modal, { slots: { default: () => 'Content' } })
      .get(modalSelector)
      .should('have.contain', 'Content')
      .get(closeButtonSelector)
      .should('have.contain', 'Close')
      .click()
      // Repeat the assertion to make sure the text
      // is no longer visible
      .get(modalSelector)      
      .should('not.have.contain', 'Content')
  })
})
```
:::info
Si desea consultar el mismo ejemplo de esta prueba con JSX o del mismo componente con la Options API, puede buscar en la [Documentación Oficial de Cypress](https://docs.cypress.io/guides/component-testing/slots-vue#The-Simplest-Slot).
:::

## Slots Nombrados

Las ranuras con nombre en Vue le dan al componente principal la capacidad de inyectar diferentes marcas y lógica del padre en los componentes del contenedor.

En el caso de nuestro modal, el modal podría definir un encabezado, un pie de página y un cuerpo denominado slot.

Todo esto es parte de la API del componente y ejercerlo a fondo es responsabilidad de la prueba.

<div style="color: #424949; position: relative; display: flex; justify-content: center; align-items: center; background: rgba(0, 0, 0, 0.2); width: 400px; height: 320px;">
  <div style="padding: 10px; position: absolute; display: flex; flex-direction: column; background: white; border-radius: 3px; min-height: 300px; min-width: 350px; margin: 0px auto;">
    <div style="font-size: 1.25rem;">Header Content</div>
    <hr>
    <div style="flex-grow: 1;">
      Modal's body content (passed in via slot)
    </div>
    <hr>
    <div style="bottom: 0px; display: flex; justify-content: space-between; width: 100%;">
    <button>Cancel</button>
    <button>Continue</button>
    </div>
  </div>
</div>

📃`Modal.vue`
```vue
<script setup>
  // omitted for brevity 
</script>

<template>  
  <div class="overlay">
    <div class="modal" v-if="show">
      <div class="header">
        <slot name="header" />
      </div>
      <hr/>
      <div class="content">
        <slot/>
      </div>
      <hr/>
      <div class="footer">
        <slot name="footer">
          <button @click="show = !show">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* omitted for brevity */
</style>
```

📃`Modal.cy.js`
```js
import Modal from '../Modal.vue'

const modalSelector = '.overlay'
const closeButtonSelector = 'button'
  
const footerText = 'My Custom Footer'
const headerText = 'My Custom Header'

const slots = {
  default: () => 'Content',
  footer: () => footerText,
  header: () => headerText
}
  
describe('<Modal>', () => {
  it('renders the default modal content', () => {
    cy.mount(Modal, { slots })
      .get(modalSelector).should('have.contain', 'Content')
  })

  it('renders a custom footer', () => {
    const footerText = 'My Custom Footer'  
    cy.mount(Modal, { slots })
      .get(modalSelector).should('have.contain', 'Content')
      .and('have.contain', footerText)
  })

  it('renders a custom header', () => {
    const headerText = 'My Custom Header'
    cy.mount(Modal, { slots })
      .get(modalSelector).should('have.contain', 'Content')
      .and('have.contain', headerText)
  })

  it('renders the fallback "Close" button when no footer is provided', () => {
    cy.mount(Modal, {
      slots: {
        default: () => 'Content',
        header: () => headerText
      }
    })
      .get(modalSelector).should('have.contain', 'Content')
      .get(closeButtonSelector)
      .should('have.contain', 'Close').click()
      // Repeat the assertion to make sure the text
      // is no longer visible
      .get(modalSelector).should('not.have.contain', 'Content')
  })
})
```

:::info
Si desea consultar el mismo ejemplo de esta prueba con JSX o del mismo componente con la Options API, puede buscar en la [Documentación Oficial de Cypress](https://docs.cypress.io/guides/component-testing/slots-vue#Named-Slots).
:::

## Alcance del Slot

Ahora, ¿qué pasa si queremos permitir que el padre controle cuándo cerrar el modal? Podemos proporcionar una propiedad de **_slot_**, una función llamada cerca de cualquiera de los _**slots**_ que queramos.

La implementación de nuestro modal cambiará ligeramente y solo tenemos que mostrar la plantilla para demostrar el cambio.

📃`Modal.vue`
```vue
<script setup>
// omitted for brevity
const onClose = () => show.value = !show.value
</script>

<template>
  <div class="overlay">
    <div class="modal" v-if="show">
      <div class="header">
        <slot name="header" :close="onClose" />
      </div>
      <hr/>
      <div class="content">
        <slot :close="onClose"/>
      </div>
      <hr/>
      <div class="footer">
        <slot name="footer" :close="onClose" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* omitted for brevity */
</style>
```

¡Ahora aquí, podemos escribir algunas pruebas nuevas! Cada uno de nuestros componentes principales debería poder utilizar el método y asegurarse de que esté conectado correctamente. Importaremos `h` desde Vue para crear nodos virtuales reales para que podamos interactuar con ellos desde _fuera_ de la prueba.

📃`Modal.cy.js`
```js
import Modal from '../Modal.vue'
import { h } from 'vue'

const modalSelector = '.modal'
const footerSelector = '[data-testid=footer-close]'
const headerSelector = '[data-testid=header-close]'
const contentSelector = '[data-testid=content-close]'
const text = 'Close me!'

const slots = {
  footer: ({ close }) => h('div', { onClick: close , 'data-testid': 'footer-close' }, text ),
  header: ({ close }) => h('div', { onClick: close, 'data-testid': 'header-close' }, text ),
  default: ({ close }) => h('div', { onClick: close, 'data-testid': 'content-close' }, text ),
}

describe('<Modal>', () => {
  it('The footer slot binds the close method', () => {
    cy.mount(Modal, { slots })
      .get(footerSelector).should('have.text', text)
      .click()
      .get(modalSelector).should('not.exist')
  })

  it('The header slot binds the close method', () => {
    cy.mount(Modal, { slots })
      .get(headerSelector).should('have.text', text)
      .click()
      .get(modalSelector).should('not.exist')
  })

  it('The default slot binds the close method', () => {
    cy.mount(Modal, { slots })
      .get(contentSelector).should('have.text', text)
      .click()
      .get(modalSelector).should('not.exist')
  })  
})
```
:::info
Si desea consultar el mismo ejemplo de esta prueba con JSX o del mismo componente con la Options API, puede buscar en la [Documentación Oficial de Cypress](https://docs.cypress.io/guides/component-testing/slots-vue#Scoped-Slots).
:::

## ¿Que Sigue?

Ahora que se siente cómodo montando componentes y afirmando sus _slots_, ¡debe estar listo para probar la mayoría de los componentes con _scoped slots_ y _fallbacks_!

Trabajemos en la configuración de un comando de montaje personalizado para manejar aplicaciones como Vuetify y complementos como Vue Router.
