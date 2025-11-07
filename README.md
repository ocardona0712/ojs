# 🧩 Ojs — Mini Framework SPA
**Versión:** 1.0.0

**Ojs** es un micro-framework declarativo para construir aplicaciones SPA con HTML, JavaScript y un motor de plantillas minimalista. Diseñado para enseñar arquitectura frontend con separación de responsabilidades, navegación sin recarga y renderizado dinámico.

## 🚀 Características

- 🔗 Navegación SPA con `window.location.hash`
- 🧠 Motor de plantillas con `{{variable}}`, `{{#if}}`, `{{#each}}`
- 📦 Carga modular de vistas y scripts
- 🧩 Componentes fijos: `<app-header>`, `<app-main>`, `<app-footer>`
- 📤 Modal global para mostrar detalles
- 🧭 Paso de parámetros entre vistas
- 🛑 Layout opcional con `<!-- no-layout -->`

## 📦 Estructura

    framework/ → núcleo del sistema 
    components/ → header y footer reutilizables
    css/ → hojas de cascada de estilos
    pages/ → vistas HTML 
    scripts/ → lógica por vista 
    index.html → punto de entrada

## 🧭 Navegación SPA y paso de parámetros

Ojs utiliza `window.location.hash` para navegar entre páginas sin recargar el navegador. Cada vista se define como un archivo HTML en la carpeta `pages/`, y su lógica asociada vive en `scripts/`.

### 🔗 Navegación básica

Para navegar a una vista, usa un enlace con el atributo `data-page`:

```html
<a href="#recipes" data-page="recipes">Ver recetas</a>
```
Esto carga pages/recipes.html en el contenedor <app-main> y ejecuta scripts/recipes.js.

### 📤 Enviar parámetros entre vistas
Puedes enviar datos internos entre vistas usando el atributo data-params:

```html
<a href="#params" data-page="params" data-params='{"user":"Ana","role":"admin"}'>Ver parámetros</a>

```
El framework convierte ese JSON en un objeto params y lo pasa a la función init() del script correspondiente:

```js
export function init(params) {
  console.log(params.user); // "Ana"
  console.log(params.role); // "admin"
}
```
### 🛑 Consideraciones
* Los parámetros se pasan como JSON en data-params
* Solo se usan internamente, no se reflejan en la URL
* Se pueden usar para personalizar vistas, cargar datos específicos o controlar el layout

## 🧠 Uso del motor de plantillas

El motor de plantillas de Ojs permite renderizar HTML dinámico usando sintaxis declarativa. Se basa en tres directivas principales:

---

### 🔹 Interpolación simple: `{{variable}}`

Reemplaza una variable por su valor en el objeto de datos:

```html
<p>Hola {{user}}</p>
```
### 🔹 Condicional: {{#if variable}}...{{/if}}
Muestra contenido solo si la variable es verdadera o existe:

```html
{{#if isAdmin}}
  <p>Bienvenida administradora</p>
{{/if}}
```
### 🔹 Iteración: {{#each array}}...{{/each}}
Repite un bloque por cada elemento del arreglo:

```html
<ul>
  {{#each products}}
    <li>{{name}} - ${{price}}</li>
  {{/each}}
</ul>
```
### 🧩 Contexto dentro de {{#each}}
Dentro del bloque {{#each}}, cada {{variable}} se refiere al elemento actual del arreglo. No necesitas prefijos como item.name, solo {{name}}.

### 🛠️ Buenas prácticas
Usa nombres de variables claros y consistentes

Evita lógica compleja dentro de las plantillas

Mantén el HTML limpio y declarativo

No mezcles renderTemplate() con manipulación manual del DOM

## 📄 Estructura de los scripts por vista

Cada vista en Ojs tiene un archivo HTML en `pages/` y un archivo JavaScript en `scripts/` con el mismo nombre. El script define la lógica específica de esa vista y debe exportar una función llamada `init()`.

---

### 🧩 Convención

- `pages/recipes.html` → vista declarativa
- `scripts/recipes.js` → lógica asociada

---

### 🧠 La función `init(params)`

El framework llama automáticamente a `init(params)` cuando se carga la vista. Esta función recibe los parámetros enviados desde el enlace (si existen) y es responsable de:

- Obtener datos (por ejemplo, con `fetch`)
- Llamar a `window.renderTemplate(data)`
- Registrar eventos (como clics en botones)

---

### 🧪 Ejemplo: `scripts/recipes.js`

```js
export async function init(params) {
  const res = await fetch("https://dummyjson.com/recipes");
  const data = await res.json();

  window.renderTemplate({ recipes: data.recipes });

  document.querySelectorAll("[data-id]").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      showRecipeDetail(id);
    });
  });
}

function showRecipeDetail(id) {
  fetch(`https://dummyjson.com/recipes/${id}`)
    .then(res => res.json())
    .then(recipe => {
      document.querySelector("#modalTitle").textContent = recipe.name;
      document.querySelector("#modalBody").innerHTML = `
        <img src="${recipe.image}" class="img-fluid mb-3 rounded" alt="${recipe.name}">
        <p><strong>Categoría:</strong> ${recipe.cuisine}</p>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <p><strong>Instrucciones:</strong> ${recipe.instructions}</p>
      `;
    });
}
```
### ✅ Buenas prácticas
- Usa async/await para claridad en la carga de datos
- Llama a renderTemplate() solo después de tener los datos
- Registra eventos después del renderizado
- Mantén la lógica encapsulada por vista
- Evita manipular el DOM directamente fuera de init()

---

## 📚 Licencia

Este proyecto está licenciado bajo los términos de la **MIT License**, lo que significa que puedes usarlo, modificarlo y compartirlo libremente con fines educativos, personales o comerciales.

Para más detalles, consulta el archivo `LICENSE`.

---

## ✍️ Autor

Desarrollado con pasión por **El ODev**  

---
