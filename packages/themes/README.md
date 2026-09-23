# @delaluz/themes

Runtime-neutral theme engine for the De la Luz Design System.

## Dimensions

Themes are composed from independent dimensions:

- Brand
- Color scheme
- Contrast
- Motion

## Example

```ts
const theme = resolveTheme(
  {
    brand: 'delaluz',
    scheme: 'system',
    contrast: 'system',
    motion: 'system',
  },
  environment,
);
```
