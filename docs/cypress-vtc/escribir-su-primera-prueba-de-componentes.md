# Escribir Su Primera Prueba de Componentes

:::warning Advertencia
Cypress Component Testing se encuentra actualmente en versión beta.
:::

_Cypress Component Testing_ proporciona un _**testable component workbench**_ para que usted construya y pruebe rápidamente cualquier componente, sin importar cuán simple o complejo sea.

El _Test Runner_ está basado en el navegador, lo que le permite probar los estilos y la API de su componente y aislar su componente de la página en la que Cypress lo representará. La separación de los componentes de su sitio web le permite dividir aún más el trabajo en más manejable trozos y, en última instancia, da como resultado componentes construidos conscientemente.

<video controls>
  <source src="./img/vuetify-color-picker-example.webm">
</video>

>Pruebas de [Vuetify](https://vuetifyjs.com/en/components/color-pickers/) VColorPicker, después de ser modido a Cypress desde Jest.

Para leer más, Cypress alienta a la gente a consultar la organización [Component Driven](https://www.componentdriven.org/), que habla sobre las ventajas del desarrollo basado en componentes y puede ayudarlo cuando intente averiguar si debe adoptar un enfoque basado en páginas o basado en componentes para la construcción y prueba de una característica determinada.

## Component vs. End-to-End en Pocas Palabras

Las diferencias entre las pruebas de componentes y de extremo a extremo se cubren en profundidad en la guía [Elección de un Tipo de Prueba](https://docs.cypress.io/guides/core-concepts/testing-types#What-you-ll-learn).

Pero, en resumen, _Cypress Component Testing_ usa el mismo ejecutor de pruebas, comandos y API para probar componentes en lugar de páginas.

La principal diferencia es que _Cypress Component Testing_ crea sus componentes utilizando un servidor de desarrollo en lugar de renderizarlos dentro de un sitio web completo, lo que da como resultado pruebas más rápidas y menos dependencias de la infraestructura que las pruebas integrales que cubren las mismas rutas de código.

Por último, la API de Cypress está centrada en el usuario y está diseñada para probar cosas que se renderizan en la web. Por lo tanto, muchas de sus pruebas aparecerán independientes del framework y accesibles para los desarrolladores de cualquier origen.

## Empezando

¿Preparado para comenzar? Consulte nuestras guías de [Inicio rápido: Vue](./inicio-rapido.html).
