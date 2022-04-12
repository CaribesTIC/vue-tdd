# Pruebas unitarias

Las pruebas unitarias o unit testing son una forma de comprobar que un fragmento de código funciona correctamente.

## ¿Qué son las pruebas unitarias?

Las pruebas unitarias consisten en aislar una parte del código y comprobar que funciona a la perfección. Son pequeños tests que validan el comportamiento de un objeto y la lógica.

El unit testing suele realizarse durante la fase de desarrollo de aplicaciones de software o móviles. Normalmente las llevan a cabo los desarrolladores, aunque en la práctica, también pueden realizarlas los responsables de QA.

Hay una especie de mito respecto a las pruebas unitarias. Algunos desarrolladores están convencidos de que son una pérdida de tiempo y las evitan buscando ahorrar tiempo.
Nada más alejado de la realidad.

Con ellas se detectan antes errores que, sin las pruebas unitarias, no se podrían detectar hasta fases más avanzadas como las pruebas de sistema, de integración e incluso en la beta.

Realizar pruebas unitarias con regularidad supone, al final, un ahorro de tiempo y dinero.

## Motivos para realizar un test unitario

Si todavía no estás del todo seguro de por qué debes incorporar las unit testing a tu día a día como desarrollador, te damos algunos motivos:

- Las pruebas unitarias demuestran que la **lógica del código** está en buen estado y que funcionará en todos los casos.
- Aumentan la **legibilidad del código** y ayudan a los desarrolladores a entender el código base, lo que facilita hacer cambios más rápidamente.
- Los test unitarios bien realizados sirven como **documentación** del proyecto.
- Se realizan en **pocos milisegundos**, por lo que podrás realizar cientos de ellas en muy poco tiempo.
- Las unit testing permiten al desarrollador **refactorizar el código** más adelante y tener la garantía de que el módulo sigue funcionando correctamente. Para ello se escriben casos de prueba para todas las funciones y métodos, para que cada vez que un cambio provoque un error, sea posible identificarlo y repararlo rápidamente.
- La **calidad final** del código mejorará ya que, al estar realizando pruebas de manera continua, al finalizar el código será limpio y de calidad.
- Como las pruebas unitarias dividen el código en pequeños fragmentos, es posible **probar distintas partes del proyecto** sin tener que esperar a que otras estén completadas.

## Buenas prácticas para los tests unitarios

Una vez te acostumbres a realizar este tipo de pruebas irás descubriendo todas sus ventajas. Sin embargo, si todavía no tienes experiencia, vamos a ver algunos **ejemplos de buenas prácticas en las pruebas unitarias de software**.

- **Las pruebas unitarias deberían ser independientes.** Si se produce cualquier tipo de mejora o cambio en los requerimientos, las pruebas unitarias no deberían verse afectados.
- **Prueba sólo un código a la vez.**
- **Sigue un esquema claro.** Puede parecer algo secundario, pero no lo es. Sé también consistente a la hora de nombrar tus unit tests.
- **Cualquier cambio necesita pasar el test.** En el caso de producirse un cambio en el código de cualquier módulo, asegúrate de que hay una prueba unitaria que se corresponda con ese módulo y que este pasa las pruebas antes de cambiar la implementación.
- **Corrige los bugs identificados durante las pruebas antes de continuar.** Asegúrate de realizar esta corrección antes de proseguir con la siguiente fase del ciclo de vida del desarrollo de software.
- **Acostúmbrate a realizar pruebas regularmente mientras programas.** Cuanto más código escribas sin testar, más caminos tendrás que revisar para encontrar errores.

No puedes esperar que las pruebas unitarias descubran todos los errores de un software, pero sí que ahorran mucho tiempo al facilitar localizar los errores de una manera más sencilla.

