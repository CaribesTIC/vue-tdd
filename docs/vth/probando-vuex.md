# Probando Vuex

Las siguientes guías analizan las pruebas de Vuex

## Los Dos Lados de Probando Vuex

En general, los componentes interactuarán con Vuex por

1. Cometer una mutación
1. Despachar una acción
1. Acceder al estado a través de `$store.state` o `getters`

Estas pruebas son para afirmar que el componente se comporta correctamente según el estado actual de la tienda Vuex. No necesitan saber acerca de la implementación de los mutadores, acciones o captadores.

Cualquier lógica realizada por el almacén, como mutaciones y captadores, se puede probar de forma aislada. Dado que las tiendas Vuex se componen de funciones regulares de JavaScript, se prueban fácilmente.

Las primeras guías analizan técnicas para probar Vuex de forma aislada considerando mutaciones, acciones y captadores. Las siguientes guías presentan algunas técnicas para probar los componentes que usan una tienda Vuex y garantizar que se comporten correctamente según el estado de la tienda.
