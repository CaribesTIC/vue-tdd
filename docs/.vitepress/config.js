module.exports = {
  title: 'Vue(tdd)',
  description: 'TDD con Vue 3.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/comenzar/' },
      { text: 'External', link: 'https://google.com' }
    ],
    sidebar: [{
        text: 'Comenzar',   // required
        path: '/comenzar/',      // optional, link of the title, which should be an absolute path and must exist        
        sidebarDepth: 1,    // optional, defaults to 1
        children: [
          { text: 'Test Driven Development', link: '/comenzar/tdd' },
          { text: 'Entorno de prueba', link: '/comenzar/entorno-de-prueba' }          
        ]
      }, {
        text: 'Pruebas Unitarias',   // required
        path: '/pruebas-unitarias/',
        collapsable: false, // optional, defaults to true        
        children: [
          { text: 'Pruebas Unitarias', link: '/pruebas-unitarias/pruebas-unitarias' },
          { text: 'Comparadores', link: '/pruebas-unitarias/comparadores' },
          { text: 'Código asíncrono', link: '/pruebas-unitarias/codigo-asincrono' }
        ]
      }
    ]
  }
}

