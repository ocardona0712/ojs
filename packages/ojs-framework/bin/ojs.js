#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FRAMEWORK_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const FRAMEWORK_PREFIX = "/ojs/";
const IGNORED = new Set(["node_modules", "dist", ".git", "package.json", "package-lock.json"]);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

const HELP = `
ojs — CLI del framework Ojs

Uso:
  ojs dev [dir]      Servidor de desarrollo (por defecto el directorio actual)
  ojs build [dir]    Genera una versión estática lista para desplegar en dist/
  ojs preview [dir]  Sirve la carpeta dist/ generada por build

Opciones:
  --port <n>   Puerto del servidor (dev: 5173, preview: 4173)
  --out <dir>  Carpeta de salida de build (por defecto dist)
  -h, --help   Muestra esta ayuda
  -v, --version
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--port") args.port = Number(argv[++i]);
    else if (a === "--out") args.out = argv[++i];
    else if (a === "-h" || a === "--help") args.help = true;
    else if (a === "-v" || a === "--version") args.version = true;
    else args._.push(a);
  }
  return args;
}

// Resuelve la ruta pedida dentro de root sin permitir salir de él (path traversal)
function safeJoin(root, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const file = normalize(join(root, decoded));
  const rel = relative(root, file);
  if (rel.startsWith("..") || isAbsolute(rel)) return null;
  return file;
}

function serve(root, { port, framework }) {
  const server = createServer((req, res) => {
    const urlPath = new URL(req.url, "http://localhost").pathname;
    let file;
    if (framework && urlPath.startsWith(FRAMEWORK_PREFIX)) {
      file = safeJoin(FRAMEWORK_DIR, urlPath.slice(FRAMEWORK_PREFIX.length));
    } else {
      file = safeJoin(root, urlPath);
    }

    if (file && existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!file || !existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 - No encontrado");
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    createReadStream(file).pipe(res);
  });

  server.on("error", err => {
    if (err.code === "EADDRINUSE") {
      console.log(`Puerto ${port} ocupado, probando ${port + 1}...`);
      server.listen(++port);
    } else {
      throw err;
    }
  });
  server.on("listening", () => {
    console.log(`\n  Ojs corriendo en http://localhost:${server.address().port}\n`);
  });
  server.listen(port);
}

async function build(root, outDir) {
  if (!existsSync(join(root, "index.html"))) {
    throw new Error(`No se encontró index.html en ${root}`);
  }
  await rm(outDir, { recursive: true, force: true });
  await mkdir(join(outDir, "ojs"), { recursive: true });
  // Se copia entrada por entrada porque fs.cp no permite copiar un directorio dentro de sí mismo
  for (const entry of await readdir(root)) {
    const src = join(root, entry);
    if (IGNORED.has(entry) || entry.startsWith(".") || resolve(src) === outDir) continue;
    await cp(src, join(outDir, entry), { recursive: true });
  }
  await cp(FRAMEWORK_DIR, join(outDir, "ojs"), { recursive: true });
  console.log(`\n  Build listo en ${relative(process.cwd(), outDir) || outDir}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [command, dir = "."] = args._;
  const root = resolve(dir);

  if (args.version) {
    const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
    console.log(pkg.version);
    return;
  }
  if (args.help || !command) {
    console.log(HELP);
    return;
  }

  switch (command) {
    case "dev":
      serve(root, { port: args.port || 5173, framework: true });
      break;
    case "build":
      await build(root, resolve(root, args.out || "dist"));
      break;
    case "preview": {
      const out = resolve(root, args.out || "dist");
      if (!existsSync(out)) throw new Error(`No existe ${out}. Ejecuta primero: ojs build`);
      serve(out, { port: args.port || 4173, framework: false });
      break;
    }
    default:
      console.error(`Comando desconocido: ${command}`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(`\n  Error: ${err.message}\n`);
  process.exitCode = 1;
});
