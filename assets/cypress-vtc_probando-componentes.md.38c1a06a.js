import{_ as s,c as n,o as a,N as o}from"./chunks/framework.6a8e5212.js";const d=JSON.parse('{"title":"Probando Componentes","description":"","frontmatter":{},"headers":[],"relativePath":"cypress-vtc/probando-componentes.md"}'),e={name:"cypress-vtc/probando-componentes.md"},p=o(`<h1 id="probando-componentes" tabindex="-1">Probando Componentes <a class="header-anchor" href="#probando-componentes" aria-label="Permalink to &quot;Probando Componentes&quot;">​</a></h1><p>Ahora que el componente está montado, el siguiente paso es comenzar a seleccionar e interactuar con partes del componente. Este es el paso <strong>Actuar</strong> en &quot;Arreglar, Actuar, Afirmar&quot;.</p><p>Una vez que hayamos terminado de actuar sobre el componente, podemos verificar que el estado esperado del componente es el que creemos que debería ser. Este es el paso <strong>Afirmar</strong>.</p><h2 id="seleccionando-el-componente-paso-a-paso" tabindex="-1">Seleccionando el Componente Paso a Paso <a class="header-anchor" href="#seleccionando-el-componente-paso-a-paso" aria-label="Permalink to &quot;Seleccionando el Componente Paso a Paso&quot;">​</a></h2><p>De forma predeterminada, el contador del componente <code>Stepper</code> se inicializa en <code>0</code>. También tiene un propiedad que puede especificar un conteo inicial.</p><p>Probemos que montar el componente (Arrange) en su estado predeterminado tiene un conteo de <code>0</code> (Assert).</p><p>Luego, probaremos que configurar el conteo inicial también funciona.</p><p>En su archivo de especificaciones, agregue lo siguiente dentro del bloque <code>describe</code> existente:</p><p>📃<code>Stepper.cy.js</code></p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// Set up some constants for the selectors</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> counterSelector </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">[data-cy=counter]</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> incrementSelector </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">[aria-label=increment]</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> decrementSelector </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">[aria-label=decrement]</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">it</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">stepper should default to 0</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Arrange</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">Stepper</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Assert</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">counterSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">should</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">have.text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">0</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">it</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">supports an &quot;initial&quot; prop to set the value</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Arrange</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">Stepper</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> props</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> initial</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">100</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Assert</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">counterSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">should</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">have.text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">100</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Dependiendo de su versión de Vue, la sintaxis de cómo montar su componente cambiará ligeramente. Consulte la <a href="https://test-utils.vuejs.org/" target="_blank" rel="noreferrer">documentación de Vue Test Utils</a> para obtener la sintaxis más reciente al usar la Object API de la función <code>mount</code>.</p><p>La principal diferencia es que <code>props</code> debe ser <code>propsData</code> para aplicaciones Vue 2.</p></div><h2 id="¿que-mas-debe-probar-en-este-componente" tabindex="-1">¿Qué Más Debe Probar en Este Componente? <a class="header-anchor" href="#¿que-mas-debe-probar-en-este-componente" aria-label="Permalink to &quot;¿Qué Más Debe Probar en Este Componente?&quot;">​</a></h2><p>En las pruebas anteriores, arreglamos y afirmamos, pero no actuamos sobre el componente. También deberíamos probar que cuando un usuario interactúa con el componente haciendo clic en los botones <code>increment</code> y <code>decrement</code> el valor de <code>count</code> cambia.</p><p>Sin embargo, haremos una pausa aquí.</p><p>Notará que estamos hablando de cómo un usuario interactuaría con el componente, y no de conceptos técnicos específicos de Vue.</p><p>Puede realizar una prueba completa y bien escrita para nuestro componente <code>Stepper</code> abordando esta prueba como lo haría un usuario.</p><p>No pienses en <code>data</code>, <code>methods</code> o <code>props</code>. Piense únicamente en la interfaz de usuario y use su prueba para automatizar lo que haría naturalmente como usuario.</p><p>Probarás el componente a fondo sin perderte en los detalles. Todo lo que importa es que si el desarrollador usa el componente con una API dada, el usuario final podrá usarlo como se espera.</p><p>¡Ahora, probemos el componente <code>Stepper</code>! Agregue las siguientes pruebas:</p><ol><li>Puedes incrementar y disminuir el paso a paso.</li></ol><p>📃<code>Stepper.cy.js</code></p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">it</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">when the increment button is pressed, the counter is incremented</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Arrange</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">Stepper</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Act</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">incrementSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Assert</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">counterSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">should</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">have.text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">1</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">it</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">when the decrement button is pressed, the counter is decremented</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Arrange</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">Stepper</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Act</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">decrementSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// Assert</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">counterSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">should</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">have.text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">-1</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><ol start="2"><li>A continuación, ejecute el comportamiento del <code>Stepper</code> como lo haría un usuario. Hay duplicación de cobertura aquí, pero está bien porque ejercita el componente en un uso más real. Es más probable que esta prueba falle si hay algún problema en el componente, no solo con botones específicos o el texto representado.</li></ol><p>📃<code>Stepper.cy.js</code></p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">it</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">when clicking increment and decrement buttons, the counter is changed as expected</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">Stepper</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> props</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> initial</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">100</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">counterSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">should</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">have.text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">100</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">incrementSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">counterSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">should</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">have.text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">101</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">decrementSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">cy</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">counterSelector</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">should</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">have.text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">99</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="aprende-mas" tabindex="-1">Aprende Más <a class="header-anchor" href="#aprende-mas" aria-label="Permalink to &quot;Aprende Más&quot;">​</a></h2><p>La guía <a href="https://docs.cypress.io/guides/core-concepts/introduction-to-cypress" target="_blank" rel="noreferrer">Introducción a Cypress</a> profundiza en cómo escribir pruebas con Cypress.</p><h2 id="¿que-sigue" tabindex="-1">¿Qué Sigue? <a class="header-anchor" href="#¿que-sigue" aria-label="Permalink to &quot;¿Qué Sigue?&quot;">​</a></h2><p>Vamos a emitir un evento personalizado desde nuestro componente <code>Stepper</code> y aprenderemos cómo probar que fue llamado.</p>`,29),l=[p];function t(c,r,F,y,D,i){return a(),n("div",null,l)}const u=s(e,[["render",t]]);export{d as __pageData,u as default};
