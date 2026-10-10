<div align="center">

# 🧩 Ojs

**Micro-framework SPA declarativo con HTML, JavaScript nativo y un motor de plantillas minimalista.**
Sin build. Sin dependencias en el navegador. Ideal para aprender arquitectura frontend.

[![npm](https://img.shields.io/npm/v/@ocardona0712/ojs-framework?label=ojs-framework)](https://www.npmjs.com/package/@ocardona0712/ojs-framework)
[![npm](https://img.shields.io/npm/v/create-ojs-app?label=create-ojs-app)](https://www.npmjs.com/package/create-ojs-app)
[![CI](https://github.com/ocardona0712/ojs/actions/workflows/ci.yml/badge.svg)](https://github.com/ocardona0712/ojs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## 🚀 Empezar en 30 segundos

```bash
npx create-ojs-app mi-app
cd mi-app
npm install
npm run dev
```

Abre <http://localhost:5173> y listo.

¿Quieres ver un ejemplo completo con API, tarjetas y modales?

```bash
npx create-ojs-app mi-demo --template demo
```

## ✨ Características

- 🔗 Navegación SPA con `window.location.hash`
- 🧠 Motor de plantillas con `{{variable}}`, `{{#if}}` y `{{#each}}`
- 📦 Carga modular de vistas (`pages/`) y su lógica (`scripts/`)
- 🧩 Layout con `<app-header>`, `<app-main>` y `<app-footer>`
- 🧭 Paso de parámetros entre vistas con `data-params`
- 🛑 Vistas sin layout con `<!-- no-layout -->`
- ⚡ CLI sin dependencias: `ojs dev`, `ojs build`, `ojs preview`

## 📦 Estructura de una app Ojs

```
mi-app/
├── src/
│   ├── components/  → header.html y footer.html
│   ├── css/         → estilos
│   ├── pages/       → vistas HTML (#home → pages/home.html)
│   ├── scripts/     → lógica por vista (scripts/home.js → export function init())
│   └── index.html   → punto de entrada
├── dist/            → generado por npm run build
└── package.json
```

## 🧪 Un vistazo

**`src/pages/products.html`**

```html
<h1>Productos</h1>
<ul>
  {{#each products}}
    <li>{{title}} — ${{price}} {{#if discount}}🔥{{/if}}</li>
  {{/each}}
</ul>
```

**`src/scripts/products.js`**

```js
export async function init(params) {
  const res = await fetch("https://dummyjson.com/products");
  const { products } = await res.json();
  window.renderTemplate({ products });
}
```

**Enlace desde cualquier vista**

```html
<a href="#products" data-page="products" data-params='{"category":"phones"}'>Ver productos</a>
```

## 📚 Documentación

| Guía | Contenido |
| --- | --- |
| [Primeros pasos](docs/getting-started.md) | Crear, ejecutar y desplegar una app |
| [Navegación y parámetros](docs/routing.md) | `data-page`, `data-params`, `navigate()`, `no-layout` |
| [Motor de plantillas](docs/templates.md) | `{{variable}}`, `{{#if}}`, `{{#each}}`, `{{this}}` |
| [Vistas y scripts](docs/views.md) | La función `init(params)` y buenas prácticas |
| [API y CLI](docs/api.md) | `start()`, `navigate()`, `renderTemplate()`, `ojs dev/build/preview` |
| [Despliegue](docs/deploy.md) | GitHub Pages, Netlify, Vercel, CDN |

## 🗂️ Este repositorio

Es un monorepo con npm workspaces:

| Ruta | Paquete npm | Descripción |
| --- | --- | --- |
| [`packages/ojs-framework`](packages/ojs-framework) | [`@ocardona0712/ojs-framework`](https://www.npmjs.com/package/@ocardona0712/ojs-framework) | El runtime del framework + CLI `ojs` |
| [`packages/create-ojs-app`](packages/create-ojs-app) | [`create-ojs-app`](https://www.npmjs.com/package/create-ojs-app) | Generador de proyectos |
| [`examples/demo`](examples/demo) | — | App de ejemplo: recetas y carritos con [DummyJSON](https://dummyjson.com) |

### Correr el ejemplo localmente

```bash
git clone https://github.com/ocardona0712/ojs.git
cd ojs
npm install
npm run demo
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Lee la [guía de contribución](CONTRIBUTING.md) y el [código de conducta](CODE_OF_CONDUCT.md).

## 📄 Licencia

[MIT](LICENSE) © Omar Andres Cardona — **El ODev**
