# ¿Por Qué Cipress?

:::info Lo que aprenderás
- Qué es Cypress y por qué deberías usarlo
- La misión y en qué se cree
- Características claves de Cypress
- Tipos de pruebas para las que está diseñado Cypress

[Cypress in a Nutshell](https://www.youtube.com/watch?v=LcGHiFnBh3Y&t=11s)
:::

## En una palabra

Cypress es una herramienta de prueba de _frontend_ de próxima generación creada para la web moderna. Aborda los puntos débiles clave que enfrentan los desarrolladores y los ingenieros de control de calidad al probar aplicaciones modernas.

Hace posible:

- [Configurar pruebas](./por-que-cypress.html#configuracion-de-pruebas)
- [Escribir pruebas](./por-que-cypress.html#pruebas-de-escritura)
- [Ejecutar pruebas](./por-que-cypress.html#ejecutando-pruebas)
- [Pruebas de depuración](./por-que-cypress.html#pruebas-de-depuracion)

Cypress se compara con mayor frecuencia con Selenio; sin embargo, Cypress es fundamentalmente y arquitectónicamente diferente. Cypress no está limitado por las mismas restricciones que Selenium.

Esto le permite escribir pruebas **más rápidas**, **fáciles** y **confiables**.


## ¿Quién usa Cypress?

Los usuarios de Cypress suelen ser desarrolladores o ingenieros de control de calidad que crean aplicaciones web utilizando frameworks JavaScript modernos, como Vue.

Cypress le permite escribir todo tipo de pruebas:

- Pruebas de extremo a extremo
- Pruebas de integración
- Pruebas unitarias

Cypress puede probar cualquier cosa que se ejecute en un navegador.

## Ecosistema de Cypress

Cypress consta de una aplicación gratuita, de [código abierto](https://github.com/cypress-io/cypress), [instalada localmente](https://docs.cypress.io/guides/getting-started/installing-cypress) y un servicio de tablero para [registrar sus pruebas](https://docs.cypress.io/guides/dashboard/introduction).

- **Primero**: Cypress lo ayuda a configurar y comenzar a escribir pruebas todos los días mientras construye su aplicación localmente. _TDD en su mejor momento!_
- **Más tarde**: después de crear un conjunto de pruebas e [integrar Cypress](https://docs.cypress.io/guides/continuous-integration/introduction) con su proveedor de CI, el [Servicio de Tablero](https://docs.cypress.io/guides/dashboard/introduction) puede registrar sus ejecuciones de prueba. Nunca tendrás que preguntarte: ¿Por qué falló esto?



## Misíón de Cypress

:::info **_Nuestra misión:_**

_Nuestra misión es construir un ecosistema de código abierto próspero que mejore la productividad, haga que las pruebas sean una experiencia agradable y genere felicidad para los desarrolladores. Nos responsabilizamos de promover un proceso de prueba que **realmente funcione**._

_Creemos que nuestra documentación debe ser accesible. Esto significa permitir que nuestros lectores entiendan completamente no solo el **qué**, sino también el **por qué**._

_Queremos ayudar a los desarrolladores a crear una nueva generación de aplicaciones modernas más rápido, mejor y sin el estrés y la ansiedad asociados con la gestión de pruebas._

_Sabemos que para que podamos tener éxito debemos habilitar, nutrir y fomentar un ecosistema que prospere con el código abierto. Cada línea de código de prueba es una inversión en su **base de código**, nunca se asociará con nosotros como un servicio o empresa pagados. Las pruebas podrán ejecutarse y funcionar de forma independiente, siempre._

_Creemos que las pruebas necesitan mucho y estamos aquí para crear una herramienta, un servicio y una comunidad de la que todos puedan aprender y beneficiarse. Estamos resolviendo los puntos débiles más difíciles compartidos por todos los desarrolladores que trabajan en la web. Creemos en esta misión y esperamos que se una a nosotros para hacer de Cypress un ecosistema duradero que haga felices a todos._

_**Cypress**_
:::

## Características

Cypress viene completamente horneado, con pilas incluidas. Aquí hay una lista de cosas que puede hacer que ningún otro marco de prueba puede hacer:

- **Viaje en el Tiempo**: Cypress toma instantáneas mientras se ejecutan las pruebas. Pase el cursor sobre los comandos en el [Registro de Comandos](https://docs.cypress.io/guides/core-concepts/cypress-app#Command-Log) para ver exactamente lo que sucedió en cada paso.

- **Capacidad de Depuración**: deje de adivinar por qué fallan sus pruebas. [Depure directamente](https://docs.cypress.io/guides/guides/debugging) desde herramientas familiares como Developer Tools. Nuestros errores legibles y seguimientos de pila hacen que la depuración sea muy rápida.

- **Espera Automática**: nunca agregue esperas o sueños a sus pruebas. Cypress [espera automáticamente](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Cypress-is-Not-Like-jQuery) los comandos y las afirmaciones antes de continuar. No más infierno asincrónico.

- **Spies, Stubs, y Clocks**: verifique y [controle el comportamiento](https://docs.cypress.io/guides/guides/stubs-spies-and-clocks) de las funciones, las respuestas del servidor o los temporizadores. La misma funcionalidad que le encanta de las pruebas unitarias está al alcance de su mano.

- **Control de Tráfico de Red**: [controle, stube y pruebe](https://docs.cypress.io/guides/guides/network-requests) fácilmente casos extremos sin involucrar a su servidor. Puede bloquear el tráfico de la red como desee.

- **Resultados Consistentes**: Esta arquitectura no utiliza Selenium ni WebDriver. Salude a las pruebas rápidas, consistentes y confiables que no tienen escamas.

- **Capturas de Pantalla y Videos**: vea capturas de pantalla tomadas automáticamente en caso de falla, o videos de todo su conjunto de pruebas cuando se ejecuta desde la CLI.

- **Pruebas Entre Navegadores**: ejecute pruebas dentro de los navegadores de la familia Firefox y Chrome (incluidos Edge y Electron) de forma local y [óptima en una canalización de integración continua](https://docs.cypress.io/guides/guides/cross-browser-testing).

## Configuración de pruebas

No hay servidores, controladores ni ninguna otra dependencia para instalar o configurar. Puede escribir su primera prueba de aprobación en 60 segundos.

<video controls>
  <source src="./img/installing-cli.3465fe6.mp4">
</video>


## Pruebas de escritura

Las pruebas escritas en Cypress están diseñadas para ser fáciles de leer y comprender. La API viene completamente integrada, además de las herramientas con las que ya está familiarizado.


<video controls>
  <source src="./img/writing-tests.9fe5100.mp4">
</video>


## Ejecutando pruebas

Cypress se ejecuta tan rápido como su navegador puede procesar el contenido. Puede ver cómo se ejecutan las pruebas en tiempo real a medida que desarrolla sus aplicaciones. TDD FTW!


<video controls>
  <source src="./img/running-tests.bd9a8e2.mp4">
</video>


## Pruebas de depuración

Los mensajes de error legibles lo ayudan a depurar rápidamente. También tiene acceso a todas las herramientas de desarrollo que conoce y ama.

<video controls>
  <source src="./img/debugging.c6ef6ea.mp4">
</video>

## Tipos de prueba

Cypress se puede utilizar para escribir varios tipos diferentes de pruebas. Esto puede proporcionar aún más confianza de que su aplicación bajo prueba está funcionando según lo previsto.



## End-to-end

Cypress se diseñó originalmente para ejecutar pruebas de extremo a extremo (E2E) en cualquier cosa que se ejecute en un navegador. Una prueba E2E típica visita la aplicación en un navegador y realiza acciones a través de la interfaz de usuario como lo haría un usuario real.

```js
it('adds todos', () => {
  cy.visit('https://todo.app.com')
  cy.get('[data-testid="new-todo"]')
    .type('write code{enter}')
    .type('write tests{enter}')
  // confirm the application is showing two items
  cy.get('[data-testid="todos"]').should('have.length', 2)
})
```

## Componente

También puede usar Cypress para montar componentes desde marcos web compatibles y ejecutar [pruebas de componentes](../cypress-intro/prueba-de-componentes.html).


```js
import TodoList from './components/TodoList'

it('contains the correct number of todos', () => {
  const todos = [
    { text: 'Buy milk', id: 1 },
    { text: 'Learn Component Testing', id: 2 },
  ]

  cy.mount(TodoList, { props: { todos } })  
  // the component starts running like a mini web app
  cy.get('[data-testid="todos"]').should('have.length', todos.length)
})
```

## API

Cypress puede realizar llamadas HTTP arbitrarias, por lo que puede usarlo para pruebas de API.

```js
it('adds a todo', () => {
  cy.request({
    url: '/todos',
    method: 'POST',
    body: {
      title: 'Write REST API',
    },
  })
    .its('body')
    .should('deep.contain', {
      title: 'Write REST API',
      completed: false,
    })
})
```

## Otro

Finalmente, a través de una gran cantidad de [complementos oficiales y de terceros](https://docs.cypress.io/plugins/directory), puede escribir Cypress [a11y](https://github.com/component-driven/cypress-axe), [visual](https://docs.cypress.io/plugins/directory#Visual%20Testing), [correo electrónico](https://docs.cypress.io/faq/questions/using-cypress-faq#How-do-I-check-that-an-email-was-sent-out) y otros tipos de pruebas.


## Cipress en el Mundo Real

![real-world](./img/real-world.png)

Cypress hace que sea rápido y fácil comenzar a probar, y cuando comience a probar su aplicación, **a menudo se preguntará si está utilizando las mejores prácticas o estrategias escalables**.

Para guiar el camino, el equipo de Cypress ha creado [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app), una aplicación de ejemplo de pila completa que demuestra las pruebas con **Cypress en escenarios prácticos y realistas**.

El RWA logra una [cobertura de código](https://docs.cypress.io/guides/tooling/code-coverage) completa con pruebas de un extremo a otro [a través de  múltiples navegadores](https://docs.cypress.io/guides/guides/cross-browser-testing) y [tamaños de dispositivos](https://docs.cypress.io/api/commands/viewport), pero también incluye [pruebas de regresión visual](https://docs.cypress.io/guides/tooling/visual-testing), pruebas de API, pruebas unitarias y las ejecuta todas en una [tubería CI eficiente](https://dashboard.cypress.io/projects/7s5okt). Utilice el RWA para **aprender, experimentar, modificar y practicar** las pruebas de aplicaciones web con Cypress.

La aplicación incluye todo lo que necesita, [simplemente clone el repositorio](https://github.com/cypress-io/cypress-realworld-app) y comience a probar.
