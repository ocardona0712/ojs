# create-ojs-app

Crea una aplicación **[Ojs](https://github.com/ocardona0712/ojs)** con un solo comando.

```bash
npx create-ojs-app mi-app
# o
npm create ojs-app@latest mi-app
```

```bash
cd mi-app
npm install
npm run dev
```

## Plantillas

| Plantilla | Descripción |
| --- | --- |
| `basic` (por defecto) | Estructura mínima: home, about, header, footer y CSS |
| `demo` | Ejemplo completo: recetas y carritos con [DummyJSON](https://dummyjson.com) + Bootstrap |

```bash
npx create-ojs-app mi-demo --template demo
```

## Opciones

| Opción | Descripción |
| --- | --- |
| `-t, --template <nombre>` | Plantilla a usar |
| `-h, --help` | Ayuda |
| `-v, --version` | Versión |

📚 Documentación: <https://github.com/ocardona0712/ojs/tree/master/docs>

MIT © Omar Andres Cardona (El ODev)
