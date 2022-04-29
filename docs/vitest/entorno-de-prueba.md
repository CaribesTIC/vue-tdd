# Entorno de prueba

## Crear proyecto con Vite

Para preparar su proyecto y el entorno de prueba, empezaremos creando un nuevo proyecto con [Vite](https://vitejs.dev/guide/). Ejecute lo siguiente en la línea de comando:
```
npm init vite@latest
```
Seguidamente aparecerá el sieguiente diálogo:
```
Need to install the following packages:
  create-vite@latest
Ok to proceed? (y) 
```
Luego de aceptar para continuar, nos preguntará:
```
? Project name: › vite-project
```
Si lo desea, cambie el nombre del proyecto `vite-project`, en nuestro caso se llamará así: `vue-tdd`
```
? Project name: › vue-tdd
```
Inmediatamente preguntará:
```
? Select a framework: › - Use arrow-keys. Return to submit.
❯   vanilla
    vue
    react
    preact
    lit
    svelte
```
Con la decla de desplazamiento hacia abajo seleccione `vue` y presione `enter`.
```
? Select a framework: › - Use arrow-keys. Return to submit.
    vanilla
❯   vue
    react
    preact
    lit
    svelte
```
Preguntará si deseamos usar Vue con TypeScrip. Por lo que enfocados en el propósito de aprender sobre TDD usaremos simplemente Vue.
```
? Select a variant: › - Use arrow-keys. Return to submit.
❯   vue
    vue-ts
```
Entonces, aparecerá lo siguiente:
```
Done. Now run:

  cd vue-tdd
  npm install
  npm run dev
```
Ya está creado el proyecto con Vite, solo hace falta ejecutar las 3 instrucciones anteriores. Llegado a este punto, el archivo `package.json` lucira se la siguiente manera:
```json
{
  "name": "vue-tdd",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.25"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^2.3.1",
    "vite": "^2.9.5"
  }
}
```
El archivo `vite.config.js` lucira así:
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
```
## Instalar Vitest

Para instalar [Vitest](https://vitest.dev/guide/) hay que ejecutar la siguiente línea de comando:
```
npm i -D vitest
```
Despues de instalar Vitest hay que agregar la siguiente línea en el archivo `package.json` para ejecutar las pruebas:
```json{9,10,11}
{
  "name": "vue-tdd",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
  "dependencies": {
    "vue": "^3.2.25"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^2.3.1",
    "vite": "^2.9.5",
    "vitest": "^0.10.0"
  }
}
```
Solo falta entonar el proyecto realizando los siguientes cambios en el archivo `vite.config.js`
```js{1,4,10,11,12,13,14,15,16,17}
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
})
```
## Probar el Entorno

**Comencemos** escribiendo una prueba para una función hipotética que suma dos números.

Dentro de la carpeta raiz del proyecto, creemos la carpeta `tests`. Aquí colocaremos todos nuestros archivos de pruebas. Nuestra estructura de carpetas debería lucir de la siguiente manera:
```
vue-tdd/
├── node_modules/
├── public/
├── src/
└── tests/
```
Creemos un archivo `sum.js` dentro de la carpeta del proyecto (`src/`):
```js
const sum = function(a, b) {
  return a + b;
}

export default sum;
```
Luego, cree un archivo llamado `sum.test.js` dentro de la carpeta para las pruebas (`tests/`). Esto contendrá nuestra prueba real:

```js
import sum from '@/sum';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Ejecute en su terminal:

```
npm run test
```
No se sorprenda si en la terminal aparece un diálogo como el siguiente:

```
> vue-tdd@0.0.0 test
> vitest

 MISSING DEP  Can not find dependency 'jsdom'
                                                                                                                                     
? Do you want to install jsdom? › (y/N)
```
La terminal nos dice que dentro de nuestros paquetes no se encuentra `jsdom`. Recordemos que en el archivo `config.vite.js` declaramos una sección llamada `test` la cual contiene el valor `"jsdom"` establecido en la propiedad `environment`.

[jsdom](https://www.npmjs.com/package/jsdom) es una implementación de JavaScript puro de muchos estándares web, para usar con Node.js. En general, el objetivo del proyecto es emular lo suficiente de un subconjunto de un navegador web para que sea útil para probar y extraer aplicaciones web del mundo real.

Por las razones antes mencionadas, digámosle a la maquina que sí queremos instalar `jsdom` y esperemos que efectue su instalación.

Una vez instalado `jsdom` la terminal nos pedirá que volvamos a ejecutar el comando para comenzar. Es decir, `npm run test`.

Una vez hecho esto, en pocos segundos aparecerá en su terminal lo siguiente:
```
> vue-tdd@0.0.0 test
> vitest

 WATCH  /vue-tdd

 √ tests/sum.test.js (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  2.12s (in thread 3ms, 64979.60%)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```
Excelente, ya realizamos nuestra primera prueba, ahora es momento de profundizar sobre el tema.
:::warning Advertencia
Para probar algunos ejemplos relacionados con [Mensajes HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Messages) es necesario instalar [Axios](https://axios-http.com/docs/intro):
```
npm i axios
```
:::
