# Navegación y parámetros

Ojs usa `window.location.hash` para navegar sin recargar el navegador. Cada ruta corresponde a un archivo dentro de `src/`:

| URL | Vista | Script (opcional) |
| --- | --- | --- |
| `#home` | `pages/home.html` | `scripts/home.js` |
| `#recipes` | `pages/recipes.html` | `scripts/recipes.js` |

Si la URL no tiene hash, se carga la `defaultPage` configurada en `start()` (por defecto `landing`).

## Enlaces con `data-page`

Cualquier elemento con `data-page` navega al hacer clic, sea un enlace, un botón o una tarjeta:

```html
<a href="#recipes" data-page="recipes">Ver recetas</a>
<button data-page="carts">Ver carritos</button>
```

Funciona aunque el clic caiga en un elemento hijo (`<a data-page="x"><span>…</span></a>`).

## Enviar parámetros con `data-params`

```html
<a href="#params" data-page="params"
   data-params='{"usuario":"Ana","perfil":{"rol":"admin"}}'>
  Ver parámetros
</a>
```

El JSON llega como objeto a `init()`:

```js
export function init(params) {
  console.log(params.usuario);     // "Ana"
  console.log(params.perfil.rol);  // "admin"
}
```

Consideraciones:

- `data-params` debe ser **JSON válido**, con comillas dobles en claves y valores.
- Los parámetros viven en memoria: **no se reflejan en la URL** y se pierden al recargar la página. Si `init()` no recibe parámetros, usa un valor por defecto.

## Navegar desde JavaScript

```js
import { navigate } from "./ojs/index.js";

navigate("recipes", { categoria: "italiana" });
```

## Vistas sin layout

Si la primera línea de una vista es `<!-- no-layout -->`, Ojs oculta `<app-header>` y `<app-footer>`. Es útil para el login o para pantallas completas:

```html
<!-- no-layout -->
<div class="login">…</div>
```
