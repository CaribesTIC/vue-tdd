## Talonando Componentes

Puede encontrar la prueba descrita en esta página [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/ParentWithAPICallChild.spec.js).

¿Por qué talón?

Al escribir pruebas unitarias, a menudo queremos talonar partes del código que no nos interesan. Un talón es simplemente una pieza de código que reemplaza a otra. Supongamos que está escribiendo una prueba para un componente `<UserContainer>`. Se parece a esto:

```html
<UserContainer>
  <UsersDisplay />
</UserContainer>
```

`<UsersDisplay>` tiene un método de ciclo de vida creado como este:

```js
created() {
  axios.get("/users")
}
```

Queremos escribir una prueba que afirme que se renderiza `<UsersDisplay>`.

`axios` está realizando una solicitud ajax a un servicio externo en el gancho `created`. Eso significa que cuando hace `mount(UserContainer)`, `<UsersDisplay>` también se monta y `created` inicia una solicitud ajax. Dado que se trata de una prueba unitaria, solo nos interesa si `<UserContainer>` renderiza correctamente `<UsersDisplay>` - verificar que la solicitud ajax se active con el punto final correcto, etc., es responsabilidad de `<UsersDisplay>`, que debe probarse en archivo de prueba de `<UsersDisplay>`.

Una forma de evitar que `<UsersDisplay>` inicie la solicitud ajax es _talonar_ el componente. Escribamos nuestros propios componentes y pruebas, para obtener una mejor comprensión de las diferentes formas y beneficios de usar talones.

## Creando los componentes

Este ejemplo utilizará dos componentes. El primero es `ParentWithAPICallChild`, que simplemente renderiza otro componente:

```vue
<template>
  <ComponentWithAsyncCall />
</template>

<script>
import ComponentWithAsyncCall from "./ComponentWithAsyncCall.vue"

export default {
  name: "ParentWithAPICallChild",

  components: {
    ComponentWithAsyncCall
  }
}
</script>
```

`<ParentWithAPICallChild>` es un componente simple. Su única responsabilidad es representar `<ComponentWithAsyncCall>`. `<ComponentWithAsyncCall>`, como sugiere el nombre, realiza una llamada ajax utilizando el cliente http `axios`:

```vue
<template>
  <div></div>
</template>

<script>
import axios from "axios"

export default {
  name: "ComponentWithAsyncCall",
  
  created() {
    this.makeApiCall()
  },
  
  methods: {
    async makeApiCall() {
      console.log("Making api call")
      await axios.get("https://jsonplaceholder.typicode.com/posts/1")
    }
  }
}
</script>
```

`<ComponentWithAsyncCall>` llama a `makeApiCall` en el gancho del ciclo de vida `created`.

## Escribir una prueba usando `mount`

Comencemos escribiendo una prueba para verificar que `<ComponentWithAsyncCall>` se renderice. Tenga en cuenta que se utiliza `findComponent`. `find` se usa para consultar elementos DOM y usa la sintaxis `querySelector`. `findComponent` se usa cuando se busca un componente específico, toma un componente como argumento.

```js
import { mount } from '@vue/test-utils'
import ParentWithAPICallChild from '@/components/ParentWithAPICallChild.vue'
import ComponentWithAsyncCall from '@/components/ComponentWithAsyncCall.vue'

describe('ParentWithAPICallChild.vue', () => {
  it('renders with mount and does initialize API call', () => {
    const wrapper = mount(ParentWithAPICallChild)

    expect(wrapper.findComponent(ComponentWithAsyncCall).exists()).toBe(true)
  })  
})
```

Ejecución de prueba:

```
PASS  tests/unit/ParentWithAPICallChild.spec.js

console.log src/components/ComponentWithAsyncCall.vue:17
  Making api call
```

La prueba está pasando, ¡genial! Sin embargo, podemos hacerlo mejor. Observe el `console.log` en la salida de prueba - esto proviene del método `makeApiCall`. Idealmente, no queremos hacer llamadas a servicios externos en nuestras pruebas unitarias, especialmente cuando se trata de un componente que no es el enfoque principal de la prueba actual. Podemos usar la opción de montaje de `stubs`, descrita en los documentos de `vue-test-utils` [aquí](https://test-utils.vuejs.org/migration/#mocks-and-stubs-are-now-in-global).

## Uso de `stubs` para talonar `<ComponentWithAsyncCall>`

Actualicemos la prueba, esta vez agregando `<ComponentWithAsyncCall>`:

```js
it('renders with mount and does initialize API call', () => {
  const wrapper = mount(ParentWithAPICallChild, {
    global: {
      stubs: {
        ComponentWithAsyncCall: true,
      }
    }
  })

  expect(wrapper.findComponent(ComponentWithAsyncCall).exists()).toBe(true)
})
```

La prueba aún pasa cuando se ejecuta, sin embargo, el `console.log` no se ve por ninguna parte. Esto se debe a que pasar `[component]: true` a `stubs` reemplazó el componente original con un _stub_. La interfaz externa sigue siendo la misma (todavía podemos seleccionarla usando `find`, ya que la propiedad de nombre, que `find` usa internamente, sigue siendo la misma). Los métodos internos, como `makeApiCall`, se reemplazan por métodos ficticios que no hacen nada: son "talonados".

También puede especificar el marcado que se usará para el talón, si lo desea:

```js
const wrapper = mount(ParentWithAPICallChild, {
  stubs: {
    ComponentWithAsyncCall: "<div class='stub'></div>"
  }
})
```

## Talonado automático con `shallowMount`

En lugar de usar `mount` y manualmente talonar `<ComponentWithAsyncCall>`, simplemente podemos usar `shallowMount`, que automáticamente crea talones para cualquier otro componente de forma predeterminada. La prueba con `shallowMount` se ve así:

```js{1,21,22,23,24,25}
import { shallowMount, mount } from '@vue/test-utils';
import ParentWithAPICallChild from '@/components/ParentWithAPICallChild.vue';
import ComponentWithAsyncCall from '@/components/ComponentWithAsyncCall.vue';

describe('ParentWithAPICallChild.vue', () => {

  it('renders with mount and does initialize API call', () => {
    const wrapper = mount(ParentWithAPICallChild, {
      global: {
        stubs: {
          ComponentWithAsyncCall: true,
          //ComponentWithAsyncCall: "<div class='stub'></div>"
        }
      }
    })

    expect(wrapper.findComponent(ComponentWithAsyncCall).exists()).toBe(true)
  })

  it('renders with shallowMount and does not initialize API call', () => {
    const wrapper = shallowMount(ParentWithAPICallChild)

    expect(wrapper.findComponent(ComponentWithAsyncCall).exists()).toBe(true)
  })
})
```

Al ejecutar la prueba no muestra ningún `console.log` y la prueba pasa. `superficialMount` automáticamente talona `<ComponentWithAsyncCall>`. `superficialMount` es útil para probar componentes que tienen muchos componentes secundarios, que pueden tener un comportamiento desencadenado en enlaces de ciclo de vida, como `created` o `mounted`, etc. Tiendo a usar `mount` de forma predeterminada, a menos que tenga una buena razón para usar `superficialMount`. Depende de su caso de uso y de lo que esté probando. Intente hacer lo que sea más parecido a cómo se utilizarán sus componentes en la producción.

## Conclusión

- `stubs` es útil para talonar el comportamiento de los componentes secundarios que no está relacionados con la prueba unitaria actual
- `superficialMount` talona los componentes secundarios de forma predeterminada.
- Puede pasar `true` para crear un talón predeterminado o pasar su propia implementación personalizada

Puede encontrar la prueba descrita en esta página [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/ParentWithAPICallChild.spec.js).
