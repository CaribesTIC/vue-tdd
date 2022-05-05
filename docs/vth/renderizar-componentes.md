# Renderizar Componentes

## Dos formas de renderizar

`vue-test-utils` proporciona dos formas de representar o **montar** un componente: `mount` y `shallowMount`. Un componente montado con cualquiera de estos métodos devuelve un `wrapper`, que es un objeto que contiene el componente Vue, además de algunos métodos útiles para realizar pruebas.

Comencemos con dos componentes simples:

```js
const Child = {
  name: "Child",
  template: "<div>Child component</div>"
}

const Parent = {
  name: "Parent",
  components: { Child },
  template: "<div><child /></div>"
}
```
Comencemos representando `Child` y llamando al método `html` que proporciona `vue-test-utils` para inspeccionar el marcado.

```js
import { mount, shallowMount } from '@vue/test-utils'

const Child = {
  // omitted for brevity ...
}

const Parent = {
  // omitted for brevity ...
}

test('stubs component with custom template', () => {
  const shallowWrapper = shallowMount(Child)
  const mountWrapper = mount(Child)

  console.log(shallowWrapper.html())
  console.log(mountWrapper.html())
})
```

Tanto `mountWrapper.html()` como `smoothWrapper.html()` producen el siguiente resultado:

```html
<div>Child component</div>
```
No hay diferencia aquí. ¿Qué tal con `Parent`?

```js
test('stubs component with custom template', () => {
  const shallowWrapper = shallowMount(Parent)
  const mountWrapper = mount(Parent)

  console.log(shallowWrapper.html())
  console.log(mountWrapper.html())
})
```

`mountWrapper.html()` ahora produce:

```html
<div>
  <div>Child component</div>
</div>
```

Que es el marcado completamente renderizado de `Parent` y `Child`. `shallowWrapper.html()`, por otro lado, produce esto:

```html
<div>
  <child-stub></child-stub>
</div>
```
El lugar donde debería estar `<Child />` ha sido reemplazado por `<child-stub />`. `shallowWrapper` representa elementos html normales, pero reemplaza los componentes de Vue con un _stub_.

>Un _stub_ es una especie de objeto "fake" que sustituye a uno real.

Esto puede ser útil. Imagina que quieres probar tu componente `App.vue`, que se ve así:

```vue
<template>
  <div>
    <h1>My Vue App</h1>
    <fetch-data />
  </div>
</template>
```
Y queremos probar que `<h1>My Vue App</h1>` se representa correctamente. También tenemos un componente `<fetch-data>`, que realiza una solicitud a una API externa en su enlace de ciclo de vida `mounted`.

Si usamos `mount`, aunque todo lo que queremos hacer es asegurar que se represente algún texto, `<fetch-data />` realizará una solicitud de API. Esto hará que nuestra prueba sea lenta y propensa a fallar. Entonces, eliminamos las dependencias externas. Al usar `shallowMount`, `<fetch-data />` se reemplazará con un <fetch-data-stub /> y no se iniciará la llamada a la API.

Como regla general, debe intentar usar `mount`, ya que se parecerá más a sus componentes y cómo aparecerán en un entorno real. Dicho esto, si tiene problemas con la activación de muchas solicitudes de API o con el suministro de las dependencias necesarias para representar su componente, puede usar `shallowMount`.
