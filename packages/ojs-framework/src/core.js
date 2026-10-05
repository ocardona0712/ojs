// version 1.1.0

import { renderTemplate as _renderTemplate, setTemplate } from "./template.js";
window.renderTemplate = _renderTemplate;

const state = {
    currentPage: null,
    paramsMap: new Map(),
    options: {}
};

const defaults = {
    defaultPage: "landing",
    pagesDir: "pages",
    scriptsDir: "scripts",
    header: "components/header.html",
    footer: "components/footer.html"
};

export async function start(options = {}) {
    // start se puede usar directamente como listener: ignorar el Event que recibe
    if (options instanceof Event) options = {};
    state.options = { ...defaults, ...options };

    if (state.options.header) await loadComponent("app-header", state.options.header);
    if (state.options.footer) await loadComponent("app-footer", state.options.footer);

    const page = getPageFromHash() || state.options.defaultPage;
    await loadPage(page);

    window.addEventListener("hashchange", () => {
        const page = getPageFromHash();
        if (page) loadPage(page);
    });

    document.body.addEventListener("click", e => {
        const link = e.target.closest("[data-page]");
        if (!link) return;
        e.preventDefault();
        const params = link.dataset.params ? JSON.parse(link.dataset.params) : {};
        navigate(link.dataset.page, params);
    });
}

export async function navigate(page, params = {}) {
    state.paramsMap.set(page, params);
    if (getPageFromHash() === page) loadPage(page);
    else window.location.hash = page;
}

function getPageFromHash() {
    return window.location.hash.slice(1);
}

// Las rutas se resuelven contra el documento (index.html), no contra este archivo,
// para que el framework funcione igual desde node_modules, un CDN o una copia local.
function resolveUrl(path) {
    return new URL(path, document.baseURI).href;
}

async function loadPage(page) {
  state.currentPage = page;
  const params = state.paramsMap.get(page) || {};
  const { pagesDir, scriptsDir } = state.options;

  const res = await fetch(resolveUrl(`${pagesDir}/${page}.html`));
  if (!res.ok) {
    console.warn(`No se encontró la página ${page}`);
    return;
  }
  const html = await res.text();

  const noLayout = html.trimStart().startsWith("<!-- no-layout -->");

  document.querySelector("app-main").innerHTML = html;
  setTemplate(html);

  document.querySelector("app-header").style.display = noLayout ? "none" : "";
  document.querySelector("app-footer").style.display = noLayout ? "none" : "";

  let module;
  try {
    module = await import(resolveUrl(`${scriptsDir}/${page}.js`));
  } catch (err) {
    console.warn(`No se encontró script para ${page}`);
    return;
  }
  if (typeof module.init === "function") {
    try {
      await module.init(params);
    } catch (err) {
      console.error(`Error en init() de ${page}:`, err);
    }
  }
}


async function loadHTML(selector, url) {
    const res = await fetch(resolveUrl(url));
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
}

async function loadComponent(selector, url) {
    if (!document.querySelector(selector)) return;
    await loadHTML(selector, url);
    const container = document.querySelector(selector);
    container.querySelectorAll("script").forEach(oldScript => {
        const newScript = document.createElement("script");
        if (oldScript.src) newScript.src = oldScript.src;
        else newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
    });
}
