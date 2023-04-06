import{_ as s,c as a,o as n,N as e}from"./chunks/framework.6a8e5212.js";const u=JSON.parse('{"title":"Escribir componentes que sean fáciles de probar","description":"","frontmatter":{},"headers":[],"relativePath":"vtu/esencial/escribir-componentes-que-sean faciles-de-probar.md"}'),o={name:"vtu/esencial/escribir-componentes-que-sean faciles-de-probar.md"},l=e(`<h1 id="escribir-componentes-que-sean-faciles-de-probar" tabindex="-1">Escribir componentes que sean fáciles de probar <a class="header-anchor" href="#escribir-componentes-que-sean-faciles-de-probar" aria-label="Permalink to &quot;Escribir componentes que sean fáciles de probar&quot;">​</a></h1><p>Vue Test Utils lo ayuda a escribir pruebas para los componentes de Vue. Sin embargo, no hay mucho que VTU pueda hacer.</p><p>A continuación se incluye una lista de sugerencias para escribir código que sea más fácil de probar y para escribir pruebas que sean significativas y fáciles de mantener.</p><p>La siguiente lista proporciona una guía general y puede ser útil en escenarios comunes.</p><h2 id="no-probar-los-detalles-de-implementacion" tabindex="-1">No probar los detalles de implementación <a class="header-anchor" href="#no-probar-los-detalles-de-implementacion" aria-label="Permalink to &quot;No probar los detalles de implementación&quot;">​</a></h2><p>Piense en términos de entradas y salidas desde la perspectiva del usuario. Aproximadamente, esto es todo lo que debe tener en cuenta al escribir una prueba para un componente de Vue:</p><table><thead><tr><th>Entradas</th><th>Ejemplos</th></tr></thead><tbody><tr><td>Interacciones</td><td>Hacer click, escribir... cualquier interacción &quot;humana&quot;</td></tr><tr><td>Props</td><td>Los argumentos que recibe un componente</td></tr><tr><td>Flujos de datos</td><td>Datos entrantes de llamadas API, suscripciones de datos...</td></tr></tbody></table><table><thead><tr><th>Salidas</th><th>Ejemplos</th></tr></thead><tbody><tr><td>Elementos DOM</td><td>Cualquier nodo observable representado en el documento</td></tr><tr><td>Eventos</td><td>Eventos emitidos (usando <code>$emit</code>)</td></tr><tr><td>Efectos secundarios</td><td>Como <code>console.log</code> o llamadas API</td></tr></tbody></table><h2 id="todo-lo-demas-son-detalles-de-implementacion" tabindex="-1">Todo lo demás son detalles de implementación. <a class="header-anchor" href="#todo-lo-demas-son-detalles-de-implementacion" aria-label="Permalink to &quot;Todo lo demás son detalles de implementación.&quot;">​</a></h2><p>Observe cómo esta lista no incluye elementos como métodos internos, estados intermedios o incluso datos.</p><p>La regla general es que <strong>una prueba no debe fallar en un refactor</strong>, es decir, cuando cambiamos su implementación interna sin cambiar su comportamiento. Si eso sucede, la prueba podría depender de los detalles de implementación.</p><p>Por ejemplo, supongamos un componente de contador básico que presenta un botón para incrementar un contador:</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">class</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">paragraph</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">Times clicked: {{ count }}</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">p</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">@click</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">increment</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;">increment</span><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">button</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">template</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">data</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> count</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">methods</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">increment</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#89DDFF;">this.</span><span style="color:#A6ACCD;">count</span><span style="color:#89DDFF;">++</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;/</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;">&gt;</span></span></code></pre></div><p>Podríamos escribir la siguiente prueba:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">mount</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@vue/test-utils</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Counter </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@/Counter.vue</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">test</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">counter text updates</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">async</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">wrapper</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">Counter</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">paragraph</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">wrapper</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">find</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">.paragraph</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">paragraph</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">text</span><span style="color:#F07178;">())</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toBe</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Times clicked: 0</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">wrapper</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">setData</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> count</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">2</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">paragraph</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">text</span><span style="color:#F07178;">())</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toBe</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Times clicked: 2</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>Observe cómo aquí estamos actualizando sus datos internos y también confiamos en los detalles (desde la perspectiva del usuario) como las clases de CSS.</p><div class="tip custom-block"><p class="custom-block-title">CONSEJO</p><p>Tenga en cuenta que cambiar los datos o el nombre de la clase CSS haría que la prueba fallara. Sin embargo, el componente seguiría funcionando como se esperaba. Esto se conoce como <strong>falso positivo</strong>.</p></div><p>En cambio, la siguiente prueba intenta apegarse a las entradas y salidas enumeradas anteriormente:</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">mount</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@vue/test-utils</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> Counter </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@/Counter.vue</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">test</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">text updates on clicking</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">async</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">wrapper</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">mount</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">Counter</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">wrapper</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">text</span><span style="color:#F07178;">())</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toContain</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Times clicked: 0</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">button</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">wrapper</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">find</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">button</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">button</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">trigger</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">click</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">button</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">trigger</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">click</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">wrapper</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">text</span><span style="color:#F07178;">())</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toContain</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Times clicked: 2</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>Las bibliotecas como <a href="https://github.com/testing-library/vue-testing-library/" target="_blank" rel="noreferrer">Vue Testing Library</a> se basan en estos principios. Si está interesado en este enfoque, asegúrese de comprobarlo.</p><h2 id="construya-componentes-mas-pequenos-y-simples" tabindex="-1">Construya componentes más pequeños y simples <a class="header-anchor" href="#construya-componentes-mas-pequenos-y-simples" aria-label="Permalink to &quot;Construya componentes más pequeños y simples&quot;">​</a></h2><p>Una regla general es que si un componente hace menos, será más fácil probarlo.</p><p>Hacer componentes más pequeños los hará más componibles y más fáciles de entender. A continuación se incluye una lista de sugerencias para simplificar los componentes.</p><h2 id="extraer-llamadas-a-la-api" tabindex="-1">Extraer llamadas a la API <a class="header-anchor" href="#extraer-llamadas-a-la-api" aria-label="Permalink to &quot;Extraer llamadas a la API&quot;">​</a></h2><p>Por lo general, realizará varias solicitudes HTTP a lo largo de su aplicación. Desde una perspectiva de prueba, las solicitudes HTTP proporcionan entradas al componente y un componente también puede enviar solicitudes HTTP.</p><div class="tip custom-block"><p class="custom-block-title">CONSEJO</p><p>Consulte la guía <a href="./../vue-test-utils-en-profundidad/solicitudes-http.html">Realizando solicitudes HTTP</a> si no está familiarizado con la prueba de llamadas API.</p></div><h2 id="extraer-metodos-complejos" tabindex="-1">Extraer métodos complejos <a class="header-anchor" href="#extraer-metodos-complejos" aria-label="Permalink to &quot;Extraer métodos complejos&quot;">​</a></h2><p>A veces, un componente puede presentar un método complejo, realizar cálculos pesados o usar varias dependencias.</p><p>La sugerencia aquí es <strong>extraer este método e importarlo al componente</strong>. De esta forma, puede probar el método de forma aislada usando Vitest o cualquier otro corredor de prueba.</p><p>Esto tiene el beneficio adicional de terminar con un componente que es más fácil de entender porque la lógica compleja está encapsulada en otro archivo.</p><p>Además, si el método complejo es difícil de configurar o lento, es posible que desee simularlo para que la prueba sea más simple y rápida. Los ejemplos sobre <a href="./../vue-test-utils-en-profundidad/solicitudes-http.html">realizando solicitudes HTTP</a> son un buen ejemplo: ¡axios es una biblioteca bastante compleja!</p><h2 id="escribir-pruebas-antes-de-escribir-el-componente" tabindex="-1">Escribir pruebas antes de escribir el componente. <a class="header-anchor" href="#escribir-pruebas-antes-de-escribir-el-componente" aria-label="Permalink to &quot;Escribir pruebas antes de escribir el componente.&quot;">​</a></h2><p>¡No puede escribir código no verificable si escribe pruebas de antemano!</p><p>Nuestro <a href="./../esencial/un-curso-acelerado.html">Curso Acelerado</a> ofrece un ejemplo de cómo escribir pruebas antes del código conduce a componentes comprobables. También lo ayuda a detectar y probar casos extremos.</p>`,34),p=[l];function t(r,c,i,F,y,D){return n(),a("div",null,p)}const m=s(o,[["render",t]]);export{u as __pageData,m as default};
