# Guía de contribución

¡Gracias por querer mejorar Ojs! 🧩

## Antes de empezar

- Revisa los [issues abiertos](https://github.com/ocardona0712/ojs/issues) por si alguien ya está trabajando en lo mismo.
- Para cambios grandes, abre primero un issue para discutir la idea.
- Ojs es un framework **pequeño y educativo**: preferimos código simple y legible a funcionalidades complejas. Sin dependencias en tiempo de ejecución.

## Entorno de desarrollo

```bash
git clone https://github.com/ocardona0712/ojs.git
cd ojs
npm install      # enlaza los workspaces
npm test         # tests con node:test
npm run demo     # levanta examples/demo en http://localhost:5173
```

### Estructura del monorepo

```
packages/ojs-framework/   runtime (src/) + CLI ojs (bin/)
packages/create-ojs-app/  generador de proyectos + plantillas
examples/demo/            app de ejemplo (también es la plantilla "demo")
docs/                     documentación
test/                     tests
```

> La plantilla `demo` de `create-ojs-app` se genera a partir de `examples/demo`. Edita siempre el ejemplo, no `templates/demo`.

## Flujo de trabajo

1. Haz un fork y crea una rama: `git checkout -b feat/mi-cambio`.
2. Haz tus cambios y agrega tests cuando aplique.
3. Ejecuta `npm test`.
4. Actualiza la documentación (`docs/`) y el [CHANGELOG](CHANGELOG.md) en la sección *Unreleased*.
5. Abre un Pull Request describiendo el qué y el porqué.

### Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` solo documentación
- `refactor:`, `test:`, `chore:`

## Publicar una versión (mantenedores)

1. Actualiza `version` en `packages/*/package.json` (y `ojsFrameworkVersion` en `create-ojs-app` si cambió el framework).
2. Mueve los cambios de *Unreleased* a la nueva versión en el `CHANGELOG.md`.
3. Crea y sube un tag: `git tag v1.1.0 && git push --tags`.
4. Crea un *Release* en GitHub desde ese tag: el workflow `release.yml` publica ambos paquetes en npm.

Requiere el secreto `NPM_TOKEN` en el repositorio (**Settings → Secrets and variables → Actions**).
