import{_ as s,c as a,o as n,N as o}from"./chunks/framework.6a8e5212.js";const A=JSON.parse('{"title":"findBy para consultas asincrónicas","description":"","frontmatter":{},"headers":[],"relativePath":"vtl/psyc/findby-para-consultas-asincronicas.md"}'),l={name:"vtl/psyc/findby-para-consultas-asincronicas.md"},p=o(`<h1 id="findby-para-consultas-asincronicas" tabindex="-1"><code>findBy</code> para consultas asincrónicas <a class="header-anchor" href="#findby-para-consultas-asincronicas" aria-label="Permalink to &quot;\`findBy\` para consultas asincrónicas&quot;">​</a></h1><div class="info custom-block"><p class="custom-block-title">Prueba</p><p><a href="https://www.youtube.com/watch?v=6UypB6LRysc&amp;list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&amp;index=5" target="_blank" rel="noreferrer">Esta lección en video</a></p></div><p>Hasta ahora hemos visto algunas formas en que Vue Testing Library difiere de Vue Test Utils. Cuando llamamos <code>fireEventet</code> en lugar de usar <code>trigger</code> y <code>waitFor</code> en lugar usar <code>nextTick</code>.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#676E95;font-style:italic;">// tests/components/helloworld.spec.js</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">render</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fireEvent</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">waitFor</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@testing-library/vue</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@testing-library/jest-dom</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> HelloWorld </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@/components/HelloWorld.vue</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">describe</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">HelloWorld.vue</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">it</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">renders props.msg when passed</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">async</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">new message</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">    </span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">render</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">HelloWorld</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      props</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">fireEvent</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">(</span></span>
<span class="line highlighted"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getByRole</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">show-text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    )</span></span>
<span class="line"><span style="color:#F07178;">    </span></span>
<span class="line highlighted"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">waitFor</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span></span>
<span class="line highlighted"><span style="color:#F07178;">      </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getByText</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;">))</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toBeInTheDocument</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">    )    </span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>Lo que vamos a hacer ahora es un pequeño refactor para hacer esto aún mejor. Vamos a comentar estas tres líneas para que aún podamos tenerlas.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// await waitFor(() =&gt;</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   expect(screen.getByText(msg)).toBeInTheDocument()</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// )</span></span></code></pre></div><p>Lo que haremos será cambiar ligeramente nuestras afirmaciones. En lugar de usar <code>waitFor</code>, ahora usaremos el selector <code>findByText</code>, del que hablamos previamente. Recordemos que este funciona de forma <a href="https://developer.mozilla.org/en-US/docs/Glossary/Asynchronous" target="_blank" rel="noreferrer">asíncrona</a>, es decir, devuelve una <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank" rel="noreferrer">promesa</a>. Esto nos permitirá esperar a que aparezca ese elemento.</p><p>Lo que tenemos que hacer aquí es colocarlo con <code>await</code> y esta prueba pasará.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#676E95;font-style:italic;">// tests/components/helloworld.spec.js</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">render</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fireEvent</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">waitFor</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@testing-library/vue</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@testing-library/jest-dom</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> HelloWorld </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@/components/HelloWorld.vue</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">describe</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">HelloWorld.vue</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">it</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">renders props.msg when passed</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">async</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">new message</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">render</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">HelloWorld</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      props</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">fireEvent</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getByRole</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">show-text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    )</span></span>
<span class="line"><span style="color:#F07178;">    </span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// await waitFor(() =&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//  expect(screen.getByText(msg)).toBeInTheDocument()</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">findByText</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;">))</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toBeInTheDocument</span><span style="color:#F07178;">()    </span></span>
<span class="line highlighted"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>En realidad es muy similar a lo que estábamos haciendo antes. Deciamos, <code>waitFor</code> y luego deciamos <code>getByText</code>. Muy similar a lo que estamos haciendo ahora. Sin embargo, <code>findByText</code> es un poco más conciso y un poco más legible.</p><p>Si nos dirigimos a la documentación de Vue Testing Library y leemos <a href="https://testing-library.com/docs/dom-testing-library/api-async/#findby-queries" target="_blank" rel="noreferrer">findBy</a>, podemos ver lo que hace internamente. Se trata solo de una combinación simple de <code>getBy</code> y <code>waitFor</code>. Hacer esto es tan común, que por eso nos proporcionan este método <code>findBy</code>. Por lo que definitivamente, es una mejora desde cualquier punto de vista.</p><p>Solo para enfatizar lo que estaba sucediendo antes, vamos a dar un paso atrás y a hacer un <code>console.log(&quot;HI&quot;)</code> dentro de <code>waitFor</code> para mostrar lo que sucede.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#676E95;font-style:italic;">// tests/components/helloworld.spec.js</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">render</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">fireEvent</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">waitFor</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@testing-library/vue</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@testing-library/jest-dom</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> HelloWorld </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@/components/HelloWorld.vue</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">describe</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">HelloWorld.vue</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#82AAFF;">it</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">renders props.msg when passed</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">async</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">new message</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">render</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">HelloWorld</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">      props</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">fireEvent</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">click</span><span style="color:#F07178;">(</span></span>
<span class="line"><span style="color:#F07178;">      </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getByRole</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">show-text</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    )</span></span>
<span class="line"><span style="color:#F07178;">    </span></span>
<span class="line"><span style="color:#F07178;">     </span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">waitFor</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">HI</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;">)</span></span>
<span class="line highlighted"><span style="color:#F07178;">        </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getByText</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;">))</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toBeInTheDocument</span><span style="color:#F07178;">()    </span></span>
<span class="line highlighted"><span style="color:#F07178;">     </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line highlighted"><wbr></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#82AAFF;">expect</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;font-style:italic;">await</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">screen</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">findByText</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;">))</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">toBeInTheDocument</span><span style="color:#F07178;">()    </span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>Guardemos y veamos qué pasa.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">stdout | tests/components/helloworld.spec.js &gt; HelloWorld.vue &gt; renders props.msg when passed</span></span>
<span class="line"><span style="color:#A6ACCD;">HI</span></span>
<span class="line"><span style="color:#A6ACCD;">HI</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"> √ tests/components/helloworld.spec.js (1)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">Test Files  1 passed (1)</span></span>
<span class="line"><span style="color:#A6ACCD;">     Tests  1 passed (1)</span></span>
<span class="line"><span style="color:#A6ACCD;">      Time  102ms</span></span></code></pre></div><p>Vamos a obtener dos veces <code>HI</code>.</p><p>Lo que está pasando aquí es que estamos llamando <code>waitFor</code> y esta está ejecutando la función de devolución de llamada la primera vez fallando, así que espera 50 milisegundos e intenta repetir la función de devolución de llamada nuevamente hasta que pasa. Es por eso que nos devuelve <code>HI</code> dos veces.</p><p>Algo muy similar está sucediendo internamente con <code>findBy</code>. Sin embargo, al usar <code>findBy</code> estamos abstrayendo esa complejidad desde el punto de vista del usuario y del lector. Por lo que definitivamente es preferible usar <code>findBy</code> en lugar de usar <code>waitFor</code>.</p><p>Probablemente haya algunos casos de uso para <code>waitFor</code>, pero en general querrá usar un <code>findBy</code> siempre que se pueda.</p>`,19),e=[p];function t(c,r,y,F,D,i){return n(),a("div",null,e)}const C=s(l,[["render",t]]);export{A as __pageData,C as default};
