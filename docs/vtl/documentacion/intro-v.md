# ¿Qué es Vue Test Library?

## Introducción

Vue Testing Library se basa en DOM Testing Library al agregar API para trabajar con componentes de Vue. Está construido sobre [`@vue/test-utils`](https://github.com/vuejs/vue-test-utils), la biblioteca de prueba oficial para Vue.

- [Vue Testing Library en GitHub](https://github.com/testing-library/vue-testing-library)

En resumen, Vue Testing Library hace tres cosas:

1. Re-exportar las utilidades de consulta y los ayudantes desde DOM Testing Library.
1. Oculta los métodos de `@vue/test-utils` que están en conflicto con la [Guías de Principios](./guias-de-principios) de Testing Library.
1. Ajusta algunos métodos de ambas fuentes.

## El problema

Desea escribir pruebas mantenibles para sus componentes Vue. Como parte de este objetivo, **desea que sus pruebas eviten incluir detalles de implementación de sus componentes**. Prefiere concentrarse en hacer que sus pruebas le brinden la confianza para la que fueron diseñadas.

## Esta solución

Vue Testing Library es una solución muy liviana para probar componentes de Vue. Proporciona funciones de utilidad livianas además de `@vue/test-utils`, de una manera que fomenta mejores prácticas de prueba.

Su guías de principios son:

>[Cuanto más se parezcan sus pruebas a la forma en que se usa su software, más confianza le pueden brindar.](./guias-de-principios)

Entonces, en lugar de tratar con instancias de componentes Vue renderizados, **sus pruebas funcionarán con nodos DOM reales**.

Las utilidades que proporciona esta biblioteca facilitan la consulta del DOM de la misma manera que lo haría el usuario. Le permiten encontrar elementos por el texto de su etiqueta, encontrar enlaces y botones a partir de su texto y afirmar que su aplicación es **accesible**.

También expone una forma recomendada de encontrar elementos por un `data-testid` como una "escotilla de escape" para elementos donde el contenido del texto y la etiqueta no tienen sentido o no son prácticos.

## Inicio Rápido

```
npm i -D @testing-library/vue@next
```

Ahora puede usar todos los comandos `getBy`, `getAllBy`, `queryBy` y `queryAllBy` de DOM Testing Library. Vea aquí **[la lista completa de consultas](https://testing-library.com/docs/queries/about/#types-of-queries)**.

También puede estar interesado en instalar `@testing-library/jest-dom` para que pueda usar [los comparadores Jest personalizados](https://github.com/testing-library/jest-dom#readme) para el DOM.

```
npm i -D @testing-library/jest-dom
```




