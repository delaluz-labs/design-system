import type { ResolvedTheme } from '@delaluz/themes';
import { THEME_ATTRIBUTES } from './theme-attributes';

export function applyTheme(element: HTMLElement, theme: ResolvedTheme): void {
  element.setAttribute(THEME_ATTRIBUTES.brand, theme.brand);
  element.setAttribute(THEME_ATTRIBUTES.scheme, theme.scheme);
  element.setAttribute(THEME_ATTRIBUTES.contrast, theme.contrast);
  element.setAttribute(THEME_ATTRIBUTES.motion, theme.motion);
}
