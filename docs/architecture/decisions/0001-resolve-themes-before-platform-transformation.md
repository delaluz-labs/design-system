# ADR 0001: Resolver themes antes de la transformación por plataforma

## Estado

Aceptado.

## Contexto

El Design System soporta múltiples dimensiones de theme:

- brand
- scheme
- contrast
- motion

Las variantes pueden redefinir rutas de tokens existentes.

Style Dictionary no debe recibir simultáneamente todas las variantes como fuentes independientes porque esas redefiniciones representan overrides intencionales y pueden producir colisiones.

## Decisión

Los tokens serán compuestos por el Theme Resolver antes de ser enviados a Style Dictionary.

El orden conceptual será:

DTCG Sources
→ Theme Resolver
→ Resolved Token Tree
→ Style Dictionary
→ Platform Artifacts

El último valor aplicable según el orden de resolución tiene prioridad.

Style Dictionary será responsable de transformaciones, resolución final de aliases y generación de formatos.

## Consecuencias

### Positivas

- Las colisiones intencionales se resuelven explícitamente.
- El comportamiento de los themes es determinista.
- Style Dictionary recibe un único árbol coherente.
- La resolución es independiente de la plataforma.
- Podemos probar todas las combinaciones antes de generar artefactos.

### Negativas

- Mantenemos una capa de resolución propia.
- El resolver requiere pruebas y mantenimiento.
- Debemos conservar compatibilidad con el formato DTCG adoptado.
