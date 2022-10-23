# Instalando Cypress

:::info Lo que aprenderás
- Cómo instalar Cypress a través de npm
- Cómo instalar Cypress mediante descarga directa
- Cómo versionar y ejecutar Cypress a través de `package.json`
:::

Primero, asegúrese de tener todos los [requisitos del sistema](./instalando-cypress.html#requisitos-del-sistema).

## Instalación

## `npm install`

Instale Cypress a través de npm:

```bash
cd /your/project/path
```

```bash
npm install cypress --save-dev
```

Esto instalará Cypress localmente como una dependencia de desarrollo para su proyecto.

>Asegúrese de haber ejecutado [`npm init`](https://docs.npmjs.com/cli/v8/commands/npm-init) o tener una carpeta `node_modules` o un archivo `package.json` en la raíz de su proyecto para asegurarse de que cypress esté instalado en el directorio correcto.

<video controls>
  <source src="./img/installing-cli.3465fe6.mp4">
</video>

:::info Nota
Tenga en cuenta que el paquete `npm` Cypress es un contenedor del binario Cypress. La versión del paquete `npm` determina la versión del binario descargado. A partir de la versión `3.0`, el binario se descarga en un directorio de caché global para usarse en todos los proyectos.

Las propiedades del proxy del sistema `http_proxy`, `https_proxy` y `no_proxy` se respetan para la descarga del binario Cypress. También puede usar las propiedades de npm `npm_config_proxy` y `npm_config_https_proxy`. Esos tienen una prioridad más baja, por lo que solo se usarán si las propiedades del sistema se resuelven para no usar un proxy.
:::

:::tip Mejores prácticas
El enfoque recomendado es instalar Cypress con npm porque:

- Cypress se versiona como cualquier otra dependencia.
- Simplifica la ejecución de Cypress en integración continua.
:::

## `yarn add`

Instalación de Cypress a través de [`yarn`](https://yarnpkg.com/):

```bash
cd /your/project/path
```

```bash
yarn add cypress --dev
```

Las propiedades del proxy del sistema `http_proxy`, `https_proxy` y `no_proxy` se respetan para la descarga del binario Cypress.


## Descarga directa

Si no está utilizando Node o `npm` en su proyecto o desea probar Cypress rápidamente, siempre puede [descargar Cypress directamente desde su CDN](https://download.cypress.io/desktop).

:::warning Advertencia
El registro de ejecuciones en el Dashboard no es posible desde la descarga directa. Esta descarga solo pretende ser una forma rápida de probar Cypress. Para registrar pruebas en el Dashboard, deberá instalar Cypress como una dependencia de `npm`.
:::

La descarga directa siempre obtendrá la última versión disponible. Su plataforma será detectada automáticamente.

Luego puede descomprimir manualmente y hacer doble clic. Cypress se ejecutará sin necesidad de instalar ninguna dependencia.

<video controls>
  <source src="./img/installing-global.437b00b.mp4">
</video>

:::info Descarga directa para versiones antiguas

Es posible descargar una versión anterior del CDN agregando el sufijo URL con la versión deseada (por ejemplo, https://download.cypress.io/desktop/6.8.0).
:::

## Instalación Avanzada

Si tiene requisitos más complejos, desea mejorar su flujo de trabajo de Cypress o simplemente necesita ayuda para solucionar problemas, consulte la referencia de [instalación avanzada](https://docs.cypress.io/guides/references/advanced-installation).

## Integración Continua

Lea los documentos de [Integración Continua](https://docs.cypress.io/guides/continuous-integration/introduction) para obtener ayuda con la instalación de Cypress en CI. Cuando se ejecuta en Linux, deberá instalar algunas [dependencias del sistema](https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies) o puede usar las [imágenes de Docker](https://docs.cypress.io/examples/examples/docker) que tienen todo lo que necesita prediseñado.

## Requisitos del sistema

## Sistema Operativo

Cypress es una aplicación de escritorio que se instala en su computadora. La aplicación de escritorio es compatible con estos sistemas operativos:

- **macOS** 10.9 y superior (Intel o Apple Silicon de 64 bits (x64 o arm64))
- **Linux** Ubuntu 12.04 y superior, Fedora 21 y Debian 8 (x86_64 o Arm de 64 bits (x64 o arm64)) (consulte los [requisitos previos](./instalando-cypress.html#requisitos-previos-de-linux) de Linux a continuación)
- **Windows** 7 y superior (solo 64 bits)

## Node.js

Si está utilizando `npm` para instalar Cypress, se admite:

- Node.js 12 o 14 y superior

## Hardware

Cuando se ejecuta Cypress localmente, debería ejecutarse cómodamente en cualquier máquina que sea capaz de desarrollar una web moderna.

Sin embargo, cuando se ejecuta Cypress en CI, es posible que algunas de las configuraciones de nivel inferior no puedan ejecutar Cypress de manera confiable, especialmente cuando se graban videos o se realizan pruebas más largas.

Algunos problemas con los que se puede encontrar en CI que podrían ser un signo de recursos insuficientes son:

- Salir temprano durante el `run cypress` o cerrar abruptamente ("chocarse")
- Marcos congelados o faltantes en el video que se captura
- Mayor tiempo de ejecución

Al ejecutar Cypress en CI, le recomendamos que tenga los siguientes requisitos de hardware:

## CPU

- 2 CPU mínimo para ejecutar Cypress
- 1 CPU adicional si la grabación de video está habilitada
- 1 CPU adicional por proceso que ejecute fuera de Cypress, como:
    - Servidor de aplicaciones (frontend)
    - Servidor de aplicaciones (backend)
    - Base de datos de la aplicación
    - Cualquier infraestructura adicional (Redis, Kafka, etc.)

## Memoria

- Mínimo de 4GB, 8GB+ para ejecuciones de prueba más largas
     
## Requisitos Previos de Linux

Si está utilizando Linux, querrá tener las dependencias necesarias instaladas en su sistema.

## Ubuntu/Debian

```bash
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

## CentOS

```bash
yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib
```

## Docker

Las imágenes de Docker con todas las dependencias requeridas instaladas están disponibles en [cypress/base](https://github.com/cypress-io/cypress-docker-images)

Si está ejecutando sus proyectos en contenedores, querrá Cypress en el contenedor con el proceso Node.js.

```bash
ui:
    image: cypress/base:latest
    # if targeting a specific node version, use e.g.
    # image: cypress/base:14
```

`cypress/base` es un reemplazo directo para las [images base docker de node](https://hub.docker.com/_/node/).

Genial, ¡ahora [instala Cypress!](./instalando-cypress.html#instalando-cypress)

## Próximos pasos

¡Abre la aplicación y pruébala!
