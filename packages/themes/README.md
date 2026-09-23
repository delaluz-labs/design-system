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
import { resolveThemePreference } from '@delaluz/themes';

const theme = resolveThemePreference(
  {
    brand: 'delaluz',
    scheme: 'system',
    contrast: 'system',
    motion: 'system',
  },
  {
    scheme: 'dark',
    contrast: 'standard',
    motion: 'reduced',
  },
);
```
