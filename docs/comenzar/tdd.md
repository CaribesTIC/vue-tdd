# Desarrollo Dirigido por Pruebas

## Test Driven Development (TDD)

Es una técnica de ingeniería de software, que dirige el desarrollo de un producto a través de la escritura de pruebas, generalmente pruebas unitarias.

TDD fue desarrollado por Kent Beck a fines de la década de 1990 y es parte de la metodología XP (Programación eXtrema). Su autor y los seguidores de la TDD aseguran que con esta técnica se obtiene un código más tolerante al cambio, robusto, seguro, más económico de mantener e, incluso, una vez que te acostumbras a aplicarlo, promete mayor velocidad a la hora de desarrollar.

## Las tres leyes de TDD

- No escribirá código de producción sin antes escribir una prueba que falle.
- No escribirá más de una prueba de unidad suficiente para fallar (y no compilar es fallar).
- No escribirás más código del necesario para pasar la prueba.

Estas tres leyes conducen a la repetición de lo que se conoce como el ciclo Rojo-Verde-Refactor. Veamos en qué consiste:

## El ciclo Rojo-Verde-Refactor

El ciclo Red-Green-Refactor, también conocido como algoritmo TDD, se basa en:

1. **Rojo:** Escribir una prueba que falla, es decir, tenemos que realizar la prueba antes de escribir la implementación. Normalmente se utilizan pruebas unitarias, aunque en algunos contextos puede tener sentido hacer TDD con pruebas de integración.
2. **Verde:** Una vez creada la prueba que falla, implementaremos el código mínimo necesario para que la prueba pase.
3. **Refactor:** finalmente, después de que nuestro código pase la prueba, debemos examinarlo para ver si hay alguna mejora que podamos hacer.

- Una vez que hemos cerrado el ciclo, comenzamos de nuevo con el siguiente requisito.

Esta forma de programar ofrece dos ventajas principales. La primera y más obvia es que obtenemos código con buena cobertura de prueba, lo cual es positivo hasta cierto punto. Recuerde, nos pagan para escribir código que funcione, no para probar.

El segundo beneficio es que escribir las pruebas primero nos ayuda a diseñar la API que va a tener nuestro componente, ya que nos obliga a pensar cómo queremos usarlo. Esto a menudo termina dando lugar a componentes con responsabilidades bien definidas y poco acoplamiento.

## Limitaciones de TDD

Por muchos beneficios inherentes que tenga (o se prometan), la técnica TDD no debe entenderse como una religión o una fórmula mágica que sirve para todo. Seguir TDD al pie de la letra y en todos los contextos no garantiza que su código sea más tolerante al cambio, robusto o seguro, ni siquiera garantiza que será más productivo al diseñar software.

Según el punto de vista de algunos expertos, aplicar TDD no encaja bien en todos los contextos. Por ejemplo, si hay una implementación obvia para un caso de uso, la escribo directamente y luego hago las pruebas. En el caso de trabajar en el frontend, tampoco considero hacer TDD para diseñar componentes de UI. Incluso es discutible si se deben realizar pruebas unitarias para probar los elementos de la interfaz de usuario. Los grandes desarrolladores han comentado en repetidas ocasiones que no es conveniente hacer pruebas automatizadas sobre estos, ya que es muy cambiante y las pruebas quedan desactualizadas con demasiada frecuencia.

El consejo es que lo pruebes, intentes aplicarlo en tu día a día durante un tiempo y luego decidas por ti mismo.
