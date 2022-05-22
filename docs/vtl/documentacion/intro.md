# ¿Qué es Test Library?

## Introducción

La familia de paquetes [`@testing-library`](https://www.npmjs.com/org/testing-library) lo ayuda a probar los componentes de la interfaz de usuario de una manera centrada en el usuario.

> [Cuanto más se parezcan sus pruebas a la forma en que se usa su software, más confianza le pueden brindar.](./guias-de-principios)

## El problema

Desea escribir pruebas mantenibles que le brinden una alta confianza de que sus componentes funcionan para sus usuarios. Como parte de este objetivo, desea que sus pruebas eviten incluir detalles de implementación para que las refactorizaciones de sus componentes (cambios en la implementación pero no en la funcionalidad) no interrumpan sus pruebas y lo ralenticen a usted y a su equipo.

## La solución

La biblioteca central, `DOM Testing Library`, es una solución liviana para probar páginas web consultando e interactuando con nodos DOM (ya sea simulados con [`JSDOM`](https://github.com/jsdom/jsdom)`/`[`Vitest`](https://vitest.dev/) o en el navegador). Las principales utilidades que proporciona implican consultar el DOM en busca de nodos de una manera similar a cómo el usuario encuentra elementos en la página. De esta manera, la biblioteca ayuda a garantizar que sus pruebas le den la confianza de que su aplicación funcionará cuando la use un usuario real.

La biblioteca central se ha envuelto para proporcionar API ergonómicas para varios marcos, incluidos [React](https://testing-library.com/docs/react-testing-library/intro/), [Angular](https://testing-library.com/docs/angular-testing-library/intro/) y [Vue](https://testing-library.com/docs/vue-testing-library/intro/). También hay un complemento para usar consultas de biblioteca de prueba para pruebas de extremo a extremo en [Cypress](https://testing-library.com/docs/cypress-testing-library/intro/) y una implementación para [React Native](https://testing-library.com/docs/react-native-testing-library/intro/).

## Lo que esta biblioteca no es

1. Un corredor de pruebas o marco
1. Específico de un marco de pruebas

La biblioteca de prueba de DOM funciona con cualquier entorno que proporcione API de DOM, como Vitest, Jest, Mocha + JSDOM o un navegador real.

## Lo que debes evitar con Testing Library

Testing Library lo alienta a evitar probar [detalles de implementación](https://kentcdodds.com/blog/testing-implementation-details), como las partes internas de un componente que está probando (aunque todavía es posible). Las [Guías de Principios](./guias-de-principios) de esta biblioteca enfatizan un enfoque en las pruebas que se asemejan mucho a cómo los usuarios interactúan con sus páginas web.

Es posible que desee evitar los siguientes detalles de implementación:

1. Estado interno de un componente
1. Métodos internos de un componente
1. Métodos de ciclo de vida de un componente
1. Componentes secundarios

