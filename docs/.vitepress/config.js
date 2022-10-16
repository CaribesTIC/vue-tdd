export default {
  title: 'Vue(tdd)',
  description: 'TDD con Vue 3.',
  base: '/vue-tdd/', //  The default path during deployment / secondary address / base can be used/
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guía', link: '/comenzar/tdd' },
      { text: 'CaribesTIC', link: 'https://caribestic.github.io/' },
      { text: 'GitHub', link: 'https://github.com/CaribesTIC/vue-tdd' }
    ],
    sidebar: [{
      text: 'Comenzar',   // required
      path: '/comenzar/',      // optional, link of the title, which should be an absolute path and must exist        
      sidebarDepth: 1,    // optional, defaults to 1
      collapsible: true,
      collapsed: false, 
      items: [
        { text: 'Desarrollo Dirigido por Pruebas', link: '/comenzar/tdd' },
        { text: 'Pruebas Unitarias', link: '/comenzar/pruebas-unitarias' }                    
      ]
    }, {
      text: 'Vitest',   // required
      path: '/vitest/',
      collapsible: true,
      collapsed: true,        
      items: [
        { text: '¿Por Qué Vitest?', link: '/vitest/porque-vitest' },
        { text: 'Entorno de Prueba', link: '/vitest/entorno-de-prueba' },
        { text: 'Usando Comparadores', link: '/vitest/usando-comparadores' },
        { text: 'Configuración y Desmontaje', link: '/vitest/configuracion-y-desmontaje' },                  
        { text: 'Filtrando Pruebas', link: '/vitest/filtrando-pruebas' },
        { text: 'Probando Código Asíncrono', link: '/vitest/probando-codigo-asincrono' },          
        { text: 'Un Ejemplo Asíncrono', link: '/vitest/un-ejemplo-asincrono' },
        { text: 'Funciones Simuladas', link: '/vitest/funciones-simuladas' },
        { text: 'Simulaciones', link: '/vitest/simulaciones'},
        { text: 'Simulaciones de Temporizador', link: '/vitest/simulaciones-de-temporizador'},
        { text: 'Simulaciones de Clase ES6', link: '/vitest/simulaciones-de-clase-es6'}          
      ]
    },{
      text: 'Vue Tests Utils Esencial',
      path: '/vtu/esencial/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: '¿Qué es Vue Test Utils?', link: '/vtu/esencial/intro' },
        { text: 'Entorno de Prueba', link: '/vtu/esencial/entorno-de-prueba' },
        { text: 'Un Curso Acelerado', link: '/vtu/esencial/un-curso-acelerado' },              
        { text: 'Renderizado Condicional', link: '/vtu/esencial/renderizado-condicional' },              
        { text: 'Probando el Manejo de Eventos', link: '/vtu/esencial/manejo-de-eventos' },              
        { text: 'Probando Formularios', link: '/vtu/esencial/formularios' },              
        { text: 'Pasando Datos a Componentes', link: '/vtu/esencial/pasando-datos-a-componentes' },
        { text: 'Escribir componentes que sean fáciles de probar', link: '/vtu/esencial/escribir-componentes-que-sean faciles-de-probar' }
      ]
    }, {
      text: 'Vue Test Utils En Profundidad',
      path: '/vtu/vue-test-utils-en-profundidad/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: 'Ranuras', link: '/vtu/vue-test-utils-en-profundidad/ranuras' },
        { text: 'Comportamiento Asíncrono', link: '/vtu/vue-test-utils-en-profundidad/comportamiento-asincrono'},              
        { text: 'Realizando Solicitudes HTTP', link: '/vtu/vue-test-utils-en-profundidad/solicitudes-http' },              
        { text: 'Transiciones', link: '/vtu/vue-test-utils-en-profundidad/transiciones' },
        { text: 'Instancia de Componente', link: '/vtu/vue-test-utils-en-profundidad/instancia-de-componente' },
        { text: 'Reusabilidad & Composición', link: '/vtu/vue-test-utils-en-profundidad/reusabilidad-y-composicion' },
        { text: 'Probando Vuex', link: '/vtu/vue-test-utils-en-profundidad/probando-vuex' },
        { text: 'Un poco más sobre Vuex', link: '/vtu/vue-test-utils-en-profundidad/un-poco-mas-sobre-vuex' },
        { text: 'Probando Vue Router', link: '/vtu/vue-test-utils-en-profundidad/probando-vue-router' },
        { text: 'Probando Teleport', link: '/vtu/vue-test-utils-en-profundidad/probando-teleport' },
        { text: 'Talones y Montaje Superficial', link: '/vtu/vue-test-utils-en-profundidad/talones-y-montaje-superficial' }
      ]
    }, {
      text: 'Vue Testing Handbook',   // required
      path: '/vth/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: 'Renderizar Componentes', link: '/vth/renderizar-componentes' },
        { text: 'Probando Propiedades', link: '/vth/probando-propiedades' },
        { text: 'Propiedades Calculadas', link: '/vth/propiedades-calculadas' },
        { text: 'Simulando la entrada del usuario', link: '/vth/simulando-la-entrada-del-usuario' },
        { text: 'Probando Eventos Emitidos', link: '/vth/probando-eventos-emitidos' },
        { text: 'Simulando Objetos Globales', link: '/vth/simulando-objetos-globales' },
        { text: 'Talonando Componentes', link: '/vth/talonando-componentes' },
        { text: 'Encontrando elementos y componentes', link: '/vth/encontrando-elementos-y-componentes' },
        { text: 'Probando Vuex', link: '/vth/probando-vuex' },
        { text: 'Vuex Mutaciones', link: '/vth/vuex-mutaciones' },
        { text: 'Vuex Accciones', link: '/vth/vuex-acciones' },
        { text: 'Vuex Captadores', link: '/vth/vuex-captadores' },
        { text: 'Probando Vuex en componentes - estados y captadores', link: '/vth/probando-vuex-en-componentes' },
        { text: 'Probando Vuex en componentes - mutaciones y acciones', link: '/vth/probando-vuex-en-componentes-mutaciones-y-acciones' },  
        { text: 'Vue Router', link: '/vth/vue-router' },
        { text: 'API de Composición', link: '/vth/api-de-composicion' },
        { text: 'Reduciendo Repetitividad en las Pruebas', link: '/vth/reduciendo-repetitividad-en-las-pruebas' }          
      ]
    }, {
      text: 'Vue Testing Library Documentación',
      path: '/vtl/documentacion/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: '¿Qué es Testing Library?', link: '/vtl/documentacion/intro' },
        { text: 'Guías de Principios', link: '/vtl/documentacion/guias-de-principios' },
        { text: '¿Qué es Vue Testing Library?', link: '/vtl/documentacion/intro-v' },
        { text: 'Ejemplos', link: '/vtl/documentacion/ejemplos' },
      ]
    }, {
      text: 'Vue Testing Library Prueba Simples y Completas',
      path: '/vtl/psyc/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: 'Consultas DOM', link: '/vtl/psyc/consultas-dom' },
        { text: 'Filosofía', link: '/vtl/psyc/filosofia' },
        { text: 'getBy, queryBy y findBy', link: '/vtl/psyc/getby-queryby-findby' },
        { text: 'fireEvent y waitFor', link: '/vtl/psyc/fireevent-waitfor' },
        { text: 'findBy para consultas asincrónicas', link: '/vtl/psyc/findby-para-consultas-asincronicas' },
        { text: 'Trabajar con Formularios', link: '/vtl/psyc/trabajar-con-formularios' },
        { text: 'Enviar formularios y emitir eventos', link: '/vtl/psyc/enviar-formularios-y-emitir-eventos' },
        { text: 'Integración de Vue Test Utils y más ejemplos', link: '/vtl/psyc/itegracion-de-vue-test-utils-y-mas-ejemplos' }
      ]
    }, {
      text: 'Probando Pinia',
      path: '/pinia/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: '@pinia/testing', link: '/pinia/probando-pinia' }
      ]
    }, {
      text: 'Cypress Visión General',
      path: '/cypress-overview/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: '¿Por Qué Cypress?', link: '/cypress-overview/por-que-cypress' },
        { text: 'Diferencias Clave', link: '/cypress-overview/diferencias-clave' },              
      ]
    }, {
      text: 'Cypress Intro Component Testing',
      path: '/cypress-intro/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: 'Prueba de Componentes', link: '/cypress-intro/prueba-de-componentes' },
        { text: '¿Para Quién Estás Probando?', link: '/cypress-intro/para-quien-estas-probando' },       
      ]
    }, {
      text: 'Cypress Vue Component Testing',
      path: '/cypress-vtc/',
      collapsible: true,
      collapsed: true,      
      items: [
        { text: 'Inicio Rápido', link: '/cypress-vtc/inicio-rapido' },
        { text: 'Montando Componentes', link: '/cypress-vtc/montando-componentes' },
        { text: 'Probando Componentes', link: '/cypress-vtc/probando-componentes' },
        { text: 'Componentes con Eventos Emitidos', link: '/cypress-vtc/componentes-con-eventos-emitidos' },
        { text: 'Componentes con Slots', link: '/cypress-vtc/componentes-con-slots' }        
      ]
    }]
  }
}


