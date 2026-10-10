# Primeros pasos

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior. Solo se usa para el servidor de desarrollo y el build; la app final es HTML + JS estático.

## Crear una app

```bash
npx create-ojs-app mi-app
# o
npm create ojs-app@latest mi-app
```

Opciones:

| Opción | Descripción |
| --- | --- |
| `-t, --template <nombre>` | `basic` (por defecto) o `demo` |
| `-h, --help` | Ayuda |

Ejemplo con la plantilla completa:

```bash
npx create-ojs-app mi-demo --template demo
```

## Ejecutar

```bash
cd mi-app
npm install
npm run dev
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en <http://localhost:5173> |
| `npm run build` | Genera `dist/`, lista para cualquier hosting estático |
| `npm run preview` | Sirve `dist/` en <http://localhost:4173> para probar el build |

> ⚠️ Ojs carga las vistas con `fetch`, así que **no funciona abriendo `index.html` con doble clic** (`file://`). Usa siempre `npm run dev` u otro servidor HTTP.

## Estructura generada

```
mi-app/
├── src/                 ← todo el código de tu app
│   ├── components/
│   │   ├── header.html
│   │   └── footer.html
│   ├── css/styles.css
│   ├── pages/
│   │   ├── home.html
│   │   └── about.html
│   ├── scripts/
│   │   ├── home.js
│   │   └── about.js
│   └── index.html
├── dist/                ← generado por npm run build (no se edita)
├── node_modules/
└── package.json
```

> Las apps creadas con versiones anteriores, que tienen `index.html` en la raíz, siguen funcionando: `ojs` usa `src/` si existe `src/index.html` y, si no, la raíz del proyecto.

## Tu primera vista

1. Crea `src/pages/contacto.html`:

   ```html
   <section class="container">
     <h1>Contacto</h1>
     <p>Escríbenos a {{email}}</p>
   </section>
   ```

2. Crea `src/scripts/contacto.js`:

   ```js
   export function init(params) {
     window.renderTemplate({ email: "hola@miapp.com" });
   }
   ```

3. Agrega el enlace en `src/components/header.html`:

   ```html
   <a href="#contacto" data-page="contacto">Contacto</a>
   ```

Siguiente: [Navegación y parámetros](routing.md).
