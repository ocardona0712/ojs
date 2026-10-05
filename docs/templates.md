# Motor de plantillas

Las vistas en `pages/` son HTML normal con marcadores `{{ }}`. Se resuelven cuando el script de la vista llama a:

```js
window.renderTemplate(data);
```

## Interpolación: `{{variable}}`

```html
<p>Hola {{user}}</p>
<p>Rol: {{perfil.rol}}</p>   <!-- rutas con punto -->
```

Si la variable no existe, se reemplaza por una cadena vacía.

Los valores se **escapan automáticamente**: `<`, `>`, `&`, comillas y llaves se convierten en entidades HTML. Puedes usar datos de una API o de usuarios sin riesgo de XSS, tanto en texto como dentro de atributos entre comillas:

```html
<p title="{{bio}}">{{bio}}</p>
```

## HTML sin escapar: `{{{variable}}}`

Usa triple llave cuando el valor **es HTML que tú controlas** y quieres que se interprete:

```html
<div>{{{descripcionHtml}}}</div>
```

> ⚠️ Nunca uses `{{{ }}}` con contenido que venga de usuarios o de APIs externas.

## Condicional: `{{#if variable}}…{{/if}}`

Muestra el contenido si el valor es *truthy*:

```html
{{#if isAdmin}}
  <p>Bienvenida, administradora</p>
{{/if}}
```

## Iteración: `{{#each lista}}…{{/each}}`

Repite el bloque por cada elemento. Dentro del bloque, las variables se refieren al **elemento actual**: no necesitas `item.name`, basta con `{{name}}`.

```html
<ul>
  {{#each products}}
    <li>{{name}} — ${{price}}</li>
  {{/each}}
</ul>
```

### Arreglos simples: `{{this}}`

```html
{{#each tags}}<span class="tag">{{this}}</span>{{/each}}
```

```js
window.renderTemplate({ tags: ["js", "html", "css"] });
```

### Condicionales dentro de un `each`

Se evalúan contra el elemento actual:

```html
{{#each recipes}}
  <h5>{{name}}</h5>
  {{#if instructions}}<p>{{instructions}}</p>{{/if}}
{{/each}}
```

## Limitaciones conocidas

Ojs es intencionalmente pequeño. Hoy **no** soporta:

- `{{#each}}` anidados, ni `{{#if}}` anidados del mismo tipo.
- `{{else}}`.
- Expresiones como `{{a + b}}` o `{{#if a > 1}}`. Calcula esos valores en el script.
## 🔒 Seguridad

- `{{var}}` escapa siempre el valor. Si un valor contiene `{{otro}}`, se muestra como texto literal y no se resuelve.
- `{{{var}}}` no escapa: úsalo solo con HTML de confianza.
- El escape protege el contenido de texto y los atributos **entre comillas**. No interpoles valores no confiables en atributos sin comillas, en URLs (`href="{{url}}"` acepta `javascript:`), en `<script>` ni en `style`. Valida esos casos en tu script.
- Si armas HTML a mano con `innerHTML`, por ejemplo en un modal, usa `escapeHtml`:

```js
import { escapeHtml } from "../ojs/index.js";

modal.innerHTML = `<p>${escapeHtml(recipe.name)}</p>`;
```

## Usar el motor sin DOM

`compile(plantilla, datos)` es una función pura que devuelve el HTML resultante. Sirve para tests o para renderizar fragmentos:

```js
import { compile } from "ojs-framework/template";

compile("Hola {{name}}", { name: "Ana" }); // "Hola Ana"
```
