## Entorno de prueba

Para preparar su proyecto y el entorno de prueba, ejecute lo siguiente en la línea de comando:
```js
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
