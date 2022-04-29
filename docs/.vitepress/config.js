module.exports = {
  title: 'Vue(tdd)',
  description: 'TDD con Vue 3.',
  base: '/vue-tdd/', //  The default path during deployment / secondary address / base can be used/
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/comenzar/tdd' },
      { text: 'GitHub', link: 'https://github.com/CaribesTIC/vue-tdd' }
    ],
    sidebar: [{
        text: 'Comenzar',   // required
        path: '/comenzar/',      // optional, link of the title, which should be an absolute path and must exist        
        sidebarDepth: 1,    // optional, defaults to 1
        children: [
          { text: 'Desarrollo Dirigido por Pruebas', link: '/comenzar/tdd' },
          { text: 'Pruebas Unitarias', link: '/comenzar/pruebas-unitarias' }                    
        ]
      }, {
        text: 'Vitest',   // required
        path: '/vitest/',
        collapsable: true, // optional, defaults to true        
        children: [
          { text: '¿Por qué Vitest?', link: '/vitest/porque-vitest' },
          { text: 'Entorno de Prueba', link: '/vitest/entorno-de-prueba' },
          { text: 'Comparadores', link: '/vitest/comparadores' },
          { text: 'Código Asíncrono', link: '/vitest/codigo-asincrono' },
          { text: 'Configuración y Desmontaje', link: '/vitest/configuracion-y-desmontaje' },
          { text: 'Funciones Simuladas', link: '/vitest/funciones-simuladas' }
        ]
      },{
        text: 'Vue Tests Utils',
        path: '/vtu/',
        collapsable: true,     
        children: [
          {
            text: 'Esencial',
            path: '/vtu/esencial/',
            collapsable: true,     
            children: [
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
            text: 'Vue Test Utils en-profundidad',
            path: '/vtu/vue-test-utils-en-profundidad/',
            collapsable: true,     
            children: [
              { text: 'Ranuras', link: '/vtu/vue-test-utils-en-profundidad/ranuras' },
              { text: 'Comportamiento Asíncrono', link: '/vtu/vue-test-utils-en-profundidad/comportamiento-asincrono'},              
              { text: 'Realizando Solicitudes HTTP', link: '/vtu/vue-test-utils-en-profundidad/solicitudes-http' },              
              { text: 'Transiciones', link: '/vtu/vue-test-utils-en-profundidad/transiciones' },
              { text: 'Instancia de Componente', link: '/vtu/vue-test-utils-en-profundidad/instancia-de-componente' },
              { text: 'Reusabilidad & Composición', link: '/vtu/vue-test-utils-en-profundidad/reusabilidad-y-composicion' },
              { text: 'Probando Vuex', link: '/vtu/vue-test-utils-en-profundidad/probando-vuex' },
              { text: 'Un poco más sobre Vuex', link: '/vtu/vue-test-utils-en-profundidad/un-poco-mas-sobre-vuex' },
              { text: 'Probando VueRouter', link: '/vtu/vue-test-utils-en-profundidad/probando-vuerouter' }              
            ]
          },
        ]
      }
    ]
  }
}

