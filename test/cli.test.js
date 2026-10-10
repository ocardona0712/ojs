import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

const CREATE = join(HERE, "../packages/create-ojs-app/index.js");
const OJS = join(HERE, "../packages/ojs-framework/bin/ojs.js");

function withTmp(fn) {
  const dir = mkdtempSync(join(tmpdir(), "ojs-test-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

for (const template of ["basic", "demo"]) {
  test(`create-ojs-app genera y construye la plantilla ${template}`, () => {
    withTmp(tmp => {
      execFileSync(process.execPath, [CREATE, "Mi App", "--template", template], { cwd: tmp, stdio: "pipe" });
      const app = join(tmp, "Mi App");

      const pkg = JSON.parse(readFileSync(join(app, "package.json"), "utf8"));
      assert.equal(pkg.name, "mi-app");
      assert.ok(pkg.dependencies["@ocardona0712/ojs-framework"]);
      assert.ok(existsSync(join(app, ".gitignore")));
      assert.ok(existsSync(join(app, "src/index.html")));
      assert.ok(!existsSync(join(app, "index.html")));
      assert.ok(!readFileSync(join(app, "src/index.html"), "utf8").includes("__APP_NAME__"));

      execFileSync(process.execPath, [OJS, "build"], { cwd: app, stdio: "pipe" });
      assert.ok(existsSync(join(app, "dist/index.html")));
      assert.ok(existsSync(join(app, "dist/ojs/index.js")));
      assert.ok(!existsSync(join(app, "dist/package.json")));
      assert.ok(!existsSync(join(app, "dist/src")));
      assert.ok(!existsSync(join(app, "src/dist")));
    });
  });
}

test("create-ojs-app rechaza carpetas no vacías", () => {
  withTmp(tmp => {
    execFileSync(process.execPath, [CREATE, "app"], { cwd: tmp, stdio: "pipe" });
    assert.throws(() => execFileSync(process.execPath, [CREATE, "app"], { cwd: tmp, stdio: "pipe" }));
  });
});

test("create-ojs-app rechaza plantillas desconocidas", () => {
  withTmp(tmp => {
    assert.throws(() => execFileSync(process.execPath, [CREATE, "app", "-t", "nope"], { cwd: tmp, stdio: "pipe" }));
  });
});

test("ojs build sigue soportando apps sin src/ (estructura anterior)", () => {
  withTmp(tmp => {
    writeFileSync(join(tmp, "index.html"), "<app-main></app-main>");
    mkdirSync(join(tmp, "pages"));
    writeFileSync(join(tmp, "pages/home.html"), "<h1>home</h1>");
    writeFileSync(join(tmp, "package.json"), "{}");
    execFileSync(process.execPath, [OJS, "build"], { cwd: tmp, stdio: "pipe" });
    assert.ok(existsSync(join(tmp, "dist/index.html")));
    assert.ok(existsSync(join(tmp, "dist/pages/home.html")));
    assert.ok(existsSync(join(tmp, "dist/ojs/index.js")));
    assert.ok(!existsSync(join(tmp, "dist/package.json")));
  });
});
