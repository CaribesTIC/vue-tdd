# Diferencias Clave

::: info Lo que aprenderás
- Lo que hace que Cypress sea único
- En qué se diferencia su arquitectura de Selenium
- Nuevos enfoques de prueba que no eran posibles antes
:::

## Arquitectura

La mayoría de las herramientas de prueba (como Selenium) funcionan ejecutándose fuera del navegador y ejecutando comandos remotos a través de la red. _Cypress es exactamente lo contrario_. Cypress se ejecuta en el mismo ciclo de ejecución que su aplicación.

Detrás de Cypress hay un proceso de servidor Node. Cypress y el proceso Node se comunican, sincronizan y realizan tareas constantemente en nombre del otro. Tener acceso a ambas partes (front y back) nos brinda la capacidad de responder a los eventos de su aplicación en tiempo real, mientras que al mismo tiempo trabajar fuera del navegador para tareas que requieren un mayor privilegio.

Cypress también opera en la capa de red al leer y alterar el tráfico web sobre la marcha. Esto le permite a Cypress no solo modificar todo lo que entra y sale del navegador, sino también cambiar el código que puede interferir con su capacidad para automatizar el navegador.

Cypress finalmente controla todo el proceso de automatización de arriba a abajo, lo que lo coloca en la posición única de poder comprender todo lo que sucede dentro y fuera del navegador. Esto significa que Cypress es capaz de brindar resultados más consistentes que cualquier otra herramienta de prueba.

Debido a que Cypress está [instalado localmente](https://docs.cypress.io/guides/getting-started/installing-cypress) en su máquina, también puede aprovechar el sistema operativo para tareas de automatización. Esto hace posible realizar tareas como [tomar capturas de pantalla, grabar videos](https://docs.cypress.io/guides/guides/screenshots-and-videos), generales [operaciones del sistema de archivos](https://docs.cypress.io/api/commands/exec) y [operaciones de red](https://docs.cypress.io/api/commands/request).

## Acceso nativo

Debido a que Cypress opera dentro de su aplicación, eso significa que tiene acceso nativo a todos los objetos. Ya sea la `window`, el `document`, un elemento DOM, la instancia de su aplicación, una función, un temporizador, un _service worker_ o cualquier otra cosa, tiene acceso a él en sus pruebas de Cypress. No hay serialización de objetos, no hay protocolo a través del cable: tiene acceso a todo. Su código de prueba puede acceder a todos los mismos objetos que su código de aplicación.

## Nuevo tipo de prueba

Tener el máximo control sobre su aplicación, el tráfico de la red y el acceso nativo a cada objeto host abre una nueva forma de prueba que nunca antes había sido posible. En lugar de estar siendo 'bloqueada' su aplicación y no poder controlarla fácilmente, Cypress le permite modificar cualquier aspecto de cómo funciona su aplicación. En lugar de pruebas lentas y costosas, como crear el estado requerido para una situación dada, puede crear estos estados artificialmente como lo haría en una prueba unitaria. Por ejemplo, puedes:

- [Talone](https://docs.cypress.io/api/commands/stub) el navegador o las funciones de su aplicación y oblíguelas a comportarse según sea necesario en su caso de prueba.

- Exponga los data stores (como en Vuex) para que pueda modificar mediante programación el estado de su aplicación directamente desde su código de prueba.

- Pruebe casos extremos como 'empty views' al obligar a su servidor a enviar empty responses.

- Pruebe cómo responde su aplicación a los errores en su servidor [modificando los códigos de estado de respuesta para que sean 500](https://docs.cypress.io/api/commands/route).

- Modifique los elementos DOM directamente, como obligar a que se muestren los elementos ocultos.

- Use complementos de terceros mediante programación. En lugar de preocuparse por _widgets_ de UI complejos como selecciones múltiples, autocompletar, menús desplegables, vistas de árbol o calendarios, puede llamar a métodos directamente desde su código de prueba para controlarlos.

- [Prevenga que Google Analytics se cargue antes de que se ejecute el código de su aplicación](https://docs.cypress.io/guides/references/configuration#blockHosts) durante la prueba.

- Reciba notificaciones sincrónicas cada vez que su aplicación cambie a una nueva página o cuando comience a descargarse.

- [Controle el tiempo avanzando o retrocediendo](https://docs.cypress.io/api/commands/clock) para que los temporizadores o las encuestas se activen automáticamente sin tener que esperar el tiempo requerido en sus pruebas.

- Agregue sus propios _listeners_ de eventos para responder a su aplicación. Puede actualizar el código de su aplicación para que se comporte de manera diferente cuando esté bajo pruebas en Cypress. Puede controlar los mensajes de WebSocket desde dentro de Cypress, cargar condicionalmente scripts de terceros o llamar a funciones directamente en su aplicación.

## Shortcuts

¿Intenta probar áreas de difícil acceso de su aplicación? ¿No te gustan los efectos secundarios que crea una acción? ¿Cansado de repetir las mismas acciones repetitivas y lentas una y otra vez? Puede omitirlos para la mayoría de los casos de prueba.

Cypress evita que te veas obligado a "actuar siempre como un usuario" para generar el estado de una situación determinada. Con Cypress puede interactuar mediante programación y controlar su aplicación. Ya no tiene que usar su interfaz de usuario para construir el estado.

Eso significa que no tiene que visitar una página de inicio de sesión, escribir un nombre de usuario y una contraseña y esperar a que la página se cargue y/o redirija para cada prueba que realice. Cypress le brinda la capacidad de tomar accesos directos e iniciar sesión mediante programación. Con comandos como [`cy.request()`](https://docs.cypress.io/api/commands/request), puede enviar solicitudes HTTP directamente y, sin embargo, sincronizar esas solicitudes con el navegador. Las cookies se envían y se vuelven a aplicar automáticamente. ¿Preocupado por CORS? Don't be, está completamente pasado por alto. El poder de elegir cuándo probar como un usuario y cuándo omitir partes lentas y repetitivas es tuyo.

## Flake resistant

Cypress conoce y entiende todo lo que sucede en su aplicación de forma sincrónica. Se notifica el momento en que se carga la página y el momento en que se descarga la página. Es imposible que Cypress pase por alto elementos cuando dispara eventos. Cypress incluso sabe qué tan rápido se está animando un elemento y [esperará a que deje de animarse](https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Animations). Además, [espera automáticamente a que los elementos se vuelvan visibles](https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Visibility), se [habiliten](https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Disability) y [dejen de estar cubiertos](https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Covering). Cuando las páginas comienzan la transición, Cypress pausará la ejecución del comando hasta que la siguiente página esté completamente cargada. Incluso puede decirle a Cypress que [espere](https://docs.cypress.io/api/commands/wait) a que finalicen las solicitudes de red específicas.

Cypress ejecuta la gran mayoría de sus comandos dentro del navegador, por lo que no hay retrasos en la red. Los comandos ejecutan y manejan su aplicación tan rápido como es capaz de renderizar. Para lidiar con frameworks JavaScript modernos con interfaces de usuario complejas, utiliza aserciones para decirle a Cypress cuál debería ser el estado deseado de su aplicación. Cypress esperará automáticamente a que su aplicación alcance este estado antes de continuar. Está completamente aislado de preocuparse por las esperas o reintentos manuales. Cypress espera automáticamente a que existan los elementos y nunca le proporcionará elementos obsoletos que se hayan separado del DOM.

## Debuggability

Por encima de todo, Cypress se ha creado para la facilidad de uso.

Hay cientos de mensajes de error personalizados que describen la razón exacta por la que Cypress no pasó la prueba.

Hay una UI enriquecida que le muestra visualmente la ejecución del comando, las afirmaciones, las solicitudes de red, los espías, los stubs, las cargas de página o los cambios de URL.

Cypress toma instantáneas de su aplicación y le permite viajar en el tiempo al estado en el que se encontraba cuando se ejecutaron los comandos.

Puede usar las Developer Tools mientras se ejecutan sus pruebas, puede ver cada mensaje de la consola, cada solicitud de red. Puede inspeccionar elementos e incluso puede usar declaraciones de depuración en su código de especificación o en su código de aplicación. No hay pérdida de fidelidad: puede usar todas las herramientas con las que ya se siente cómodo. Esto le permite probar y desarrollar todo al mismo tiempo.

## Trade-offs

Si bien hay muchas capacidades nuevas y poderosas de Cypress, también hay importantes compensaciones que hemos hecho para hacer esto posible.

Si está interesado en comprender más, se ha escrito [una guía completa](https://docs.cypress.io/guides/references/trade-offs) sobre este tema.
