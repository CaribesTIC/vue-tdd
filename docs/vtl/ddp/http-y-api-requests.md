# HTTP y API Requests

>Algo que casi todas las aplicaciones de Vue.js van a hacer es realizar solicitudes HTTP a una API de algún tipo. Esto podría ser para autenticación, carga de datos u otra cosa. Han surgido muchos patrones para administrar las solicitudes HTTP, y aún más para probarlos.

Este capítulo analiza varias formas de diseñar sus solicitudes HTTP, diferentes formas de probarlas y analiza los pros y los contras de cada enfoque.

## El Componente de Inicio de Sesión

El ejemplo que usaré es el componente `<Login>`. Permite al usuario ingresar su nombre de usuario y contraseña e intentar autenticarse. Queremos pensar en:

- ¿Desde dónde se debe realizar la solicitud HTTP? El componente, otro módulo, en una tienda (¿como Vuex?)
- ¿Cómo podemos probar cada uno de estos enfoques?

No hay una solución única para todos aquí. Compartiré cómo me gusta estructurar las cosas actualmente, pero también daré mi opinión sobre otras arquitecturas.

## Comenzando Simple

Si su aplicación es simple, probablemente no necesitará algo como Vuex o un servicio de solicitud HTTP aislado. Puede simplemente alinear todo en su componente:

📃`Login.vue`
```vue
<template>
  <h1 v-if="user">
    Hello, {{ user.name }}
  </h1>
  <form @submit.prevent="handleAuth">
    <input v-model="formData.username" role="username" />
    <input v-model="formData.password" role="password" />
    <button>Click here to sign in</button>
  </form>
  <span v-if="error">{{ error }}</span>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      user: undefined,
      error: ''
    }
  },

  methods: {
    async handleAuth() {
      try {
        const response = await axios.post('/login', this.formData )
        this.user = response.data
      } catch (e) {
        this.error = e.response.data.error
      }
    }
  }
}
</script>
```
>Un componente de formulario de inicio de sesión simple, realiza una solicitud utilizando axios.

Este ejemplo usa la biblioteca HTTP de `axios`, pero se aplican las mismas ideas si está usando `fetch`.

No queremos realizar una solicitud a un servidor real al probar este componente; las pruebas unitarias deben ejecutarse de forma aislada. Una opción aquí es simular el módulo `axios` con `vi.mock`.

Probablemente queramos probar:

- ¿Se utiliza el _endpoint_ correcto?
- ¿Está incluida el _payload_ correcta?
- ¿Se actualiza el DOM según la respuesta?

Una prueba en la que el usuario se autentica con éxito podría verse así:

📃`__tests__/Login.spec.js`
```js
import { render, fireEvent, screen } from '@testing-library/vue'
import App from '../Login.vue'
import axios from 'axios'

axios.post = vi.fn().mockResolvedValue({
  data: { name: 'Lachlan' }
})

describe('login', () => {
  it('successfully authenticates', async () => {
    render(App)

    await fireEvent.update(screen.getByRole('username'), 'Lachlan')
    await fireEvent.update(screen.getByRole('password'), 'secret-password')
    await fireEvent.click(screen.getByText('Click here to sign in'))

    expect(axios.post).toHaveBeenCalledWith('/login', {
      username: 'Lachlan',
      password: 'secret-password'
    })
    await screen.findByText('Hello, Lachlan')
  })
})
```
>Usando una implementación simulada de `axios` para probar el flujo de trabajo de inicio de sesión.

Probar una solicitud fallida también es sencillo: solo generaría un error en la implementación simulada.

## Refactoring to a store
