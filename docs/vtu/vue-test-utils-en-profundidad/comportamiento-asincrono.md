# Comportamiento Asíncrono

You may have noticed some other parts of the guide using await when calling some methods on wrapper, such as trigger and setValue. What's that all about?

Es posible que haya notado que otras partes de la guía usan `await` al llamar a algunos métodos en el `wrapper`, como `trigger` y `setValue`.  ¿De qué trata todo eso?

Es posible que sepa que Vue se actualiza de forma reactiva: cuando cambia un valor, el DOM se actualiza automáticamente para reflejar el valor más reciente. [Vue realiza estas actualizaciones de forma asíncrona](https://vuejs.org/#async-update-queue). Por el contrario, un corredor de prueba como Vitest se ejecuta sincrónicamente. Esto puede causar algunos resultados sorprendentes en las pruebas.

Veamos algunas estrategias para garantizar que Vue actualice el DOM como se esperaba cuando ejecutemos nuestras pruebas.

## Un Ejemplo Simple: Actualización con `trigger`

Reutilicemos el componente `<Counter>` del [manejo de eventos](../esencial/manejo-de-eventos.html) con un cambio; ahora renderizamos el `count` en el `template`.

```js
const Counter = {
  template: `
    <p>Count: {{ count }}</p>
    <button @click="handleClick">Increment</button>
  `,
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count += 1
    }
  }
}
```
Escribamos una prueba para verificar que el `count` está aumentando:

```js
import { mount } from '@vue/test-utils'

test('increments by 1', () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')

  expect(wrapper.html()).toContain('Count: 1')
})
```
¡Sorprendentemente, esto falla! La razón es que, aunque el `count` aumenta, Vue no actualizará el DOM hasta el siguiente ciclo de eventos. Por esta razón, se llamará a la afirmación (`expect()...`) antes de que Vue actualice el DOM.

::: tip CONSEJO
Si desea obtener más información sobre este comportamiento básico de JavaScript, lea sobre [Event Loop y sus macrotareas y microtareas](https://javascript.info/event-loop#macrotasks-and-microtasks).
:::

Dejando a un lado los detalles de implementación, ¿cómo podemos solucionar esto? Vue en realidad nos proporciona una forma de esperar hasta que se actualice el DOM: `nextTick`.

```js{2,8}
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

test('increments by 1', async () => {
  const wrapper = mount(Counter)

  wrapper.find('button').trigger('click')
  await nextTick()

  expect(wrapper.html()).toContain('Count: 1')
})
```
Ahora la prueba pasará porque nos aseguramos de que se haya ejecutado el siguiente "tick" y que el DOM se haya actualizado antes de que se ejecute la afirmación.

Dado que `await nextTick()` es común, Vue Test Utils proporciona un atajo. Los métodos que hacen que el DOM se actualice, como `trigger` y `setValue`, devuelven `nextTick`, por lo que puede esperarlos usando `await` directamente:

```js{6}
import { mount } from '@vue/test-utils'

test('increments by 1', async () => {
  const wrapper = mount(Counter)

  await wrapper.find('button').trigger('click')

  expect(wrapper.html()).toContain('Count: 1')
})
```
## Resolución de Otros Comportamientos Asíncronos

`nextTick` es útil para garantizar que algún cambio en los datos reactivos se refleje en el DOM antes de continuar con la prueba. Sin embargo, a veces es posible que desee asegurarse de que también se completen otros comportamientos asíncronos no relacionados con Vue.

Un ejemplo común es una función que devuelve una `Promise`. Tal vez te burlaste de tu cliente HTTP `axios` usando `vi.fn()`:

```js
axios.get = vi.fn().mockResolvedValue({ data: 'some mocked data!' })
```
En este caso, Vue no tiene conocimiento de la Promesa no resuelta, por lo que llamar a `nextTick` no funcionará; su afirmación puede ejecutarse antes de que se resuelva. Para escenarios como este, Vue Test Utils expone `flushPromises`, lo que hace que todas las promesas pendientes se resuelvan de inmediato.

Veamos un ejemplo:
```js{1,14,15,21}
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'

const AxiosComponent = {
  template: '<div>{{ data }}</div>',
  data() {
    return { data: '' }
  },
  async mounted() {
     this.data = await axios.get('/data.json').then(resp => resp.data);
  }
}

axios.get = vi.fn().mockResolvedValue({ data: 'some mocked data!' })

test('uses a mocked axios HTTP client and flushPromises', async () => {
  // some component that makes a HTTP called in `mounted` using `axios`
  const wrapper = mount(AxiosComponent)

  await flushPromises() // axios promise is resolved immediately
  
  // after the line above, axios request has resolved with the mocked data.    
  expect(wrapper.get('div').text()).toEqual('some mocked data!')  
})
```
::: tip CONSEJO
Si desea obtener más información sobre cómo probar solicitudes en componentes, asegúrese de consultar la guía [Realizando Solicitudes HTTP](../vue-test-utils-en-profundidad/solicitudes-http).
:::

## Prueba de `setup` asíncrono

Si el componente que desea probar utiliza un `setup` asíncrono, debe montar el componente dentro de un componente `Suspense` (como lo hace cuando lo usa en su aplicación).

Por ejemplo, este componente `Async`:
```js{3}
const Async = defineComponent({
  template: '<div>{{ data }}</div>',
  async setup() { // await something
    const data = ref('')
    onMounted(async () => {
      data.value = await axios.get('/data.json').then(resp => resp.data)
    })
    return {
      data
    }
  }
})
```
debe probarse de la siguiente manera:

```js{7,8,9,10,11,12,13,14}
import { defineComponent, ref, onMounted } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'

axios.get = vi.fn().mockResolvedValue({ data: 'some mocked data!' })

test('Async component', async () => {
  const TestComponent = defineComponent({
    components: { Async },
    template: '<Suspense><Async/></Suspense>'
  })

  const wrapper = mount(TestComponent) // ...
    
  await flushPromises()

  await expect(wrapper.get('div').text()).toEqual('some mocked data!')  
})
```

## Conclusión

- Vue actualiza el DOM de forma asíncrona; En su lugar, el corredor de pruebas ejecuta el código de forma síncrona.
- Use `await nextTick()` para asegurarse de que el DOM se haya actualizado antes de que continúe la prueba.
- Las funciones que podrían actualizar el DOM (como `trigger` y `setValue`) devuelven `nextTick`, por lo que debe esperarlos con `await`.
- Use `flushPromises` de Vue Test Utils para resolver cualquier promesa no resuelta de dependencias que no sean de Vue (como solicitudes de API).
- Utilice `Suspense` para probar componentes con un `setup` asíncrono.
