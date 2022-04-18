# Manejo de Formularios

Los formularios en Vue pueden ser tan simples como formularios HTML simples hasta árboles anidados complicados de elementos de formulario de componentes personalizados de Vue. Veremos gradualmente las formas de interactuar con los elementos del formulario, establecer valores y desencadenar eventos.

Los métodos que más usaremos son `setValue()` y `trigger()`.

## Interactuar con elementos de formulario

Echemos un vistazo a una forma muy básica:

```vue
<template>
  <div>
    <input type="email" v-model="email" />

    <button @click="submit">Submit</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.email)
    }
  }
}
</script>
```
## Establecer valores de elementos

La forma más común de vincular una entrada a los datos en Vue es mediante el uso de `v-model`. Como probablemente ya sepa, se ocupa de los eventos que emite cada elemento de formulario y de las propiedades que acepta, lo que nos facilita el trabajo con elementos de formulario.

Para cambiar el valor de una entrada en VTU, puede usar el método `setValue()`. Acepta un parámetro, generalmente una `String` o un `Boolean`, y devuelve una `Promise`, que se resuelve después de que Vue haya actualizado el DOM.

```js
import { mount } from '@vue/test-utils'
import Component from '@/Component.vue'

test('sets the value', async () => {
  const wrapper = mount(Component)
  const input = wrapper.find('input')

  await input.setValue('my@mail.com')

  expect(input.element.value).toBe('my@mail.com')
})
```
Como puede ver, `setValue` establece la propiedad `value` en el elemento de entrada a lo que le pasamos.

Usamos `await` para asegurarnos de que Vue haya completado la actualización y que el cambio se haya reflejado en el DOM, antes de hacer cualquier afirmación.

## Desencadenando eventos

La activación de eventos es la segunda acción más importante cuando se trabaja con formularios y elementos de acción. Echemos un vistazo a nuestro `button`, del ejemplo anterior.

```html
<button @click="submit">Submit</button>
```
Para activar un evento click, podemos usar el método `trigger`.

```js
test('trigger', async () => {
  const wrapper = mount(Component)

  // trigger the element
  await wrapper.find('button').trigger('click')

  // assert some action has been performed, like an emitted event.
  expect(wrapper.emitted()).toHaveProperty('submit')
})
```
>Si no ha visto `emitted()` antes, no se preocupe. Se utiliza para afirmar los eventos emitidos de un Componente. Puede obtener más información en [Manejo de Eventos](../esencial/manejo-de-eventos.html).

Activamos el detector de eventos `click`, para que el Componente ejecute el método `submit`. Como hicimos con `setValue`, usamos `await` para asegurarnos de que la acción está siendo reflejada por Vue.

Entonces podemos afirmar que ha ocurrido alguna acción. En este caso, que emitimos el evento correcto.

Combinemos estos dos para probar si nuestro formulario simple está emitiendo las entradas del usuario.

```js
test('emits the input to its parent', async () => {
  const wrapper = mount(Component)

  // set the value
  await wrapper.find('input').setValue('my@mail.com')

  // trigger the element
  await wrapper.find('button').trigger('click')

  // assert the `submit` event is emitted,
  expect(wrapper.emitted('submit')[0][0]).toBe('my@mail.com')
})
```

## Flujos de trabajo avanzados

Ahora que conocemos los conceptos básicos, profundicemos en ejemplos más complejos.

## Trabajar con varios elementos de formulario

Vimos que `setValue` funciona con elementos de entrada, pero es mucho más versátil, ya que puede establecer el valor en varios tipos de elementos de entrada.

Echemos un vistazo a un formulario más complicado, que tiene más tipos de entradas.

```vue
<template>
  <form @submit.prevent="submit">
    <input type="email" v-model="form.email" />

    <textarea v-model="form.description" />

    <select v-model="form.city">
      <option value="new-york">New York</option>
      <option value="moscow">Moscow</option>
    </select>

    <input type="checkbox" v-model="form.subscribe" />

    <input type="radio" value="weekly" v-model="form.interval" />
    <input type="radio" value="monthly" v-model="form.interval" />

    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        description: '',
        city: '',
        subscribe: false,
        interval: ''
      }
    }
  },
  methods: {
    async submit() {
      this.$emit('submit', this.form)
    }
  }
}
</script>
```
Nuestro componente Vue extendido es un poco más largo, tiene algunos tipos de entrada más y ahora el manejador `submit` se ha movido a un elemento `<form/>`.

De la misma manera que establecemos el valor en el `input`, podemos establecerlo en todas las demás entradas del formulario.

```js
import { mount } from '@vue/test-utils'
import FormComponent from '@/FormComponent.vue'

test('submits a form', async () => {
  const wrapper = mount(FormComponent)

  await wrapper.find('input[type=email]').setValue('name@mail.com')
  await wrapper.find('textarea').setValue('Lorem ipsum dolor sit amet')
  await wrapper.find('select').setValue('moscow')
  await wrapper.find('input[type=checkbox]').setValue()
  await wrapper.find('input[type=radio][value=monthly]').setValue()
})
```
Como puede ver, `setValue` es un método muy versátil. Puede trabajar con todo tipo de elementos de formulario.

Estamos usando `await` en todas partes, para asegurarnos de que cada cambio se haya aplicado antes de activar el siguiente. Esto se recomienda para asegurarse de hacer aserciones cuando el DOM se haya actualizado.

::: tip CONSEJO
Si no pasa un parámetro a `setValue` para las entradas `OPTION`, `CHECKBOX` o `RADIO`, se establecerán como `checked`.
:::

Hemos establecido valores en nuestro formulario, ahora es el momento de enviar el formulario y hacer algunas afirmaciones.

## Activación de detectores de eventos complejos

Los detectores de eventos no siempre son simples eventos `click`. Vue le permite escuchar todo tipo de eventos DOM, agregar modificadores especiales como `.prevent` y más. Echemos un vistazo a cómo podemos probarlos.

En nuestro formulario anterior, movimos el evento de `button` al elemento `form`. Esta es una buena práctica a seguir, ya que le permite enviar un formulario presionando la tecla `enter`, que es un enfoque más nativo.

Para activar el manejador `submit`, usamos el método `trigger` nuevamente.

```js{14,16,17,18,19,20,21,22}
test('submits the form', async () => {
  const wrapper = mount(FormComponent)

  const email = 'name@mail.com'
  const description = 'Lorem ipsum dolor sit amet'
  const city = 'moscow'

  await wrapper.find('input[type=email]').setValue(email)
  await wrapper.find('textarea').setValue(description)
  await wrapper.find('select').setValue(city)
  await wrapper.find('input[type=checkbox]').setValue()
  await wrapper.find('input[type=radio][value=monthly]').setValue()

  await wrapper.find('form').trigger('submit.prevent')

  expect(wrapper.emitted('submit')[0][0]).toStrictEqual({
    email,
    description,
    city,
    subscribe: true,
    interval: 'monthly'
  })
})
```
Para probar el modificador de eventos, copiamos y pegamos directamente nuestra cadena de eventos `submit.prevent` en `trigger`. `trigger` puede leer el evento pasado y todos sus modificadores, y aplicar selectivamente lo que sea necesario.

::: tip CONSEJO
Los modificadores de eventos nativos como `.prevent` y `.stop` son específicos de Vue y, como tales, no necesitamos probarlos, las funciones internas de Vue ya lo hacen.
:::

Luego hacemos una afirmación simple, si el formulario emitió el evento y la carga útil correctos.

## Envío nativo de formulario

La activación de un evento `submit` en un elemento `<form>` imita el comportamiento del navegador durante el envío del formulario. Si quisiéramos activar el envío de formularios de forma más natural, podríamos activar un evento `click` en el botón de envío. Dado que los elementos del formulario que no están conectados al `document` no se pueden enviar, según la [especificación HTML](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission-algorithm), necesitamos usar `attachTo` para conectar el elemento del envoltorio.

## Múltiples modificadores en el mismo evento

Supongamos que tiene un formulario muy detallado y complejo, con un manejo de interacción especial. ¿Cómo podemos hacer para probar eso?

```html
<input @keydown.meta.c.exact.prevent="captureCopy" v-model="input" />
```
Supongamos que tenemos una entrada que maneja cuando el usuario hace clic en `cmd` + `c`, y queremos interceptarlo y evitar que copie. Probar esto es tan fácil como copiar y pegar el evento del Componente al método `trigger()`.

```js
test('handles complex events', async () => {
  const wrapper = mount(Component)

  await wrapper.find(input).trigger('keydown.meta.c.exact.prevent')

  // run your assertions
})
```
Vue Test Utils lee el evento y aplica las propiedades apropiadas al objeto del evento. En este caso, coincidirá con algo como esto:

```js
{
  // ... other properties
  "key": "c",
  "metaKey": true
}
```
## Agregar datos extra a un evento

Digamos que su código necesita algo del interior del objeto `event`. Puede probar estos escenarios pasando datos adicionales como segundo parámetro.

```vue
<template>
  <form>
    <input type="text" v-model="value" @blur="handleBlur" />
    <button>Submit</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  methods: {
    handleBlur(event) {
      if (event.relatedTarget.tagName === 'BUTTON') {
        this.$emit('focus-lost')
      }
    }
  }
}
</script>
```
```js
import { mount } from '@vue/test-utils'
import Form from '@/Form.vue'

test('emits an event only if you lose focus to a button', () => {
  const wrapper = mount(Form)

  const componentToGetFocus = wrapper.find('button')

  wrapper.find('input').trigger('blur', {
    relatedTarget: componentToGetFocus.element
  })

  expect(wrapper.emitted('focus-lost')).toBeTruthy()
})
```
Aquí asumimos que nuestro código verifica dentro del objeto `event`, ya sea que el `relatedTarget` sea un botón o no. Simplemente podemos pasar una referencia a dicho elemento, imitando lo que sucedería si el usuario hace click en un `button` después de escribir algo en el `input`.

## Interactuando con entradas de Componentes Vue

Las entradas no son solo elementos planos. A menudo usamos componentes de Vue que se comportan como entradas. Pueden agregar marcado, estilo y muchas funcionalidades en un formato fácil de usar.

Probar formularios que usan tales entradas puede ser desalentador al principio, pero con algunas reglas simples, rápidamente se convierte en un paseo por el parque.

El siguiente es un Componente que envuelve un `label` y un elemento `input`:

```vue
<template>
  <label>
    {{ label }}
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<script>
export default {
  name: 'CustomInput',

  props: ['modelValue', 'label']
}
</script>
```
Este componente de Vue también devuelve lo que escriba. Para usarlo haces:

```vue{2}
<template>
  <CustomInput v-model="input" label="Text Input" class="text-input" />
</template>

<script>
import CustomInput from "./CustomInput.vue"

export default {
  components: {
    CustomInput
  },
  data() {
    return {
      input:''
    }
  }
}
</script>
```
Como se mencionó anteriormente, la mayoría de estas entradas alimentadas por Vue tienen un `button` real o un `input` en ellas. Puede encontrar fácilmente ese elemento y actuar en consecuencia:
```js
import { mount } from '@vue/test-utils'
import CustomForm from '@/CustomForm.vue'

test('fills in the form', async () => {
  const wrapper = mount(CustomForm)

  await wrapper.find('.text-input input').setValue('text')

  // continue with assertions or actions like submit the form, assert the DOM…
})
```

## Prueba de componentes de Entrada complejos

¿Qué sucede si su componente de entrada no es tan simple? Es posible que esté utilizando una biblioteca de interfaz de usuario, como Vuetify. Si confía en excavar dentro del marcado para encontrar el elemento correcto, sus pruebas pueden fallar si la biblioteca externa decide cambiar sus componentes internos.

En tales casos, puede establecer el valor directamente, utilizando la instancia del componente y `setValue`.

Supongamos que tenemos un formulario que utiliza el área de texto de Vuetify:

```vue
<template>
  <form>
    <v-textarea v-model="description" ref="description" />
    <button @click="handleClick">Send</button>
  </form>
</template>

<script>
export default {
  name: 'CustomTextarea',
  data() {
    return {
      description: ''
    }
  },
  methods: {
    handleClick() {
      this.$emit('submit', this.description)
    }
  }
}
</script>
```
Podemos usar `findComponent` para encontrar la instancia del componente y luego establecer su valor.
```js
test('emits textarea value on click', async () => {
  const wrapper = mount(CustomTextarea)
  const description = 'Some very long text...'

  await wrapper.findComponent({ ref: 'description' }).setValue(description)

  wrapper.find('.submit').trigger('click')

  expect(wrapper.emitted('submit')[0][0]).toEqual({ description })
})
```
## Conclusión

- Use `setValue` para establecer el valor tanto en las entradas DOM como en los componentes de Vue.
- Use `trigger` para activar eventos DOM, con y sin modificadores.
- Agregue datos de eventos adicionales para `trigger` usando el segundo parámetro.
- Comprueba que el DOM cambió y se emitieron los eventos correctos. Intente no afirmar datos en la instancia del Componente.
