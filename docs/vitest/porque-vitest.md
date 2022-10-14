# ¿Por Qué Vitest?

## La necesidad de un corredor de pruebas nativo de Vite

Aquí no profundizaremos en debatir entre el uso [Webpack](https://webpack.js.org/) y [Vite](https://vitejs.dev/). Sin embargo, cabe mencionar que la historia de las pruebas unitarias de Vite no ha sido clara. Las opciones existentes como [Jest](https://jestjs.io/) se crearon en un contexto diferente. Hay mucha duplicación entre Jest y Vite, lo que obliga a los usuarios a configurar dos canalizaciones diferentes.

>**¿Qué tipos de pruebas unitarias con Vitest podemos hacer?** Vitest nos permite probar el código nativo de Javascript (vanilla) de nuestro proyecto.

El uso del servidor de desarrollo de Vite para transformar sus archivos durante las pruebas permite la creación de un corredor simple que no necesita lidiar con la complejidad de transformar archivos de origen y puede enfocarse únicamente en proporcionar el mejor DX durante las pruebas. Un ejecutor de pruebas que usa la misma configuración de su aplicación (a través de `vite.config.js`), compartiendo una canalización de transformación común durante el desarrollo, la compilación y el tiempo de prueba. Eso es extensible con la misma API de complemento que le permite a usted y a los mantenedores de sus herramientas brindar una integración de primera clase con Vite. Una herramienta que se construye con Vite en mente desde el principio, aprovechando sus mejoras en DX, como su Hot Module Reload (HMR) instantáneo. Esto es [Vitest](https://vitest.dev/), un marco de prueba de unidad ultrarrápido impulsado por Vite.

Dada la adopción masiva de Jest, Vitest proporciona una API compatible que le permite usarla como reemplazo directo en la mayoría de los proyectos. También incluye las características más comunes requeridas al configurar sus pruebas unitarias (simulacros, instantáneas, cobertura). Vitest se preocupa mucho por el rendimiento y utiliza subprocesos de Worker para ejecutar tanto como sea posible en paralelo. Algunos puertos han visto pruebas que se ejecutan un orden de magnitud más rápido. El modo de observación está habilitado de forma predeterminada, alineándose con la forma en que Vite impulsa una primera experiencia de desarrollo. Incluso con todas estas mejoras en DX, Vitest se mantiene liviano al elegir cuidadosamente sus dependencias (o directamente alineando las piezas necesarias).

Vitest tiene como objetivo posicionarse como el corredor de pruebas elegido para los proyectos de Vite y como una alternativa sólida incluso para los proyectos que no utilizan Vite.

## ¿En qué se diferencia Vitest de X?

Puede consultar la sección [Comparaciones](https://vitest.dev/guide/comparisons.html) para obtener más detalles sobre cómo Vitest se diferencia de otras herramientas similares.

---
Hablando de [comparación](../vitest/usando-comparadores.html), es momento de pasar al siguiente segmento.

