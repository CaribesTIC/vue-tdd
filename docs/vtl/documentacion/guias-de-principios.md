# Guías de Principios

>[Cuanto más se parezcan sus pruebas a la forma en que se usa su software, más confianza le pueden brindar.](https://twitter.com/kentcdodds/status/977018512689455106)

Solo tratamos de exponer métodos y utilidades que lo animen a escribir pruebas que se parezcan mucho a cómo se usan sus páginas web.

Las utilidades se incluyen en este proyecto en base a las siguientes guías de principios:

1. Si se relaciona con la renderización de componentes, entonces debería tratar con nodos DOM en lugar de instancias de componentes, y no debería fomentar el manejo de instancias de componentes.
1. En general, debería ser útil para probar los componentes de la aplicación en la forma en que el usuario los usaría. Estamos haciendo algunas compensaciones aquí porque estamos usando una computadora y, a menudo, un entorno de navegador simulado, pero en general, las utilidades deberían alentar las pruebas que usan los componentes de la forma en que están destinados a ser utilizados.
1. Las implementaciones de utilidades y las API deben ser simples y flexibles.

Al final del día, lo que queremos es que esta biblioteca sea bastante liviana, simple y comprensible.

