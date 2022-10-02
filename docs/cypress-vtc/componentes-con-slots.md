# Componentes con Solts

Los _**slots**_ son una de las características de lenguaje más poderosas en Vue. Con la capacidad de definir contenido alternativo, _**slots**_ con nombre y _**slots**_ con alcance. Permiten que los componentes principales inyecten su marcado, estilos y comportamiento.

Al igual que las _**props**_ y los _**events**_, los _**slots**_ son parte de la API pública del componente.

Los componentes comunes, como los _**Buttons**_ y los _**Inputs**_, a menudo usan _**slots**_ como "prefijo" y "sufijo" para permitirle definir la ubicación de los íconos y usar SVG o componentes de íconos completos.

Los componentes de diseño a nivel de página, como el _**Sidebar**_ o el _**Footer**_, también suelen utilizar _**slots**_.

Por último, los componentes sin representación, como un componente _**Loading**_ o un componente _**ApolloQuery**_, hacen un uso intensivo de los _**slots**_ para definir qué renderizar en varios estados como: _error_, _loading_, y _success_.


## El _stot_ más simple

Mostraremos cómo probar un Modal que usa un `<slot/>` predeterminado. Al igual que en las secciones anteriores, comenzaremos de manera simple.

📃`MySlot.vue`
```vue
<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <div class="overlay" v-if="show">
    <div class="modal">
      <button @click="show = !show">Close</button>
      <slot />
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
}
</style>
```

<div style="position: relative; display: flex; justify-content: center; align-items: center; background: rgba(0, 0, 0, 0.2); width: 400px; height: 320px;">
  <div style="padding: 10px; position: absolute; background: white; border-radius: 3px; min-height: 300px; min-width: 350px; margin: 0px auto;">
    <div>
      Modal's body content (passed in via slot)
    </div>
  </div>
</div>

📃`MySlot.cy.js`
```js
import Modal from '../Modal.vue'

const modalSelector = '.modal'

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
      .get(modalSelector)
      .should('have.contain', 'Close')
      .click()
      // Repeat the assertion to make sure the text
      // is no longer visible
      .get(modalSelector)
      .should('have.contain', '')
  })
})
```

