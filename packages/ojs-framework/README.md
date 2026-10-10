# @ocardona0712/ojs-framework

Runtime y CLI de **[Ojs](https://github.com/ocardona0712/ojs)**, un micro-framework SPA declarativo con HTML, JavaScript nativo y un motor de plantillas minimalista. Sin build y sin dependencias.

## La forma más rápida

```bash
npx create-ojs-app mi-app
```

## Instalación manual

```bash
npm install @ocardona0712/ojs-framework
```

`src/index.html`:

```html
<script type="module">
  import { start } from "./ojs/index.js";
  window.addEventListener("DOMContentLoaded", () => start({ defaultPage: "home" }));
</script>

<app-header></app-header>
<app-main></app-main>
<app-footer></app-footer>
```

`package.json`:

```json
{
  "scripts": {
    "dev": "ojs dev",
    "build": "ojs build",
    "preview": "ojs preview"
  }
}
```

O directamente desde un CDN, sin instalar nada:

```js
import { start } from "https://cdn.jsdelivr.net/npm/@ocardona0712/ojs-framework@1/src/index.js";
```

## API

| Export | Descripción |
| --- | --- |
| `start(options?)` | Inicia la app (`defaultPage`, `pagesDir`, `scriptsDir`, `header`, `footer`) |
| `navigate(page, params?)` | Navega a una vista y le pasa parámetros |
| `renderTemplate(data)` | Renderiza la vista actual (también en `window.renderTemplate`) |
| `compile(template, data)` | Motor de plantillas puro: string → string |
| `escapeHtml(value)` | Escapa texto para insertarlo en HTML (lo que hace `{{var}}`) |

`{{var}}` escapa HTML automáticamente; `{{{var}}}` inserta HTML de confianza sin escapar.

## CLI

```bash
ojs dev [dir] [--port 5173]
ojs build [dir] [--out dist]
ojs preview [dir] [--port 4173]
```

📚 Documentación completa: <https://github.com/ocardona0712/ojs/tree/master/docs>

MIT © Omar Andres Cardona (El ODev)
