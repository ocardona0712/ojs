# Política de seguridad

## Versiones soportadas

| Versión | Soporte |
| --- | --- |
| 1.x | ✅ |

## Reportar una vulnerabilidad

**No abras un issue público.** Usa [GitHub Security Advisories](https://github.com/ocardona0712/ojs/security/advisories/new).

Incluye una descripción del problema, los pasos para reproducirlo y el impacto. Te responderemos lo antes posible.

## Nota sobre plantillas

Desde `ojs-framework` 1.1.0, `{{var}}` escapa el HTML automáticamente. `{{{var}}}` inserta HTML sin escapar a propósito: usarlo con contenido no confiable no se considera una vulnerabilidad del framework. Más detalles en [docs/templates.md](docs/templates.md#-seguridad).
