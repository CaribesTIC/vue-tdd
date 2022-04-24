# Instancia de Componente

`mount` devuelve un `VueWrapper` con muchos métodos convenientes para probar los componentes de Vue. A veces, es posible que desee acceder a la instancia subyacente de Vue. Puede acceder a eso con la propiedad `vm`.

## Un Ejemplo Simple

Aquí hay un componente simple que combina accesorios y datos para representar un saludo:

```js
import { mount } from '@vue/test-utils'

test('renders a greeting', () => {
  const Comp = {
    template: `<div>{{ msg1 }} {{ msg2 }}</div>`,
    props: ['msg1'],
    data() {
      return {
        msg2: 'world'
      }
    }
  }

  const wrapper = mount(Comp, {
    props: {
      msg1: 'hello'
    }
  })
  
  // console.log(wrapper.vm)

  expect(wrapper.html()).toContain('hello world')
})
```
Echemos un vistazo a lo que está disponible en `vm` con `console.log(wrapper.vm)`:

```
{
  msg1: [Getter/Setter],
  msg2: [Getter/Setter],
  hasOwnProperty: [Function]
}
```
¡Podemos ver tanto `msg1` como `msg2`! También se mostrarán cosas como `methods` y propiedades `computed`, si están definidas. Al escribir una prueba, si bien generalmente se recomienda afirmar contra el DOM (usando algo como `wrapper.html()`), en algunas circunstancias excepcionales es posible que necesite acceso a la instancia de Vue subyacente.

## Uso con `getComponent` y `findComponent`

`getComponent` y `findComponent` devuelven un `VueWrapper`, muy parecido al que se obtiene de `mount`. Esto significa que también puede acceder a las mismas propiedades, incluida `vm`, en el resultado de `getComponent` o `findComponent`.

Aquí hay un ejemplo simple:

```js
import { mount } from '@vue/test-utils'

test('asserts correct props are passed', () => {
  const Foo = {
    props: ['msg'],
    template: `<div>{{ msg }}</div>`
  }

  const Comp = {
    components: { Foo },
    template: `<div><foo msg="hello world" /></div>`
  }

  const wrapper = mount(Comp)

  expect(wrapper.getComponent(Foo).vm.msg).toBe('hello world')
  expect(wrapper.getComponent(Foo).props()).toEqual({ msg: 'hello world' })
})
```
Una forma más completa de probar esto sería afirmar contra el contenido renderizado. Hacer esto significa que afirma que se pasa _y_ se procesa la propiedad correcta.

:::tip CONSEJO
Nota: si está utilizando un componente `<script setup>`, `vm` no estará disponible. Esto se debe a que los componentes de `<script setup>` están cerrados [de forma predeterminada](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md#exposing-components-public-interface). Para estos componentes, y en general, considere evitar `vm` y afirmar contra el marcado renderizado.
:::

::: warning ADVERTENCIA
Tipo WrapperLike cuando se usa el selector CSS

Al usar `wrapper.findComponent('.foo')`, por ejemplo, VTU devolverá el tipo `WrapperLike`. Esto se debe a que los componentes funcionales necesitarían un `DOMWrapper`, de lo contrario, un `VueWrapper`. Puede forzar la devolución de un `VueWrapper` proporcionando el tipo de componente correcto:
```ts
wrapper.findComponent('.foo') // returns WrapperLike
wrapper.findComponent<typeof FooComponent>('.foo') // returns VueWrapper
wrapper.findComponent<DefineComponent>('.foo') // returns VueWrapper
```
:::
## Conclusión

- Use `vm` para acceder a la instancia interna de Vue
- `getComponent` y `findComponent` devuelven un contenedor Vue. Esas instancias de Vue también están disponibles a través de `vm`
