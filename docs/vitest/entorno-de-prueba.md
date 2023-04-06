# Entorno de prueba

## Crear aplicación con Vite

Para arrancar nuestra aplicación, y ya tener preparado el entorno de pruebas, debemos tener instalado [Node](https://nodejs.org/es/). Avanzaremos y [crearemos una aplicación con Vue](https://vuejs.org/guide/quick-start.html#creating-a-vue-application).

Ejecute lo siguiente en la línea de comando:

```sh
npm init vue@latest
```

>Como habrá notado, para este curso estamos usando [`npm`](https://www.npmjs.com/) para el manejo de paquetes. Siéntase libre de usar [`yarn`](https://yarnpkg.com/) si lo desea.

Inmediatamente se establecerá un diálogo con el terminal, lo primero que nos preguntará será definir el nombre del proyecto, en mi caso le colocaré `vue-tdd`, usted puede colocar el nombre que desee:

```sh{3}
Vue.js - The Progressive JavaScript Framework

? Project name: › vue-tdd
```

Luego el terminal nos hará una serie de preguntas a las cuales responderemos afirmativamente solo para seleccionar lo que está aquí resaltado ([Vue Router](https://router.vuejs.org/guide/) + [Pinia](https://pinia.vuejs.org/) + [Vitest](https://vitest.dev/) + [Cypress](https://www.cypress.io/)), lo demás no lo necesitaremos para el objetivo de este tutorial.

```sh{6,7,8,9}
Vue.js - The Progressive JavaScript Framework

✔ Project name: … vue-tdd
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit Testing? … No / Yes
✔ Add Cypress for End-to-End testing? … No / Yes
✔ Add ESLint for code quality? … No / Yes
```

Finlamente, seguimos las siguientes intrucciones:

```sh
Scaffolding project in ../vue-tdd...

Done. Now run:

  cd vue-ydd
  npm install
  npm run dev
```

Ya está creado nuestra aplicación Vue, solo hace falta ejecutar las 3 instrucciones anteriores.

>Tenga en cuenta que automaticamente tambien se instaló [Vue Test Utils](https://test-utils.vuejs.org/), la biblioteca oficial de **Utilidades de Prueba para Vue**.

## Configurar Vite con Vitest

Aún nos falta entonar el proyecto realizando los siguientes cambios en el archivo `vite.config.js`.

```js{1,15,16,17,18}
/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
})
```

Esto lo hacemos con el propósito de auto-importar las correspondientes funcionalidades de Vitest en los archivos de pruebas.

## Probar el Entorno

Comencemos escribiendo una prueba para una función hipotética que suma dos números.

>Dentro de la carpeta raiz del proyecto, creemos la carpeta `tests`. Aquí colocaremos todos nuestros archivos de pruebas.

Nuestra estructura de carpetas debería lucir de la siguiente manera:
```sh
vue-tdd/
├── node_modules/
├── public/
├── src/
└── tests/
```
Creemos un archivo `sum.js` dentro de la carpeta `src/` del proyecto:

```js
const sum = function(a, b) {
  return a + b;
}

export default sum;
```
Luego, cree un archivo llamado `sum.spec.js` dentro de la carpeta `tests/` para las pruebas. Esto contendrá nuestra prueba real:

```js
import sum from '@/sum';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Entonces, ejecute en su terminal:

```sh
npm run test:unit
```

En pocos segundos aparecerá en su terminal lo siguiente:

```sh
> vue-tdd@0.0.0 test:unit
> vitest --environment jsdom


 DEV  v0.23.2 /vue-tdd

 ✓ tests/sum.spec.js (1)
 ✓ src/components/__tests__/HelloWorld.spec.js (1)

Test Files  2 passed (2)
     Tests  2 passed (2)
  Start at  14:42:02
  Duration  1.76s (transform 655ms, setup 0ms, collect 204ms, tests 38ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

Excelente, ya realizamos nuestra primera prueba.

>Tenga en cuenta que al momento de la creación de nuestra aplicación, Vue también creó una prueba conjunta denominada `HelloWorld.spec.js`.

## Instalar Vue Testing Library

>[Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro) es una solución muy liviana para probar componentes de Vue. Proporciona funciones de utilidad livianas además de `@vue/test-utils`, de una manera que fomenta mejores prácticas de prueba.

Para instalar Vue Testing Library ejecutemos las siguientes instrucciones:

```sh
npm i -D @testing-library/vue@next
npm i -D @testing-library/jest-dom
```

## Instalar Pinia Testing

Para los componentes con Pinia instalaremos su corredor de pruebas:

```sh
npm i -D @pinia/testing
```
## Instalar Axios

Para probar algunos ejemplos relacionados con [Mensajes HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Messages) necesitamos instalar [Axios](https://axios-http.com/docs/intro):

```sh
npm i axios
```


>Ahora sí, ha llegado el momento de profundizar sobre el tema.
