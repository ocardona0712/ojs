# Changelog

Todos los cambios relevantes se documentan aquí. El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

## @ocardona0712/ojs-framework 1.1.0 / create-ojs-app 1.0.0

### Añadido

- Paquete npm `@ocardona0712/ojs-framework` con el runtime y el CLI `ojs` (`dev`, `build`, `preview`), sin dependencias.
- Paquete npm `create-ojs-app`: `npx create-ojs-app mi-app` con las plantillas `basic` y `demo`.
- `start(options)` acepta `defaultPage`, `pagesDir`, `scriptsDir`, `header` y `footer`.
- Exportaciones `navigate`, `renderTemplate` y `compile` (motor de plantillas puro, sin DOM).
- `{{#if}}` dentro de `{{#each}}` se evalúa contra el elemento actual.
- Soporte para `{{this.prop}}` dentro de `{{#each}}`.
- Tests, CI y documentación en `docs/`.

### Seguridad

- **`{{var}}` ahora escapa el HTML** (`& < > " ' \` { }`) para prevenir XSS. Antes los valores se insertaban como HTML crudo. ⚠️ Si dependías de insertar HTML con `{{var}}`, cámbialo a `{{{var}}}`.
- Nueva sintaxis `{{{var}}}` para insertar HTML de confianza sin escapar.
- Un valor que contenga `{{...}}` ya no se reinterpreta como marcador (antes permitía leer otras variables de los datos).
- `renderTemplate()` renderiza desde la plantilla original de la vista y no desde el DOM, así que llamarlo varias veces es seguro y re-renderiza correctamente.
- Nuevo export `escapeHtml()`. La demo lo usa en los modales que se arman con `innerHTML`.

### Cambiado

- Las páginas, scripts y componentes se resuelven respecto a `index.html` en lugar de la ubicación del framework. Esto permite usarlo desde `node_modules`, un CDN o una subruta.
- Un error dentro de `init()` ya no se reporta como "No se encontró script"; ahora se muestra el error real.

### Corregido

- `data-page` funciona aunque el clic caiga en un elemento hijo del enlace.
- Navegar a la vista actual con parámetros nuevos la recarga.

## [1.0.0]

- Versión inicial: navegación por hash, motor de plantillas, paso de parámetros y layout opcional.
