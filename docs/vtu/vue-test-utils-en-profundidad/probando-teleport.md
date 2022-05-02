# Probando Teleport

Vue 3 viene con un nuevo componente integrado: `<Teleport>`, que permite a los componentes "teleport" su contenido mucho más allá de su propio `<template>`. La mayoría de las pruebas escritas con Vue Test Utils tienen como alcance el componente pasado a `mount`, lo que presenta cierta complejidad cuando se trata de probar un componente que se teletransporta fuera del componente donde se representa inicialmente.

Aquí hay algunas estrategias y técnicas para probar componentes usando `<Teleport>`.

:::tip CONSEJO
Si desea probar el resto de su componente, ignorando el teletransporte, puede bloquear el `teleport` pasando `teleport: true` en la [opción global de stubs](https://test-utils.vuejs.org/api/#global-stubs).
:::

## Ejemplo

En este ejemplo estamos probando un componente `<Navbar>`. Representa un componente `<Signup>` dentro de un `<Teleport>`. El accesorio de destino de `<Teleport>` es un elemento ubicado fuera del componente `<Navbar>`.

Este es el componente `Navbar.vue`:

```vue
<template>
  <Teleport to="#modal">
    <Signup />
  </Teleport>
</template>

<script>
import Signup from '@/Signup.vue'

export default {
  components: {
    Signup
  }
}
</script>
```
Simplemente teletransporta un `<Signup>` a otro lugar. Es simple para el propósito de este ejemplo.

`Signup.vue` es un formulario que valida si `username` tiene más de 8 caracteres. Si es así, cuando se envía, emite un evento de `signup` con el `username` como carga útil. Probar eso será nuestro objetivo.

## Montando el Componente

Comenzando con una prueba mínima:

```js
import { mount } from '@vue/test-utils'
import Navbar from '@/Navbar.vue'
import Signup from '@/Signup.vue'

test('emits a signup event when valid', async () => {
  const wrapper = mount(Navbar)
})
```

Ejecutar esta prueba le dará una advertencia: `[Vue warn]: Failed to locate Teleport target with selector "#modal"`. Vamos a crearlo:

```js{5,6,7,8,9,10,11,12,13,14,15,16}
import { mount } from '@vue/test-utils'
import Navbar from '@/Navbar.vue'
import Signup from '@/Signup.vue'

beforeEach(() => {
  // create teleport target
  const el = document.createElement('div')
  el.id = 'modal'
  document.body.appendChild(el)
})

afterEach(() => {
  // clean up
  document.body.outerHTML = ''
})

test('emits a signup event when valid', async () => {
  const wrapper = mount(Navbar)
})
```
Estamos usando Vitest para este ejemplo, que no restablece el DOM en cada prueba. Por esta razón, es bueno limpiar después de cada prueba con `afterEach`.

## Interactuando con el Componente Teletransportado

Lo siguiente que debe hacer es completar la entrada de `username`. Desafortunadamente, no podemos usar `wrapper.find('input')`. ¿Por qué no? Un rápido `console.log(wrapper.html())`:

```js{3}
test('emits a signup event when valid', async () => {
  const wrapper = mount(Navbar)
  console.log(wrapper.html())
})
```
Nos muestra:
```html
<!--teleport start-->
<!--teleport end-->
```
Vemos algunos comentarios utilizados por Vue para manejar `<Teleport>`, pero no `<input>`. Esto se debe a que el componente `<Signup>` (y su HTML) ya no se representa dentro de <`Navbar>`: se teletransportó al exterior.

Aunque el HTML real se teletransporta al exterior, resulta que el DOM virtual asociado con `<Navbar>` mantiene una referencia al componente original. Esto significa que puede usar `getComponent` y `findComponent`, que operan en el DOM virtual, no en el DOM normal.

```js{12}
beforeEach(() => {
  // ...
})

afterEach(() => {
  // ...
})

test('teleport', async () => {
  const wrapper = mount(Navbar)

  wrapper.getComponent(Signup) // got it!
})
```
`getComponent` devuelve un VueWrapper. Ahora puede usar métodos como `get`, `find` y `trigger`.

Terminemos la prueba:

```js{4,5,6,7,8,9}
test('teleport', async () => {
  const wrapper = mount(Navbar)

  const signup = wrapper.getComponent(Signup)
  await signup.get('input').setValue('valid_username')
  await signup.get('form').trigger('submit.prevent')

  expect(signup.emitted().signup[0]).toEqual(['valid_username'])
})
```
¡Pasó!

La prueba completa:
```js
import { mount } from '@vue/test-utils'
import Navbar from '@/Navbar.vue'
import Signup from '@/Signup.vue'

beforeEach(() => {
  // create teleport target
  const el = document.createElement('div')
  el.id = 'modal'
  document.body.appendChild(el)
})

afterEach(() => {
  // clean up
  document.body.outerHTML = ''
})

test('emits a signup event when valid', async () => {
  const wrapper = mount(Navbar)
  
  const signup = wrapper.getComponent(Signup)
  await signup.get('input').setValue('valid_username')
  await signup.get('form').trigger('submit.prevent')

  expect(signup.emitted().signup[0]).toEqual(['valid_username'])
})
```

## Conclusión

- Crea un _teleport target_ con `document.createElement`.
- Encuentre componentes teletransportados usando `getComponent` o `findComponent` que operan en el nivel de Virtual DOM.
