# Integración de Vue Test Utils y más ejemplos

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=fi4gwBkryxE&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=8)
:::

Hasta ahora hemos visto las siguientes características de Vue Testing Library:

- Desestructurar lo que devuelve la función `render`.
- Usar el método `screen.getByRole` para encontrar algo de  manera amigable y accesible.
- Personalizar aserciones, por ejemplo `toBeDisabled`.
- Activar eventos como `fireEvent.update`.
- Hacer click en el botón con `fireEvent.click`.
- Afirmar contra eventos emitidos y verificar el envío de la carga útil.

```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button and emit event", async () => {
    // wrapper 
    const { emitted } = render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    await fireEvent.update(
      screen.getByLabelText('Name'), 'John'
    )
            
    expect(button).not.toBeDisabled()

    fireEvent.click(button)

    expect(
      // @ts-ignore
      emitted().submit[0][0]).toEqual({ name: 'John' }
    )
    
  })
})
```

Si desea continuar aprendiendo, hay toneladas de recursos disponibles. [Vue-Testing Library](https://testing-library.com/docs/vue-testing-library/intro) es bastante grande. Por lo que tendrá que revisar y leer la documentación.

Por otro lado, existe dentro de las pruebas del código fuente de Vue Testing Library un [directorio de ejemplos](https://github.com/testing-library/vue-testing-library/tree/main/src/__tests__) donde hay muchas pruebas diferentes que muestran cómo hacer diferentes cosas.


Por ejemplo, el siguiente código trata sobre las pruebas a las directivas `v-if` y `v-else`, que se están usando en el componente [`Disappearance.vue`](https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/components/Disappearance.vue). 

```vue{2,3}
<template>
  <p v-if="loading">Loading...</p>
  <p v-else data-testid="message">
    Loaded this message: {{ data.returnedMessage }}
  </p>
</template>

<script>
const fetchAMessage = () =>
  new Promise(resolve => {
    // we are using random timeout here to fireEvent a real-time example
    // of an async operation calling a callback at a non-deterministic time
    const randomTimeout = Math.floor(Math.random() * 100)
    setTimeout(() => {
      resolve({ returnedMessage: 'Hello World' })
    }, randomTimeout)
  })
export default {
  data() {
    return {
      loading: true,
      data: {
        returnedMessage: null
      }
    }
  },
  async mounted() {
    const data = await fetchAMessage()
    this.loading = false
    this.data = data
  }
}
</script>
```

Veamos [el archivo de prueba](https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/disappearance.js) llamado desaparición, el cual tiene un método muy bueno llamado [`waitForElementToBeRemoved`](https://testing-library.com/docs/dom-testing-library/api-async/#waitforelementtoberemoved).

```js{2,16}
// tests/components/disappearance.spec.js
import { render, waitForElementToBeRemoved } from '@testing-library/vue'
import Disappearance from '@/components/Disappearance.vue'
import '@testing-library/jest-dom'

test('waits for the data to be loaded', async () => {
  const {getByText, queryByText, queryByTestId} = render(Disappearance)

  // Assert initial state
  expect(getByText('Loading...')).toBeInTheDocument()
  expect(queryByText(/Loaded this message/)).not.toBeInTheDocument()

  // Following line reads as follows:
  // "Wait until element with text 'Loading...' is gone."
  await waitForElementToBeRemoved(queryByText('Loading...'))
  // It is equivalent to:
  //
  // await waitFor(() => {
  //   expect(queryByText('Loading...')).not.toBeInTheDocument()
  // })

  // After 'Loading...' is gone, we can assert that fetched data is rendered.
  expect(queryByTestId('message')).toHaveTextContent(/Hello World/)

  // Read more about async utilities:
  // https://testing-library.com/docs/dom-testing-library/api-async
})
```
Esta es una muy buena manera de esperar a que se elimine un elemento con `v-if`. Es muy legible y expresivo.

Otra prueba bastante interesante es esta llamada [fire-event](https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/fire-event.js), la cual muestra cómo hacer todos los diferentes tipos de eventos que nos gustaría disparar.

```js
// tests/components/fire-event.spec.js
import {h} from 'vue'
import {render, fireEvent} from '@testing-library/vue'
import Button from '@/components/Button.vue'

const eventTypes = [
  {
    type: 'Clipboard',
    events: ['copy', 'cut', 'paste'],
  },
  {
    type: 'Composition',
    events: ['compositionEnd', 'compositionStart', 'compositionUpdate'],
  },
  {
    type: 'Keyboard',
    events: ['keyDown', 'keyPress', 'keyUp'],
    init: {keyCode: 13},
  },
  {
    type: 'Focus',
    events: ['focus', 'blur', 'focusIn', 'focusOut'],
  },
  {
    type: 'Focus',
    events: ['submit'],
    elementType: 'form',
  },
  {
    type: 'Form',
    events: ['change', 'input', 'invalid', 'submit', 'reset'],
  },
  {
    type: 'Mouse',
    events: [
      'click',
      'contextMenu',
      'drag',
      'dragEnd',
      'dragEnter',
      'dragExit',
      'dragLeave',
      'dragOver',
      'dragStart',
      'drop',
      'mouseDown',
      'mouseEnter',
      'mouseLeave',
      'mouseMove',
      'mouseOut',
      'mouseOver',
      'mouseUp',
    ],
    elementType: 'button',
  },
  {
    type: 'Selection',
    events: ['select'],
  },
  {
    type: 'Touch',
    events: ['touchCancel', 'touchEnd', 'touchMove', 'touchStart'],
    elementType: 'button',
  },
  {
    type: 'UI',
    events: ['scroll'],
    elementType: 'div',
  },
  {
    type: 'Wheel',
    events: ['wheel'],
    elementType: 'div',
  },
  {
    type: 'Media',
    events: [
      'abort',
      'canPlay',
      'canPlayThrough',
      'durationChange',
      'emptied',
      'encrypted',
      'ended',
      'error',
      'loadedData',
      'loadedMetadata',
      'loadStart',
      'pause',
      'play',
      'playing',
      'progress',
      'rateChange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      'timeUpdate',
      'volumeChange',
      'waiting',
    ],
    elementType: 'video',
  },
  {
    type: 'Image',
    events: ['load', 'error'],
    elementType: 'img',
  },
  {
    type: 'Animation',
    events: ['animationStart', 'animationEnd', 'animationIteration'],
    elementType: 'div',
  },
  {
    type: 'Transition',
    events: ['transitionEnd'],
    elementType: 'div',
  },
  {
    type: 'Pointer',
    events: [
      'pointerOver',
      'pointerEnter',
      'pointerDown',
      'pointerMove',
      'pointerUp',
      'pointerCancel',
      'pointerOut',
      'pointerLeave',
      'gotPointerCapture',
      'lostPointerCapture',
    ],
    elementType: 'div',
  },
]

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  console.warn.mockRestore()
})

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

// For each event type, we assert that the right events are being triggered
// when the associated fireEvent method is called.
eventTypes.forEach(({type, events, elementType = 'input', init}) => {
  describe(`${type} Events`, () => {
    events.forEach(eventName => {
      it(`triggers ${eventName}`, async () => {
        const testId = `${type}-${eventName}`
        const spy = vi.fn()
        const eventNameHandler = `on${capitalize(
          eventName.toLocaleLowerCase(),
        )}`

        const componentWithEvent = {
          render() {
            return h(elementType, {
              [eventNameHandler]: spy,
              'data-testid': testId,
            })
          },
        }

        // Render an element with a listener of the event under testing and a
        // test-id attribute, so that we can get the DOM node afterwards.
        const {getByTestId} = render(componentWithEvent)

        const elem = getByTestId(testId)

        await fireEvent[eventName](elem, init)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })
  })
})

// The event is called `dblclick`, but fireEvent exposes a "doubleClick" method
test('triggers dblclick on doubleClick', async () => {
  const spy = vi.fn()

  const componentWithDblClick = {
    render() {
      return h('button', {onDblclick: spy}, 'Click me')
    },
  }

  const {getByRole} = render(componentWithDblClick)

  const elem = getByRole('button')

  await fireEvent.doubleClick(elem)
  expect(spy).toHaveBeenCalledTimes(1)
})

// fireEvent(node, event) is also a valid API
test('calling `fireEvent` directly works too', async () => {
  const {getByRole, emitted} = render(Button)

  const button = getByRole('button')

  await fireEvent(button, new Event('click'))

  expect(emitted()).toHaveProperty('click')
})

test.each(['input', 'change'])(
  `fireEvent.%s prints a warning message to use fireEvent.update instead`,
  async event => {
    const {getByRole} = render({template: `<input type="text" />`})

    await fireEvent[event](getByRole('textbox'), 'hello')

    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(
      `Using "fireEvent.${event}" may lead to unexpected results. Please use fireEvent.update() instead.`,
    )
  },
)

test('does not warn when disabled via env var', async () => {
  process.env.VTL_SKIP_WARN_EVENT_UPDATE = 'true'

  const {getByTestId} = render({
    template: `<input type="text" data-testid="test-update" />`,
  })

  await fireEvent.input(getByTestId('test-update'), 'hello')

  expect(console.warn).not.toHaveBeenCalled()
})

test('fireEvent.update does not trigger warning messages', async () => {
  const {getByTestId} = render({
    template: `<input type="text" data-testid="test-update" />`,
  })

  await fireEvent.update(getByTestId('test-update'), 'hello')

  expect(console.warn).not.toHaveBeenCalled()
})

test('fireEvent.update does not crash if non-input element is passed in', async () => {
  const {getByText} = render({
    template: `<div>Hi</div>`,
  })

  await fireEvent.update(getByText('Hi'))

  expect(getByText('Hi')).toMatchInlineSnapshot(`
    <div>
      Hi
    </div>
  `)

  expect(console.warn).not.toHaveBeenCalled()
})

test('fireEvent.update handles input file', async () => {
  const {getByTestId} = render({
    template: `<input type="file" data-testid="test-update" />`,
  })

  const file = new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})

  const inputEl = getByTestId('test-update')

  // You could replace the lines below with
  // userEvent.upload(inputEl, file)
  Object.defineProperty(inputEl, 'files', {value: [file]})
  await fireEvent.update(inputEl)

  expect(console.warn).not.toHaveBeenCalled()
})
```

Esta prueba importa el componente [`Button.vue`](https://github.com/testing-library/vue-testing-library/blob/main/src/__tests__/components/Button.vue).

```vue
<template>
  <button @click="handleClick">{{ text }}</button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Button Text',
    },
  },
  emits: {click: null},
  methods: {
    handleClick(_e) {
      this.$emit('click')
    },
  },
}
</script>
```
Como podemos ver [aquí hay muchos ejemplos](https://github.com/testing-library/vue-testing-library/tree/main/src/__tests__).

Otra cosa interesante que vale la pena mencionar es el método de depuración [screen.debug()](https://testing-library.com/docs/queries/about/#screendebug).

```js{18}
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button when data is entered", async () => {    
    const {emitted} = render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    await fireEvent.update(
      screen.getByLabelText('Name'), 'John'
    )
    
    screen.debug()
            
    expect(button).not.toBeDisabled()

    fireEvent.click(button)
    
    console.log(emitted().submit)
  })
})
```
Este método `screen.debug()` lo que hace es simplemente mostrarnos el estado actual del DOM. Esto nos permitirá depurar cosas a veces y ver que está pasando. Esto puede ser muy útil para depurar errores o descubrir que lo que está sucediendo. 

```
<body>
  <div>
    <form>
      <label
        for="name"
      >
        Name
      </label>
      <input
        id="name"
      />
      <button
        role="button"
      >
        Submit
      </button>
    </form>
  </div>
</body>

 √ tests/components/myform.spec.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  116ms
```
 
Otra cosa que vale la pena destacar es que Vue Testing Library es un envoltorio de Vue Test Utils. Lo que eso significa es que podemos usar casi todas la opciones de montaje que esperaríamos ser capaz de usar.

Por ejemplo, la opción de montaje `global` está disponible y dentro de ella podemos establecer cosas como [simular objetos globales](../../vth/simulando-objetos-globales.html) o [talonar componentes](../../vth/talonando-componentes.html). También hay muchas otras opciones como pasar `props` y `data`.


```js{9,10,11,12,13,14,15,16,17}
// tests/components/mycomponent.spec.js
import { render, screen } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyComponent from "@/components/MyComponent.vue"

describe("MyComponent.vue", () => {
  it("should do something", async () => {    
    render(MyComponent, {
      props: {},
      data() {
        return {}
      },
      global: {
        mocks: {}
        stubs: {}
      }
    })

    // ...
  })
})
```

Por lo tanto, si hémos utilizado Vue Test Utils antes, podemos usar la mayor parte de todo ese conocimiento con Vue Testing Library simplemente transmitiendo las opciones de montaje habituales que normalmente usaríamos.

Una de las diferencias es que, en Vue Testing Library, el montaje es siempre completo, por lo que no existe el `shallowMount`. Por lo que, si tenemos un componente complejo muy grande que nos está causando problemas, es posible que deseemos usar `stubs` para talonar ese componente y poder continuar escribiendo nuestras pruebas.
