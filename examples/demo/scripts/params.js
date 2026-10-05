export function init(params) {
  window.renderTemplate({ __json__: JSON.stringify(params, null, 2) });
}
