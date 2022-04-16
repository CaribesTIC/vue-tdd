# Renderizado Condicional

Vue Test Utils tiene una gama de funciones para renderizar y hacer afirmaciones sobre el estado de un componente, con el objetivo de verificar que se comporta correctamente. Este artículo explorará cómo representar componentes, así como también verificará que estén representando el contenido correctamente.

Este artículo también está disponible como un [video corto](https://www.youtube.com/watch?v=T3CHtGgEFTs&list=PLC2LZCNWKL9ahK1IoODqYxKu5aA9T5IOA&index=15).

## Encontrar elementos

Una de las características más básicas de Vue es la capacidad de insertar y eliminar elementos dinámicamente con `v-if`. Veamos cómo probar un componente que usa `v-if`.
```js
const Nav = {
  template: `
    <nav>
      <a id="profile" href="/profile">My Profile</a>
      <a v-if="admin" id="admin" href="/admin">Admin</a>
    </nav>
  `,
  data() {
    return {
      admin: false
    }
  }
}
```
En el componente `<Nav>`, se muestra un enlace al perfil del usuario. Además, si el valor de `admin` es `true`, revelamos un enlace a la sección de administración. Hay tres escenarios que debemos verificar se están comportando correctamente:

1. Debe mostrarse el enlace `/profile`.
1. Cuando el usuario es administrador, se debe mostrar el enlace `/admin`.
1. Cuando el usuario no es administrador, no se debe mostrar el enlace `/admin`.

## Usando get()

`wrapper` tiene un método `get()` que busca un elemento existente. Utiliza la sintaxis de `querySelector`.

Podemos afirmar el contenido del enlace del perfil usando `get()`:
```js
test('renders a profile link', () => {
  const wrapper = mount(Nav)

  // Here we are implicitly asserting that the
  // element #profile exists.
  const profileLink = wrapper.get('#profile')

  expect(profileLink.text()).toEqual('My Profile')
})
```
Si `get()` no devuelve un elemento que coincida con el selector, generará un error y su prueba fallará. `get()` devuelve un `DOMWrapper` si se encuentra un elemento. Un `DOMWrapper` es un contenedor delgado alrededor del elemento DOM que implementa la [API Wrapper](https://test-utils.vuejs.org/api/#wrapper-methods) - es por eso que podemos hacer `profileLink.text()` y acceder al texto. Puede acceder al elemento sin procesar usando la propiedad de `element`.

Hay otro tipo de contenedor - un `VueWrapper` - que se devuelve desde [`getComponent`](https://test-utils.vuejs.org/api/#getcomponent) que funciona de la misma manera.

## Usando find() y exists()

`get()` funciona asumiendo que los elementos existen y arroja un error cuando no es así. No se recomienda usarlo para afirmar existencia.

Para hacerlo, usamos `find()` y `exist()`. La siguiente prueba afirma que si `admin` es `false` (que es por defecto), el enlace de administración no está presente:
```js
test('does not render an admin link', () => {
  const wrapper = mount(Nav)

  // Using `wrapper.get` would throw and make the test fail.
  expect(wrapper.find('#admin').exists()).toBe(false)
})
```
Tenga en cuenta que estamos llamando a `exist()` en el valor devuelto por `.find()`. `find()`, como `mount()`, también devuelve un `wrapper`. `mount()` tiene algunos métodos adicionales, porque está envolviendo un componente Vue, y `find()` solo devuelve un nodo DOM regular, pero muchos de los métodos se comparten entre ambos. Algunos otros métodos incluyen `classes()`, que obtiene las clases que tiene un nodo DOM, y `trigger()` para simular la interacción del usuario. Puede encontrar una lista de métodos admitidos [aquí](https://test-utils.vuejs.org/api/#wrapper-methods).

## Uso de datos

La prueba final es afirmar que el enlace de administración se representa cuando `admin` es `true`. Es `false` por defecto, pero podemos anularlo usando el segundo argumento de `mount()`, las [opciones de montaje](https://test-utils.vuejs.org/api/).

Para `data`, usamos la opción de `data` con el nombre apropiado:
```js
test('renders an admin link', () => {
  const wrapper = mount(Nav, {
    data() {
      return {
        admin: true
      }
    }
  })

  expect(wrapper.find('#admin').exists()).toBe(true)
  // Again, by using `get()` we are implicitly asserting that
  // the element exists.
  
  expect(wrapper.get('#admin').text()).toEqual('Admin')
})
```
Si tiene otras propiedades en `data` - no se preocupe: Vue Test Utils fusionará las dos. La `data` de las opciones de montaje tendrán prioridad sobre los valores predeterminados.

Para saber qué otras opciones de montaje existen, consulte [Pasando Datos](../esencial/pasando-datos-a-componentes.html) o consulte las [opciones de montaje](https://test-utils.vuejs.org/api/).

## Comprobación de la visibilidad de los elementos

A veces, solo desea ocultar/mostrar un elemento mientras lo mantiene en el DOM. Vue ofrece `v-show` para escenarios como tales. (Puedes comprobar las diferencias entre `v-if` y `v-show` [aquí](https://vuejs.org/guide/essentials/conditional.html#v-if-vs-v-show).

Así es como se ve un componente con `v-show`:
```js
const Nav = {
  template: `
    <nav>
      <a id="user" href="/profile">My Profile</a>
      <ul v-show="shouldShowDropdown" id="user-dropdown">
        <!-- dropdown content -->
      </ul>
    </nav>
  `,
  data() {
    return {
      shouldShowDropdown: false
    }
  }
}
```
En este escenario, el elemento no está visible pero siempre se representa. `get()` o `find()` siempre devolverán un Wrapper – `find()` con `.exists()` siempre devolverá `true` – porque el **elemento aún está en el DOM**.

## Usando isVisible()


`isVisible()` brinda la capacidad de verificar elementos ocultos. En particular, `isVisible()` verificará si:

- un elemento o sus ancestros tienen estilos `display: none`, `visibility: hidden`, `opacity :0` 
- un elemento o sus ancestros se encuentran dentro de la etiqueta `<details>` colapsada
- un elemento o sus ancestros tienen el atributo `hidden`

Para cualquiera de estos casos, `isVisible()` devuelve `false`.

Los escenarios de prueba usando `v-show` se verán así:

```js
test('does not show the user dropdown', () => {
  const wrapper = mount(Nav)

  expect(wrapper.get('#user-dropdown').isVisible()).toBe(false)
})

test('does show the user dropdown', () => {
  const wrapper = mount(Nav,{
    data() {
      return {
        shouldShowDropdown: true
      }
    }
  })

  expect(wrapper.get('#user-dropdown').isVisible()).toBe(true)
})
```
## Conclusión

- Usa `find()` junto con `exist()` para verificar si un elemento está en el DOM.
- Use `get()` si espera que el elemento esté en el DOM.
- La opción de montaje `data` se puede utilizar para establecer valores predeterminados en un componente.
- Usa `get()` con `isVisible()` para verificar la visibilidad de un elemento que está en el DOM

