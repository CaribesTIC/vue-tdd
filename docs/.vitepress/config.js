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
          { text: 'Pruebas Unitarias', link: '/comenzar/pruebas-unitarias' },
          { text: 'Entorno de Prueba', link: '/comenzar/entorno-de-prueba' }          
        ]
      }, {
        text: 'Vitest',   // required
        path: '/vitest/',
        collapsable: false, // optional, defaults to true        
        children: [
          { text: '¿Porqué Vitest?', link: '/vitest/porque-vitest' },
          { text: 'Comparadores', link: '/vitest/comparadores' },
          { text: 'Código Asíncrono', link: '/vitest/codigo-asincrono' },
          { text: 'Configuración y Desmontaje', link: '/vitest/configuracion-y-desmontaje' },
          { text: 'Funciones Simuladas', link: '/vitest/funciones-simuladas' }
        ]
      },{
        text: 'Vue Tests Utils',
        path: '/vtu/',
        collapsable: false,     
        children: [
          { text: '¿Qué es Vue Test Utils?', link: '/vtu/intro' },
          { text: 'Un Curso Acelerado', link: '/vtu/un-curso-acelerado' },
          { text: 'Renderizado Condicional', link: '/vtu/renderizado-condicional' }
        ]
      }
    ]
  }
}

