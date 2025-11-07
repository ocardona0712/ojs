// version 1.0.0

import { renderTemplate as _renderTemplate } from "./template.js";
window.renderTemplate = _renderTemplate;

const state = {
    currentPage: null,
    paramsMap: new Map()
};

export async function start() {
    await loadComponent("app-header", "components/header.html");
    await loadComponent("app-footer", "components/footer.html");

    const page = getPageFromHash() || "landing";
    await loadPage(page);

    window.addEventListener("hashchange", () => {
        const page = getPageFromHash();
        if (page) loadPage(page);
    });

    document.body.addEventListener("click", e => {
        const page = e.target.dataset.page;
        if (page) {
            e.preventDefault();
            const params = e.target.dataset.params ? JSON.parse(e.target.dataset.params) : {};
            navigate(page, params);
        }
    });
}

export async function navigate(page, params = {}) {
    state.paramsMap.set(page, params);
    window.location.hash = page;
}

function getPageFromHash() {
    return window.location.hash.slice(1);
}

async function loadPage(page) {
  state.currentPage = page;
  const params = state.paramsMap.get(page) || {};

  const html = await fetch(`pages/${page}.html`).then(res => res.text());

  const noLayout = html.trimStart().startsWith("<!-- no-layout -->");

  document.querySelector("app-main").innerHTML = html;

  document.querySelector("app-header").style.display = noLayout ? "none" : "";
  document.querySelector("app-footer").style.display = noLayout ? "none" : "";

  try {
    const module = await import(`../scripts/${page}.js`);
    if (typeof module.init === "function") {
      module.init(params);
    }
  } catch (err) {
    console.warn(`No se encontró script para ${page}`);
  }
}


async function loadHTML(selector, url) {
    const res = await fetch(url);
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
}

async function loadComponent(selector, url) {
    await loadHTML(selector, url);
    const container = document.querySelector(selector);
    container.querySelectorAll("script").forEach(oldScript => {
        const newScript = document.createElement("script");
        if (oldScript.src) newScript.src = oldScript.src;
        else newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
    });
}
