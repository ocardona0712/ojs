//version 1.1.0

const EACH_RE = /{{#each (.*?)}}([\s\S]*?){{\/each}}/g;
const IF_RE = /{{#if (.*?)}}([\s\S]*?){{\/if}}/g;
// {{{raw}}} inserta HTML sin escapar; {{var}} siempre escapa
const VAR_RE = /{{{(.*?)}}}|{{(.*?)}}/g;

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
  // Evita que un valor con "{{...}}" se reinterprete como marcador en una pasada posterior
  "{": "&#123;",
  "}": "&#125;"
};

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"'`{}]/g, ch => ESCAPES[ch]);
}

// Plantilla original de la vista actual. Se renderiza siempre desde aquí y no desde el DOM,
// porque al releer innerHTML el navegador vuelve a convertir las llaves escapadas en "{{ }}".
let currentTemplate = null;

export function setTemplate(html) {
  currentTemplate = html;
}

export function renderTemplate(data) {
  const container = document.querySelector("app-main");
  if (!container) return;

  container.innerHTML = compile(currentTemplate ?? container.innerHTML, data);
}

// Función pura (sin DOM): recibe el texto de la plantilla y devuelve el HTML final.
export function compile(template, data) {
  // Bucles
  template = template.replace(EACH_RE, (_, key, block) => {
    const items = resolvePath(data, key.trim());
    if (!Array.isArray(items)) return "";
    return items.map(item => renderBlock(block, item)).join("");
  });

  // Condicionales
  template = template.replace(IF_RE, (_, key, content) => {
    const value = resolvePath(data, key.trim());
    return value ? content : "";
  });

  // Interpolación simple
  return interpolate(template, data);
}

function renderBlock(block, context) {
  // Los {{#if}} dentro de un {{#each}} se evalúan contra el elemento actual
  block = block.replace(IF_RE, (_, key, content) => {
    return resolvePath(context, key.trim()) ? content : "";
  });

  return interpolate(block, context);
}

function interpolate(template, context) {
  return template.replace(VAR_RE, (_, rawKey, key) => {
    if (rawKey !== undefined) return String(resolvePath(context, rawKey.trim()) ?? "");
    return escapeHtml(resolvePath(context, key.trim()));
  });
}

function resolvePath(obj, path) {
  if (path === "this") return obj;
  if (path.startsWith("this.")) path = path.slice(5);
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}
