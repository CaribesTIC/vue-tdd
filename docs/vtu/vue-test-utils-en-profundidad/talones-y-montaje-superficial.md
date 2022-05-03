# Talones y Montaje Superficial

Vue Test Utils proporciona algunas funciones avanzadas para talonar componentes. Un _stub_ es donde reemplazas una implementación existente de un componente personalizado con un componente ficticio que no hace nada en absoluto, lo que puede simplificar una prueba compleja. Veamos un ejemplo.

## Talonando un solo componente hijo

Un ejemplo común es cuando desea probar algo en un componente que aparece muy alto en la jerarquía de componentes.

En este ejemplo, tenemos una `<App>` que muestra un mensaje, así como un componente `FetchDataFromApi` que realiza una llamada a la API y muestra su resultado.

```js
const FetchDataFromApi = {
  name: 'FetchDataFromApi',
  template: `
    <div>{{ result }}</div>
  `,
  async mounted() {
    const res = await axios.get('/api/info')
    this.result = res.data
  },
  data() {
    return {
      result: ''
    }
  }
}

const App = {
  components: {
    FetchDataFromApi
  },
  template: `
    <h1>Welcome to Vue.js 3</h1>
    <fetch-data-from-api />
  `
}
```
No queremos hacer la llamada a la API en esta prueba en particular, solo queremos afirmar que el mensaje se muestra. En este caso, podríamos usar los `stubs`, que aparecen en la opción de montaje `global`.
```js{15,16,17,18}
import { mount } from '@vue/test-utils'

const FetchDataFromApi = {
  // omitted for brevity ...
}

const App = {
  // omitted for brevity ...
}

test('stubs component with custom template', () => {
  const wrapper = mount(App, {
    global: {
      stubs: {
        FetchDataFromApi: {
          template: '<span />'
        }
      }
    }
  })

  console.log(wrapper.html())
  // <h1>Welcome to Vue.js 3</h1><span></span>

  expect(wrapper.html()).toContain('Welcome to Vue.js 3')
})
```
Observe que la plantilla muestra `<span></span>` donde estaba `<fetch-data-from-api />`. Lo reemplazamos con un _stub_ - en este caso, proporcionamos nuestra propia implementación al pasar un `template`.

También puede obtener un resguardo predeterminado, en lugar de proporcionar el suyo propio:

```js{4,5,6}
test('stubs component', () => {
  const wrapper = mount(App, {
    global: {
      stubs: {
        FetchDataFromApi: true
      }
    }
  })

  console.log(wrapper.html())
  /*
    <h1>Welcome to Vue.js 3</h1>
    <fetch-data-from-api-stub></fetch-data-from-api-stub>
  */

  expect(wrapper.html()).toContain('Welcome to Vue.js 3')
})
```
Esto talonará _todos_ los componentes `<FetchDataFromApi />` en todo el árbol de representación, independientemente del nivel en el que aparezcan. Por eso está en la opción de montaje `global`.

:::tip CONSEJO
Para talonar, puede usar la clave en `components` o el nombre de su componente. Si ambos se proporcionan en `global.stubs`, la clave se usará primero.
:::

## Talonar todos los componentes secundarios

A veces, es posible que desee talonar _todos_ los componentes personalizados. Por ejemplo, podría tener un componente como este:

```js
const ComplexComponent = {
  components: { ComplexA, ComplexB, ComplexC },
  template: `
    <h1>Welcome to Vue.js 3</h1>
    <ComplexA />
    <ComplexB />
    <ComplexC />
  `
}
```
Imagina que cada uno de los `<Complex>` hace algo complicado, y solo te interesa probar que `<h1>` está emitiendo el saludo correcto. Podrías hacer algo como:

```js
const wrapper = mount(ComplexComponent, {
  global: {
    stubs: {
      ComplexA: true,
      ComplexB: true,
      ComplexC: true
    }
  }
})
```
Pero eso es muy repetitivo. VTU tiene una opción de montaje superficial que desconectará automáticamente todos los componentes secundarios:
```js{11,12,13}
import { mount } from '@vue/test-utils'

const ComplexA = {/* Simulating complex component */}
const ComplexB = {/* Simulating complex component */}
const ComplexC = {/* Simulating complex component */}
const ComplexComponent = {
  // omitted for brevity ...
}

test('shallow stubs out all child components', () => {
  const wrapper = mount(ComplexComponent, {
    shallow: true
  })

  console.log(wrapper.html())
  /*
    <h1>Welcome to Vue.js 3</h1>
    <complex-a-stub></complex-a-stub>
    <complex-b-stub></complex-b-stub>
    <complex-c-stub></complex-c-stub>
  */
})
```
:::tip CONSEJO
Si usó VTU V1, puede recordar esto como `shallowMount`. Ese método todavía está disponible, es lo mismo que escribir `shallow: true`.
:::

## Talonar todos los componentes secundarios con excepciones

A veces desea talonar _todos_ los componentes personalizados, _excepto_ uno específico. Consideremos un ejemplo:

```js
const ComplexA = {
  template: '<h2>Hello from real component!</h2>'
}

const ComplexComponent = {
  components: { ComplexA, ComplexB, ComplexC },
  template: `
    <h1>Welcome to Vue.js 3</h1>
    <ComplexA />
    <ComplexB />
    <ComplexC />
  `
}
```
Mediante el uso de la opción de montaje `shallow` talonará automáticamente todos los componentes secundarios. Si queremos excluir explícitamente el componente específico, podemos proporcionar su nombre en `stubs` con un valor establecido en `false`.

```js{15,16,17,18}
import { mount } from '@vue/test-utils'

const ComplexA = {
  // omitted for brevity ...
}
const ComplexB = {/* Simulating complex component */}
const ComplexC = {/* Simulating complex component */}
const ComplexComponent = {
  // omitted for brevity ...
}

test('shallow allows opt-out of stubbing specific component', () => {
  const wrapper = mount(ComplexComponent, {
    shallow: true,
    global: {
      stubs: { ComplexA: false }
    }
  })

  console.log(wrapper.html())
  /*
    <h1>Welcome to Vue.js 3</h1>
    <h2>Hello from real component!</h2>
    <complex-b-stub></complex-b-stub>
    <complex-c-stub></complex-c-stub>
  */
})
```
## Talonando un componente asíncrono

En caso de que desee talonar un componente asíncrono, hay dos comportamientos. Por ejemplo, podría tener componentes como este:

```js
// AsyncComponent.js
export default defineComponent({
  name: 'AsyncComponent',
  template: '<span>AsyncComponent</span>'
})
```
El primer comportamiento es usar la clave definida en su componente que carga el componente asíncrono. En este ejemplo, usamos la clave "MyComponent". No es necesario usar `async/await` en el caso de prueba, porque el componente se desconectó antes de resolverse.
```js
import { mount } from '@vue/test-utils'
import { defineComponent, defineAsyncComponent } from "vue"

const App = defineComponent({
  components: {
    MyComponent: defineAsyncComponent(() => import('@/AsyncComponent'))
  },
  template: '<MyComponent/>'
})

test('stubs async component without resolving', () => {
  const wrapper = mount(App, {
    global: {
      stubs: {
        MyComponent: true
      }
    }
  })

  expect(wrapper.html()).toBe('<my-component-stub></my-component-stub>')
})
```
El segundo comportamiento es usar el nombre del componente asíncrono. En este ejemplo, usamos para nombrar "AsyncComponent". Ahora es necesario usar `async/await`, porque el componente asíncrono debe resolverse y luego puede desconectarse con el nombre definido en el componente asíncrono.

**¡Asegúrese de definir un nombre en su componente asíncrono!**

```js
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, defineAsyncComponent } from "vue"

const App = defineComponent({
  components: {    
    AsyncComponent: defineAsyncComponent(() => import('@/AsyncComponent'))
  },
  template: '<AsyncComponent/>'
})

test('stubs async component with resolving', async () => {
  const wrapper = mount(App, {
    global: {
      stubs: {
        AsyncComponent: true
      }
    }
  })

  await flushPromises()

  expect(wrapper.html()).toBe('<async-component-stub></async-component-stub>')
})

```

## Ranuras predeterminadas y `shallow`

Debido a que `shallow` talona todo el contenido de un componente, cualquier `<slot>` no se renderizará cuando se utilice ``shallow``. Si bien esto no es un problema en la mayoría de los casos, hay algunos escenarios en los que esto no es ideal.

```js
const CustomButton = {
  template: `
    <button>
      <slot />
    </button>
  `
}
```
Y podrías usarlo así:
```js
const AnotherApp = {
  props: ['authenticated'],
  components: { CustomButton },
  template: `
    <custom-button>
      <div v-if="authenticated">Log out</div>
      <div v-else>Log in</div>
    </custom-button>
  `
}
```

Si está utilizando `shallow`, la ranura no se renderizará, ya que la función de renderizado en `<custom-button />` está desactivada. ¡Eso significa que no podrá verificar que se represente el texto correcto!

Para este caso de uso, puede usar `config.renderStubDefaultSlot`, que representará el contenido de la ranura predeterminada, incluso cuando se usa `shallow`:

```js{1,13,17}
import { config, mount } from '@vue/test-utils'

const CustomButton = {
  // omitted for brevity ...
}

const AnotherApp = {
  // omitted for brevity ...
}

beforeAll(() => {
  config.renderStubDefaultSlot = true
})

afterAll(() => {
  config.renderStubDefaultSlot = false
})

test('shallow with stubs 1', () => {
  const wrapper = mount(AnotherApp, {
    props: {
      authenticated: true
    },
    shallow: true
  })

  expect(wrapper.html()).toContain('Log out')
})

test('shallow with stubs 2', () => {
  const wrapper = mount(AnotherApp, {
    props: {
      authenticated: false
    },
    shallow: true
  })

  expect(wrapper.html()).toContain('Log in')
})
```
Dado que este comportamiento es global, no `mount` por `mount`, debe recordar habilitarlo/deshabilitarlo antes y después de cada prueba.

:::tip CONSEJO
También puede habilitar esto globalmente importando `config` en su archivo de configuración de prueba y configurando `renderStubDefaultSlot` en `true`. Desafortunadamente, debido a limitaciones técnicas, este comportamiento no se extiende a otras ranuras que no sean la ranura predeterminada.
:::

## `mount`, `shallow` y `stubs`: ¿cuál y cuándo?

Como regla general, **cuanto más se parezcan sus pruebas a la forma en que se usa su software**, más confianza le pueden brindar.

Las pruebas que usan `mount` representarán toda la jerarquía de componentes, que es más cercana a lo que el usuario experimentará en un navegador real.

Por otro lado, las pruebas usando `shallow` se enfocan en un componente específico. `shallow` puede ser útil para probar componentes avanzados en completo aislamiento. Si solo tiene uno o dos componentes que no son relevantes para sus pruebas, considere usar `mount` en combinación con `stubs` en lugar de `shallow`. Cuanto más talones, menos parecida a producción se vuelve su prueba.

Tenga en cuenta que, ya sea que esté realizando un montaje completo o un renderizado superficial, las buenas pruebas se centran en las entradas (`props` e interacción del usuario, como con el `trigger`) y las salidas (los elementos DOM que se renderizan y los eventos), no en los detalles de implementación.

Por lo tanto, independientemente del método de montaje que elija, le sugerimos que tenga en cuenta estas pautas.

## Conclusión

- Uuse `global.stubs` para reemplazar un componente con uno ficticio para simplificar sus pruebas
- Use `shallow: true` (o `shallowMount`) para talonar todos los componentes secundarios
- Use `config.renderStubDefaultSlot` para representar el `<slot>` predeterminado para un componente talonado.
