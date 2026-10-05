# __APP_NAME__

Aplicación creada con [Ojs](https://github.com/ocardona0712/ojs).

## Scripts

```bash
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera dist/ listo para cualquier hosting estático
npm run preview  # sirve dist/ localmente
```

## Estructura

```
components/   header y footer
css/          estilos
pages/        vistas HTML (una por ruta: #home → pages/home.html)
scripts/      lógica por vista (scripts/home.js exporta init(params))
index.html    punto de entrada
```

## Crear una vista nueva

1. Crea `pages/contacto.html`
2. (Opcional) Crea `scripts/contacto.js` con `export function init(params) { ... }`
3. Enlázala: `<a href="#contacto" data-page="contacto">Contacto</a>`
