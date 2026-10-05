// Copia los ejemplos del monorepo (examples/*) dentro de templates/ antes de publicar,
// para que el paquete de npm incluya la plantilla "demo" sin duplicarla en git.
import { cp, rm } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const examples = ["demo"];
const skip = new Set(["node_modules", "dist", "package.json", "package-lock.json"]);

for (const name of examples) {
  const dest = join(root, "templates", name);
  await rm(dest, { recursive: true, force: true });
  await cp(join(root, "../../examples", name), dest, {
    recursive: true,
    filter: src => !skip.has(basename(src))
  });
  console.log(`Plantilla sincronizada: ${name}`);
}
