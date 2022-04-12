# Entorno de prueba

Para preparar su proyecto y el entorno de prueba, ejecute lo siguiente en la línea de comando:
```
npm init vite@latest
npm i -D vitest
npm i -D @vue/test-utils@next
npm i -D @testing-library/vue@next
npm i -D @testing-library/jest-dom
npm i vuex@next --save
npm i vue-router@4
```
Luego actualice el archivo `vite.config.js` con lo siguiente:
```js
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
Ahora actualicemos nuestro archivo `package.json` agredando las siguentes dos lineas a la sección `scripts`. En dicha sección, ahora tu `package.json` debería verse algo así:
```json
...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "coverage": "vitest --coverage"
  },
...
```
Si necesitas indagar más al respecto puedes hacerlo en la documentación oficial de [Vitest](https://vitest.dev/guide/).

---

**Comencemos** escribiendo una prueba para una función hipotética que suma dos números. Dentro de la carpeta raiz del proyecto, creemos la carpeta `tests`. Aquí colocaremos todos nuestros archivos de pruebas. Nuestra estructura de carpetas debería lucir de la siguiente manera:
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
No se sorprenda si le aparece un diálogo como el siguiente:

```
> vue-tdd@0.0.0 test
> vitest

 MISSING DEP  Can not find dependency 'jsdom'
                                                                                                                                     
? Do you want to install jsdom? › (y/N)
```
Nos dice que dentro de nuestros paquetes no se encuentra `jsdom`. Recordemos que en el archivo `config.vite.js` declaramos una sección llamada `test` la cual contiene el valor `"jsdom"` establecido en la propiedad `environment`.

[jsdom](https://www.npmjs.com/package/jsdom) es una implementación de JavaScript puro de muchos estándares web, para usar con Node.js. En general, el objetivo del proyecto es emular lo suficiente de un subconjunto de un navegador web para que sea útil para probar y extraer aplicaciones web del mundo real.

Digámosle a la maquina que sí queremos instalar `jsdom` y esperemos que efectue su instalación.

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
Realizamos nuestra primera prueba, es momento para empezar a hablar de las pruebas unitarias.
