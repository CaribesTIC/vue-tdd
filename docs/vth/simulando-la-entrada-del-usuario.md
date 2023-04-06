# Simulando la entrada del usuario

## Desencadenando eventos

Una de las cosas más comunes que harán sus componentes Vue es escuchar las entradas del usuario. `vue-test-utils` y Vitest facilitan la prueba de entradas. Echemos un vistazo a cómo usar los simulacros de `trigger` y Vitest para verificar que nuestros componentes funcionan correctamente.

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/FormSubmitter.spec.js)

## Creando el componente

Crearemos un componente de formulario simple, `<FormSubmitter>`, que contiene un `<input>` y un `<button>`. Cuando se hace click en el botón, algo debería suceder. El primer ejemplo simplemente revelará un mensaje de éxito, luego pasaremos a un ejemplo más interesante que envía el formulario a un punto final externo.

Cree un `<FormSubmitter>` e ingrese la plantilla:

```html
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" data-username>
      <input type="submit">
    </form>

    <div 
      class="message" 
      v-if="submitted"
    >
      Thank you for your submission, {{ username }}.
    </div>
  </div>
</template>
```
Cuando el usuario envíe el formulario, mostraremos un mensaje de agradecimiento por su envío. Queremos enviar el formulario de forma asincrónica, por lo que estamos usando `@submit.prevent` para evitar la acción predeterminada, que es actualizar la página cuando se envía el formulario.

Ahora agregue la lógica de envío del formulario:

```html
<script>
  export default {
    name: "FormSubmitter",

    data() {
      return {
        username: '',
        submitted: false
      }
    },

    methods: {
      handleSubmit() {
        this.submitted = true
      }
    }
  }
</script>
```

Bastante simple, simplemente configuramos el `submitted` como `true` cuando se envía el formulario, lo que a su vez revela el `<div>` que contiene el mensaje de éxito.

## Escribiendo la prueba

Veamos una prueba. Estamos marcando esta prueba como `async` - siga leyendo para averiguar por qué.

```js
import { mount } from "@vue/test-utils"
import FormSubmitter from "@/components/FormSubmitter.vue"

describe("FormSubmitter", () => {
  it("reveals a notification when submitted", async () => {
    const wrapper = mount(FormSubmitter)

    await wrapper.find("[data-username]").setValue("alice")
    await wrapper.find("form").trigger("submit.prevent")

    expect(wrapper.find(".message").text())
      .toBe("Thank you for your submission, alice.")
  })
})
```
Esta prueba es bastante autoexplicativa. Montamos el componente (`mount`), configuramos el _username_ y usamos el método `trigger` que proporciona `vue-test-utils` para simular la entrada del usuario. `trigger` funciona en eventos personalizados, así como en eventos que usan modificadores, como `submit.prevent`, `keydown.enter`, etc.

Note que cuando llamamos a `setValue` y `trigger`, estamos usando `await`. Es por eso que tuvimos que marcar la prueba como `async` - para que podamos usar `await`.

setValue y `trigger` ambos, internamente, devuelven `Vue.nextTick()`. A partir de `vue-test-utils` beta 28, debe llamar a `nextTick` para asegurarse de que el sistema de reactividad de Vue actualice el DOM. Al hacer `await setValue(...)` y `await trigger(...)`, en realidad solo está usando una abreviatura para:

```js
wrapper.setValue(...)
await wrapper.vm.$nextTick() // "Wait for the DOM to update before continuing the test"
```
A veces, puede salirse sin esperar a `nextTick`, pero si sus componentes comienzan a volverse complejos, puede alcanzar una condición de carrera y su afirmación podría ejecutarse antes de que Vue haya actualizado el DOM. Puede leer más sobre esto en la [documentación oficial de vue-test-utils](https://vue-test-utils.vuejs.org/guides/#updates-applied-by-vue).

La prueba anterior también sigue los tres pasos de la prueba unitaria:

1. arreglar (configurado para la prueba. En nuestro caso, renderizamos el componente).
1. actuar (ejecutar acciones en el sistema)
1. afirmar (asegúrese de que el resultado real coincida con sus expectativas)

Separamos cada paso con una nueva línea, ya que hace que las pruebas sean más legibles.

Ejecute esta prueba, debería pasar.

`trigger` es muy simple: use `find` (para elementos DOM) o `findComponent` (para componentes Vue) para obtener el elemento que desea simular alguna entrada y llame a `trigger` con el nombre del evento y cualquier modificador.

## Un ejemplo del mundo real

Los formularios generalmente se envían a algún punto final. Veamos cómo podríamos probar este componente con una implementación diferente de `handleSubmit`. Una práctica común es asignar un alias a su biblioteca HTTP a `Vue.prototype.$http`. Esto nos permite realizar una solicitud ajax simplemente llamando a `this.$http.get(...)`. Conoce más sobre esta práctica [aquí](https://v2.vuejs.org/v2/cookbook/adding-instance-properties.html?redirect=true).

A menudo, la biblioteca _http_ es, `axios`, un popular cliente HTTP. En este caso, nuestro `handleSubmit` probablemente se vería así:

```js
handleSubmitAsync() {
  return this.$http.get("/api/v1/register", { username: this.username })
    .then(() => {
      // show success message, etc
    })
    .catch(() => {
      // handle error
    })
}
```

En este caso, una técnica es simular `this.$http` para crear el entorno de prueba deseado. Puede leer sobre la opción de montaje `global.mocks` [aquí](https://vue-test-utils.vuejs.org/api/options.html#mocks). Veamos una implementación simulada de un método `http.get`:

```js
let url = ''
let data = ''

const mockHttp = {
  get: (_url, _data) => {
    return new Promise((resolve, reject) => {
      url = _url
      data = _data
      resolve()
    })
  }
}
```

Hay algunas cosas interesantes que suceden aquí:

- Creamos una `url` y una variable `data` para guardar la `url` y la `data` pasados a `$http.get`. Esto es útil para afirmar que la solicitud llega al punto final correcto, con la carga útil correcta.
- Después de asignar los argumentos de `url` y `data`, resolvemos inmediatamente la Promesa para simular una respuesta API exitosa.

Antes de ver la prueba, aquí está la nueva función `handleSubmitAsync`:

```js
methods: {
  handleSubmitAsync() {
    return this.$http.get("/api/v1/register", { username: this.username })
      .then(() => {
        this.submitted = true
      })
      .catch((e) => {
        throw Error("Something went wrong", e)
      })
  }
}
```

Además, actualice `<template>` para usar el nuevo método `handleSubmitAsync`:

```html
<template>
  <div>
    <form @submit.prevent="handleSubmitAsync">
      <input v-model="username" data-username>
      <input type="submit">
    </form>

  <!-- ... -->
  </div>
</template>
```

Ahora, sólo la prueba.

## Simulando una llamada ajax

Primero, incluya la implementación simulada de `this.$http` en la parte superior, antes del bloque `describe`:

```js
let url = ''
let data = ''

const mockHttp = {
  get: (_url, _data) => {
    return new Promise((resolve, reject) => {
      url = _url
      data = _data
      resolve()
    })
  }
}
```

Ahora, agregue la prueba, pasando el `$http` simulado a la opción de montaje `global.mocks`:

```js
it("reveals a notification when submitted", () => {
  const wrapper = mount(FormSubmitter, {
    global: {
      mocks: {
        $http: mockHttp
      }
    }
  })

  wrapper.find("[data-username]").setValue("alice")
  wrapper.find("form").trigger("submit.prevent")

  expect(wrapper.find(".message").text())
    .toBe("Thank you for your submission, alice.")
})
```

Ahora, en lugar de usar cualquier biblioteca http real adjunta a `Vue.prototype.$http`, se usará la implementación simulada. Esto es bueno: podemos controlar el entorno de la prueba y obtener resultados consistentes.

Ejecutdo así en realidad producirá una prueba fallida:

```sh
FAIL  tests/unit/FormSubmitter.spec.js
  ● FormSubmitter › reveals a notification when submitted

    [vue-test-utils]: find did not return .message, cannot call text() on empty Wrapper
```

Lo que sucede es que la prueba finaliza _antes_ de que se resuelva la promesa devuelta por `mockHttp`. Nuevamente, podemos hacer que la prueba sea asíncrona de esta manera:

```js
it("reveals a notification when submitted", async () => {
  // ...
})
```

Ahora debemos asegurarnos de que el DOM se haya actualizado y que todas las promesas se hayan resuelto antes de que continúe la prueba. `await wrapper.setValue(...)` tampoco siempre es confiable aquí, porque en este caso no estamos esperando que Vue actualice el DOM, sino una dependencia externa (nuestro cliente HTTP simulado, en este caso) para resolver.

Una forma de evitar esto es usar [flushPromises](https://test-utils.vuejs.org/api/#flushpromises), que resolverá de inmediato todas las promesas pendientes. Actualice la prueba de la siguiente manera (también estamos agregando `await wrapper.setValue(...)` por si acaso):

```js
import { mount, flushPromises } from '@vue/test-utils'
import FormSubmitter from "@/components/FormSubmitter.vue"

let url = ''
let data = ''

const mockHttp = {
  // omitted for brevity ...
}

describe("FormSubmitter", () => {
  it("reveals a notification when submitted", async () => {
    const wrapper = mount(FormSubmitter, {
        // omitted for brevity ...
    })

    await wrapper.find("[data-username]").setValue("alice")
    await wrapper.find("form").trigger("submit.prevent")
    
    await flushPromises()

    expect(wrapper.find(".message").text())
      .toBe("Thank you for your submission, alice.")
  })
})
```
Ahora pasa la prueba. 

También debemos asegurarnos de que el punto final y la carga útil sean correctos. Agregue dos afirmaciones más a la prueba:

```js
// ...
expect(url).toBe("/api/v1/register")
expect(data).toEqual({ username: "alice" })
```

El código completo del componente `FormSubmitter.vue` es:

```vue
<template>
  <div>
    <form @submit.prevent="handleSubmitAsync">
      <input v-model="username" data-username>
      <input type="submit">
    </form>

    <div 
      class="message" 
      v-if="submitted"
    >
      Thank you for your submission, {{ username }}.
    </div>
  </div>
</template>

<script>
  export default {
    name: "FormSubmitter",

    data() {
      return {
        username: '',
        submitted: false
      }
    },

    methods: {      
      handleSubmitAsync() {
        return this.$http.get("/api/v1/register", { username: this.username })
          .then(() => {
            this.submitted = true
          })
          .catch((e) => {
            throw Error("Something went wrong", e)
          })
      }
 
    }
  }
</script>
```
La prueba todavía pasa.

Aquí el ejemplo completo del archivo `FormSubmitter.spec.js`:

```js
import { mount, flushPromises } from '@vue/test-utils'
import FormSubmitter from "@/components/FormSubmitter.vue"

let url = ''
let data = ''

const mockHttp = {
  get: (_url, _data) => {
    return new Promise((resolve, reject) => {
      url = _url
      data = _data
      resolve()
    })
  }
}

const factory = () => {
  return mount(FormSubmitter, {
    global: {
      mocks: {
        $http: mockHttp
      }
    }   
  })
}

describe("FormSubmitter", () => {

  it("reveals a notification when submitted", async () => {
    const wrapper = factory()

    await wrapper.find("[data-username]").setValue("alice")
    await wrapper.find("form").trigger("submit.prevent")
    await wrapper.vm.$nextTick()

    expect(wrapper.find(".message").text())
      .toBe("Thank you for your submission, alice.")
  })


  it("reveals a notification when submitted", async () => {
    const wrapper = factory()

    await wrapper.find("[data-username]").setValue("alice")
    await wrapper.find("form").trigger("submit.prevent")
    
    await flushPromises()

    expect(wrapper.find(".message").text())
      .toBe("Thank you for your submission, alice.")
      
    expect(url).toBe("/api/v1/register")
    expect(data).toEqual({ username: "alice" })
  })
})
```

## Conclusión

En esta sección, vimos cómo:

- Use `trigger` en eventos, incluso aquellos que usan modificadores como `prevent`
- Use `setValue` para establecer un valor de un `<input>` usando `v-model`
- Use `await` con `trigger` y `setValue` para esperar a `Vue.nextTick` y asegúrese de que el DOM se haya actualizado
- Escribir pruebas utilizando los tres pasos de las pruebas unitarias
- Simule un método adjunto a `Vue.prototype` usando la opción de montaje `global.mocks`
- Cómo usar `flushPromises` para resolver inmediatamente todas las promesas, una técnica útil en las pruebas unitarias

El código fuente de la prueba descrita en esta página se puede encontrar [aquí](https://github.com/lmiller1990/vue-testing-handbook/blob/master/demo-app-vue-3/tests/unit/FormSubmitter.spec.js).
