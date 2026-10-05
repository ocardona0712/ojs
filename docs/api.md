# API y CLI

## Runtime (`@ocardona0712/ojs-framework`)

```js
import { start, navigate, renderTemplate, compile, escapeHtml } from "./ojs/index.js";
```

> En las apps generadas, el framework se importa desde `./ojs/index.js`. `ojs dev` sirve esa ruta desde `node_modules/@ocardona0712/ojs-framework/src` y `ojs build` la copia a `dist/ojs/`.

### `start(options?)`

Inicializa la app: carga el header y el footer, muestra la vista inicial y escucha la navegación.

| Opción | Por defecto | Descripción |
| --- | --- | --- |
| `defaultPage` | `"landing"` | Vista que se carga si la URL no tiene hash |
| `pagesDir` | `"pages"` | Carpeta de las vistas HTML |
| `scriptsDir` | `"scripts"` | Carpeta de los scripts de cada vista |
| `header` | `"components/header.html"` | Componente header (`false` para omitirlo) |
| `footer` | `"components/footer.html"` | Componente footer (`false` para omitirlo) |

```js
window.addEventListener("DOMContentLoaded", () => start({ defaultPage: "home" }));
```

Las rutas se resuelven respecto a `index.html`, así que la app funciona igual en `/` que en una subruta (`/mi-repo/`).

### `navigate(page, params?)`

Navega a una vista y pasa `params` a su `init()`.

### `renderTemplate(data)` / `window.renderTemplate(data)`

Renderiza la vista actual (`<app-main>`) con los datos indicados. Ver [Motor de plantillas](templates.md).

### `compile(template, data)`

Versión pura del motor: recibe un string y devuelve el HTML.

### `escapeHtml(value)`

Escapa `& < > " ' \` { }` para insertar texto de forma segura en HTML. Es el mismo escape que usa `{{var}}`. Úsalo cuando construyas HTML a mano con `innerHTML`.

## CLI `ojs`

Viene incluido en `@ocardona0712/ojs-framework` y no tiene dependencias.

```bash
ojs dev [dir] [--port 5173]          # servidor de desarrollo
ojs build [dir] [--out dist]         # build estático
ojs preview [dir] [--port 4173]      # sirve dist/
```

`ojs build` copia el proyecto a `dist/`, excepto `node_modules`, `dist`, `package*.json` y los archivos ocultos, y agrega el framework en `dist/ojs/`.

## CLI `create-ojs-app`

```bash
npx create-ojs-app <nombre> [--template basic|demo]
```
