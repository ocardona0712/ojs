import { test } from "node:test";
import assert from "node:assert/strict";
import { compile, escapeHtml } from "../packages/ojs-framework/src/template.js";

test("interpola variables y rutas anidadas", () => {
  assert.equal(compile("Hola {{user}} ({{perfil.rol}})", { user: "Ana", perfil: { rol: "admin" } }), "Hola Ana (admin)");
});

test("variables inexistentes se reemplazan por vacío", () => {
  assert.equal(compile("[{{nada}}]", {}), "[]");
});

test("{{#if}} muestra u oculta contenido", () => {
  const tpl = "{{#if ok}}sí{{/if}}";
  assert.equal(compile(tpl, { ok: true }), "sí");
  assert.equal(compile(tpl, { ok: false }), "");
});

test("{{#each}} itera objetos usando el elemento como contexto", () => {
  const tpl = "{{#each items}}<li>{{name}}</li>{{/each}}";
  assert.equal(compile(tpl, { items: [{ name: "a" }, { name: "b" }] }), "<li>a</li><li>b</li>");
});

test("{{#each}} soporta arreglos simples con {{this}}", () => {
  assert.equal(compile("{{#each tags}}{{this}},{{/each}}", { tags: ["x", "y"] }), "x,y,");
});

test("{{#if}} dentro de {{#each}} se evalúa contra el elemento", () => {
  const tpl = "{{#each items}}{{name}}{{#if desc}}:{{desc}}{{/if}};{{/each}}";
  const data = { items: [{ name: "a", desc: "uno" }, { name: "b" }] };
  assert.equal(compile(tpl, data), "a:uno;b;");
});

test("{{var}} escapa HTML para prevenir XSS", () => {
  const out = compile("<p>{{bio}}</p>", { bio: '<img src=x onerror="alert(1)">' });
  assert.equal(out, "<p>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>");
});

test("{{var}} escapa comillas dentro de atributos", () => {
  const out = compile('<a title="{{t}}">x</a>', { t: '" onmouseover="alert(1)' });
  assert.ok(!out.includes('" onmouseover'));
});

test("{{var}} escapa dentro de {{#each}}, incluido {{this}}", () => {
  const out = compile("{{#each xs}}{{this}}|{{name}}{{/each}}", { xs: ["<b>"] });
  assert.equal(out, "&lt;b&gt;|");
  const out2 = compile("{{#each xs}}{{name}}{{/each}}", { xs: [{ name: "<script>" }] });
  assert.equal(out2, "&lt;script&gt;");
});

test("un valor con {{...}} no se reinterpreta como marcador", () => {
  const data = { items: [{ name: "{{secret}}" }], secret: "FILTRADO" };
  const out = compile("{{#each items}}{{name}}{{/each}}", data);
  assert.ok(!out.includes("FILTRADO"));
  assert.equal(out, "&#123;&#123;secret&#125;&#125;");
});

test("{{{raw}}} inserta HTML sin escapar de forma explícita", () => {
  assert.equal(compile("{{{html}}}", { html: "<b>ok</b>" }), "<b>ok</b>");
  assert.equal(compile("{{#each xs}}{{{this}}}{{/each}}", { xs: ["<i>a</i>"] }), "<i>a</i>");
});

test("escapeHtml maneja null, números y caracteres especiales", () => {
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(42), "42");
  assert.equal(escapeHtml(`&<>"'\``), "&amp;&lt;&gt;&quot;&#39;&#96;");
});
