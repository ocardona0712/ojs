import { escapeHtml as e } from "../ojs/index.js";

export async function init() {
  const res = await fetch("https://dummyjson.com/carts");
  const data = await res.json();

  window.renderTemplate({ carts: data.carts });

  document.querySelectorAll("[data-id]").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      showCartDetail(id);
    });
  });
}

function showCartDetail(id) {
  fetch(`https://dummyjson.com/carts/${id}`)
    .then(res => res.json())
    .then(cart => {
      document.querySelector("#modalTitle").textContent = `Carrito #${cart.id}`;
      document.querySelector("#modalBody").innerHTML = `
        <p><strong>ID Usuario:</strong> ${e(cart.userId)}</p>
        <p><strong>Total:</strong> $${e(cart.total)}</p>
        <p><strong>Productos:</strong></p>
        <ul>
          ${cart.products.map(p => `<li>${e(p.title)} — ${e(p.quantity)} u. ($${e(p.price)} c/u)</li>`).join("")}
        </ul>
      `;
    });
}
