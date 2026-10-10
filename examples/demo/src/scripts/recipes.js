import { escapeHtml as e } from "../ojs/index.js";

export async function init() {
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
        <img src="${e(recipe.image)}" class="img-fluid mb-3 rounded" alt="${e(recipe.name)}">
        <p><strong>Categoría:</strong> ${e(recipe.cuisine)}</p>
        <p><strong>Ingredientes:</strong></p>
        <ul>${recipe.ingredients.map(i => `<li>${e(i)}</li>`).join("")}</ul>
        <p><strong>Instrucciones:</strong> ${e(recipe.instructions)}</p>
      `;
    });
}
