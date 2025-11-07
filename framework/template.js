//version 1.0.0

export function renderTemplate(data) {
  const container = document.querySelector("app-main");
  if (!container) return;

  let template = container.innerHTML;

  // Bucles
  template = template.replace(/{{#each (.*?)}}([\s\S]*?){{\/each}}/g, (_, key, block) => {
    const items = resolvePath(data, key.trim());
    if (!Array.isArray(items)) return "";
    return items.map(item => renderBlock(block, item)).join("");
  });

  // Condicionales
  template = template.replace(/{{#if (.*?)}}([\s\S]*?){{\/if}}/g, (_, key, content) => {
    const value = resolvePath(data, key.trim());
    return value ? content : "";
  });

  // Interpolación simple
  template = template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = resolvePath(data, key.trim());
    return value ?? "";
  });

  container.innerHTML = template;
}

function renderBlock(block, context) {
  return block.replace(/{{(.*?)}}/g, (_, key) => {
    const value = resolvePath(context, key.trim());
    return value ?? "";
  });
}

function resolvePath(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}
