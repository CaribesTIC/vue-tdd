# Probando Propiedades

## Establecer Propiedades

Las `props` se pueden usar tanto `mount` como `shallowMount`. A menudo se usa para probar componentes que reciben propiedades de su componente principal.

`props` se pasa al segundo argumento de `shallowMount` o `mount`, de la siguiente forma:

```js
const wrapper = mount(Foo, {
  props: {
    foo: 'bar'
  }
})
```
## Creando el componente

Cree un componente `<SubmitButton>` simple que tenga dos propiedades: `msg` e `isAdmin`. Según el valor de la propiedad `isAdmin`, este componente contendrá un `<span>` en uno de dos estados:

- No autorizado si `isAdmin` es falso (o no se pasa como propiedad)
- Privilegios de administrador si `isAdmin` es verdadero

## La Primera Prueba

Haremos una afirmación en el mensaje en caso de que el usuario no tenga privilegios de administrador.

```js
import { mount } from '@vue/test-utils'
import SubmitButton from '@/components/SubmitButton.vue'

describe('SubmitButton.vue', () => {
  it("displays a non authorized message", () => {
    const msg = "submit"
    const wrapper = mount(SubmitButton,{
      props: {
        msg: msg
      }
    })

    console.log(wrapper.html())

    expect(wrapper.find("span").text()).toBe("Not Authorized")
    expect(wrapper.find("button").text()).toBe("submit")
  })
})
```
Al ejecute las pruebas, el resultado será:

```sh
PASS  tests/unit/SubmitButton.spec.js
  SubmitButton.vue
    ✓ displays a non authorized message (15ms)
```

El resultado de `console.log(wrapper.html())` también se imprime:

```html
<div>
  <span>Not Authorized</span>
  <button>
    submit
  </button>
</div>
```

Podemos ver que la propiedad `msg` se procesa y el marcado resultante se renderiza correctamente.

## Una Segunda Prueba.

Hagamos una afirmación sobre el otro estado posible, cuando `isAdmin` es `true`:

```js
import { mount } from '@vue/test-utils'
import SubmitButton from '@/components/SubmitButton.vue'

describe('SubmitButton.vue', () => { 
  it('displays a admin privileges message', () => {
    const msg = "submit"
    const isAdmin = true
    const wrapper = mount(SubmitButton,{
      props: {
        msg,
        isAdmin
      }
    })

    console.log(wrapper.html())
    
    expect(wrapper.find("span").text()).toBe("Admin Privileges")
    expect(wrapper.find("button").text()).toBe("submit")
  })
})
```
Ejecute la prueba y verifique los resultados:

```sh
PASS  tests/unit/SubmitButton.spec.js
  SubmitButton.vue
    ✓ displays a admin privileges message (4ms)
```
También generamos el marcado con `console.log(wrapper.html())`:

```html
<div>
  <span>Admin Privileges</span>
  <button>
    submit
  </button>
</div>
```
Podemos ver que se usó la propiedad `isAdmin` para renderizar el elemento `<span>` correcto.

## Refactorizando las pruebas

Refactoricemos las pruebas siguiendo el principio _"Don't Repeat Yourself"_ (DRY). Dado que todas las pruebas están pasando, podemos refactorizar con confianza. Mientras todas las pruebas pasen después de la refactorización, podemos estar seguros de que no rompimos nada.

## Refactorizar con una Función de Fábrica

En ambas pruebas, llamamos a `mount` y luego pasamos un objeto `props` similar. Podemos refactorizar esto usando una función de fábrica. Una función de fábrica es simplemente una función que devuelve un objeto: _crea_ objetos, de ahí el nombre de función de "fábrica".

```js
const msg = "submit"
const factory = (props) => {
  return mount(SubmitButton, {
    props: {
      msg,
      ...props
    }
  })
}
```

Lo anterior es una función que montará un componente `SubmitButton`. Podemos pasar cualquier propiedad para cambiar como primer argumento a la fábrica. Vamos a _DRY up_ la prueba con la función de fábrica.

```js
import { mount } from '@vue/test-utils'
import SubmitButton from '@/components/SubmitButton.vue'

const msg = "submit"
const factory = (props) => {
  // omitted for brevity ...
}

describe("SubmitButton", () => {
  describe("does not have admin privileges", ()=> {
    it("renders a message", () => {
      const wrapper = factory()

      expect(wrapper.find("span").text()).toBe("Not Authorized")
      expect(wrapper.find("button").text()).toBe("submit")
    })
  })

  describe("has admin privileges", ()=> {
    it("renders a message", () => {
      const wrapper = factory({ isAdmin: true })

      expect(wrapper.find("span").text()).toBe("Admin Privileges")
      expect(wrapper.find("button").text()).toBe("submit")
    })
  })
})
```
Hagamos las pruebas de nuevo. Todo sigue pasando.

```sh
PASS  tests/unit/SubmitButton.spec.js
 SubmitButton
   has admin privileges
     ✓ renders a message (26ms)
   does not have admin privileges
     ✓ renders a message (3ms)
```
Como tenemos un buen conjunto de pruebas, ahora podemos refactorizar con facilidad y confianza.

## Conclusión

- Al pasar `props` al montar un componente, puede establecer las `props` que se utilizarán en la prueba
- Las funciones de fábrica se pueden usar para _DRY sus pruebas
- En lugar de `props`, también puedes usar [`setProps`](https://test-utils.vuejs.org/api/#setprops) para establecer valores de propiedades durante las pruebas
