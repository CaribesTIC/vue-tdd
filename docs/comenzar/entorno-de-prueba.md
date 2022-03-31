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
Comencemos escribiendo una prueba para una función hipotética que suma dos números. Primero, cree un archivo `sum.js` dentro de la carpeta del proyecto:

```js
const sum = function(a, b) {
  return a + b;
}

export default sum;
```
Luego, cree un archivo llamado `sum.test.js`. Esto contendrá nuestra prueba real:

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
En pocos segundos aparecerá en su terminal lo siguiente:
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
