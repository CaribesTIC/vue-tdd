# ¿Para quién estás probando?

Hay dos tipos de usuarios a tener en cuenta al probar componentes: usuarios finales y desarrolladores.

Una buena prueba de componentes cubre las inquietudes de cada uno de estos tipos de usuarios. ¡Esta guía cubre ejemplos de problemas comunes que diferencian a estos usuarios y una recomendación con respecto a su audiencia de prueba!

## Preocupaciones de los Desarrolladores

Los desarrolladores se preocupan por la API del componente. Quieren asegurarse de que si lo ejercitan de una manera particular, con propiedades específicas, se comportará de la manera que esperan. Una prueba escrita para un desarrollador brinda cobertura sobre el uso y la firma del componente.

Las pruebas de componentes escritas pensando en los desarrolladores cubren en gran medida propiedades, eventos y subcomponentes.

## Preocupaciones del Usuario Final

Los usuarios piensan como lo haría un dueño de producto no técnico.

Acceden e interactúan con el sitio de varias maneras, es decir, a través de un navegador o dispositivos de asistencia como lectores de pantalla.

¿Se supone que el componente debe decirle qué hay en su carrito? ¿Debería poder ingresar un valor de texto en un componente `Stepper` numérico como si fuera una entrada? ¿Se supone que ese componente `Stepper` aumenta o disminuye cuando hace clic en los botones correctos?

Las personas a menudo se sienten más cómodas poniéndose el sombrero de usuario final cuando escriben pruebas de un extremo a otro porque no pueden acceder a ningún componente interno de la aplicación. Lo alentamos a que mantenga ese tipo de pensamiento al escribir sus pruebas de componentes.

Al hacerlo, obtendrá el mismo tipo de cobertura y beneficios que obtendría en una prueba de extremo a extremo sin las penalizaciones de velocidad, configuración y complejidad.

## Su Prueba Tiene una Audiencia

Las personas a menudo asignan etiquetas como "pruebas de integración" o "pruebas unitarias" cuando prueban componentes para tratar de describir las diferencias en detalle y la preocupación que puede tener una prueba.

En cambio, puede ser más fácil pensar en la audiencia de la prueba, sus objetivos y sus motivaciones.

Recuerde siempre que existe una prueba para probar (a alguien) que el código funciona "como se esperaba". Diferentes tipos de usuarios tendrán diferentes expectativas.
