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
        <img src="${recipe.image}" class="img-fluid mb-3 rounded" alt="${recipe.name}">
        <p><strong>Categoría:</strong> ${recipe.cuisine}</p>
        <p><strong>Ingredientes:</strong></p>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <p><strong>Instrucciones:</strong> ${recipe.instructions}</p>
      `;
    });
}
