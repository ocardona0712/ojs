#!/usr/bin/env node
import { existsSync, readdirSync } from "node:fs";
import { cp, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(await readFile(join(HERE, "package.json"), "utf8"));

// En el paquete publicado las plantillas viven en templates/. Dentro del monorepo,
// la plantilla "demo" se toma directamente de examples/ (ver scripts/sync-templates.js).
const TEMPLATE_DIRS = [join(HERE, "templates"), join(HERE, "../../examples")];
const TEMPLATES = { basic: "Estructura mínima para empezar", demo: "Ejemplo completo: recetas y carritos con DummyJSON + Bootstrap" };
const TEXT_EXT = new Set([".html", ".js", ".css", ".md", ".json", ".txt", ".svg"]);
const SKIP = new Set(["node_modules", "dist", "package.json", "package-lock.json"]);

const c = {
  bold: s => `\x1b[1m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  dim: s => `\x1b[2m${s}\x1b[0m`
};

const HELP = `
${c.bold("create-ojs-app")} v${pkg.version}

Uso:
  npx create-ojs-app <nombre-app> [opciones]
  npm create ojs-app@latest <nombre-app> -- [opciones]

Opciones:
  -t, --template <nombre>  Plantilla a usar: ${Object.keys(TEMPLATES).join(", ")} (por defecto basic)
  -h, --help               Muestra esta ayuda
  -v, --version            Muestra la versión

Plantillas:
${Object.entries(TEMPLATES).map(([k, v]) => `  ${k.padEnd(8)} ${v}`).join("\n")}
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-t" || a === "--template") args.template = argv[++i];
    else if (a.startsWith("--template=")) args.template = a.split("=")[1];
    else if (a === "-h" || a === "--help") args.help = true;
    else if (a === "-v" || a === "--version") args.version = true;
    else args._.push(a);
  }
  return args;
}

function toPackageName(name) {
  return basename(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~._]+/g, "-");
}

function findTemplate(name) {
  for (const dir of TEMPLATE_DIRS) {
    const path = join(dir, name);
    if (existsSync(join(path, "index.html"))) return path;
  }
  return null;
}

async function ask(question, fallback) {
  if (!process.stdin.isTTY) return fallback;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`${question} ${c.dim(`(${fallback})`)} `)).trim();
  rl.close();
  return answer || fallback;
}

async function replaceInTextFiles(dir, replacements) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await replaceInTextFiles(path, replacements);
    } else if (TEXT_EXT.has(extname(entry.name))) {
      let content = await readFile(path, "utf8");
      for (const [from, to] of Object.entries(replacements)) content = content.split(from).join(to);
      await writeFile(path, content);
    }
  }
}

function packageManager() {
  const agent = process.env.npm_config_user_agent || "";
  if (agent.startsWith("pnpm")) return "pnpm";
  if (agent.startsWith("yarn")) return "yarn";
  if (agent.startsWith("bun")) return "bun";
  return "npm";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return console.log(HELP);
  if (args.version) return console.log(pkg.version);

  console.log(`\n${c.bold("🧩 create-ojs-app")} ${c.dim(`v${pkg.version}`)}\n`);

  const targetArg = args._[0] || (await ask("Nombre del proyecto:", "ojs-app"));
  const templateName = args.template || "basic";
  const targetDir = resolve(targetArg);
  const appName = basename(targetDir);
  const packageName = toPackageName(appName);

  if (!TEMPLATES[templateName]) {
    throw new Error(`Plantilla "${templateName}" no existe. Opciones: ${Object.keys(TEMPLATES).join(", ")}`);
  }
  const templateDir = findTemplate(templateName);
  if (!templateDir) throw new Error(`No se encontraron los archivos de la plantilla "${templateName}"`);

  if (existsSync(targetDir) && (await stat(targetDir)).isDirectory() && readdirSync(targetDir).length > 0) {
    throw new Error(`La carpeta ${relative(process.cwd(), targetDir) || "."} ya existe y no está vacía`);
  }

  await cp(templateDir, targetDir, {
    recursive: true,
    filter: src => !SKIP.has(basename(src))
  });

  await replaceInTextFiles(targetDir, { __APP_NAME__: appName });

  const appPkg = {
    name: packageName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "ojs dev",
      build: "ojs build",
      preview: "ojs preview"
    },
    dependencies: {
      "@ocardona0712/ojs-framework": pkg.ojsFrameworkVersion
    }
  };
  await writeFile(join(targetDir, "package.json"), JSON.stringify(appPkg, null, 2) + "\n");
  await writeFile(join(targetDir, ".gitignore"), "node_modules\ndist\n.DS_Store\n");

  const pm = packageManager();
  const rel = relative(process.cwd(), targetDir);
  console.log(`${c.green("✔")} Proyecto creado en ${c.cyan(rel || ".")} con la plantilla ${c.bold(templateName)}\n`);
  console.log("  Siguientes pasos:\n");
  if (rel) console.log(`    cd ${rel.includes(" ") ? `"${rel}"` : rel}`);
  console.log(`    ${pm} install`);
  console.log(`    ${pm === "npm" ? "npm run dev" : `${pm} dev`}\n`);
}

main().catch(err => {
  console.error(`\n${c.red("✖")} ${err.message}\n`);
  process.exitCode = 1;
});
