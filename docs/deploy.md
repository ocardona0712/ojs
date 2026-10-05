# Despliegue

```bash
npm run build
```

Genera `dist/` con HTML, JS y CSS estáticos que puedes subir a cualquier hosting estático. Como Ojs usa rutas con hash (`#home`), **no necesitas reglas de rewrite**.

## GitHub Pages

Crea `.github/workflows/deploy.yml` en tu app:

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Luego, en el repositorio, ve a **Settings → Pages → Source** y elige **GitHub Actions**.

## Netlify / Vercel / Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`

## Sin Node: desde un CDN

También puedes usar Ojs sin instalar nada, importándolo desde jsDelivr:

```html
<script type="module">
  import { start } from "https://cdn.jsdelivr.net/npm/@ocardona0712/ojs-framework@1/src/index.js";
  window.addEventListener("DOMContentLoaded", () => start({ defaultPage: "home" }));
</script>
```

Después sirve la carpeta con cualquier servidor estático, como `npx serve .` o la extensión Live Server de VS Code.
