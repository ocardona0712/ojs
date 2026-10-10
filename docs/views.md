# Vistas y scripts

Cada vista tiene un HTML en `src/pages/` y, opcionalmente, un módulo JavaScript en `src/scripts/` **con el mismo nombre**:

```
src/pages/recipes.html   → vista declarativa
src/scripts/recipes.js   → lógica asociada
```

Si no hay script, la vista se muestra tal cual.

## La función `init(params)`

Al cargar una vista, Ojs importa su script y llama a `init(params)`. Ahí debes:

1. Obtener los datos, por ejemplo con `fetch`.
2. Llamar a `window.renderTemplate(data)`.
3. Registrar los eventos **después** del render.

```js
export async function init(params) {
  const res = await fetch("https://dummyjson.com/recipes");
  const data = await res.json();

  window.renderTemplate({ recipes: data.recipes });

  document.querySelectorAll("[data-id]").forEach(btn => {
    btn.addEventListener("click", e => showRecipeDetail(e.currentTarget.dataset.id));
  });
}

async function showRecipeDetail(id) {
  const recipe = await fetch(`https://dummyjson.com/recipes/${id}`).then(r => r.json());
  document.querySelector("#modalTitle").textContent = recipe.name;
  // ...
}
```

`init` puede ser síncrona o `async`. Si lanza un error, Ojs lo muestra en la consola junto con el nombre de la vista.

## Componentes del layout

`index.html` define tres contenedores:

```html
<app-header></app-header>   <!-- components/header.html -->
<app-main></app-main>       <!-- la vista actual -->
<app-footer></app-footer>   <!-- components/footer.html -->
```

Los `<script>` dentro del header y el footer se ejecutan al cargarlos.

## Buenas prácticas

- Usa `async/await` para cargar datos.
- Llama a `renderTemplate()` solo cuando ya tengas los datos.
- Registra los eventos después del render, porque el render reemplaza el HTML de `<app-main>`.
- Mantén la lógica encapsulada en el script de cada vista.
- Calcula los valores derivados en JS y deja las plantillas declarativas.
