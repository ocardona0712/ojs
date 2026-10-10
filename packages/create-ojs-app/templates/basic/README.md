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
src/
├── components/   header y footer
├── css/          estilos
├── pages/        vistas HTML (una por ruta: #home → src/pages/home.html)
├── scripts/      lógica por vista (src/scripts/home.js exporta init(params))
└── index.html    punto de entrada
dist/             generado por npm run build
```

## Crear una vista nueva

1. Crea `src/pages/contacto.html`
2. (Opcional) Crea `src/scripts/contacto.js` con `export function init(params) { ... }`
3. Enlázala: `<a href="#contacto" data-page="contacto">Contacto</a>`
