import { describe, expect, it, type Mock, vi } from 'vitest';
import {
  createThemeController,
  type MatchMedia,
  THEME_MEDIA_QUERIES,
  type ThemeController,
} from '../src';

type MediaQueryListMock = MediaQueryList & {
  change(matches: boolean): void;
};

interface ThemeMediaMock {
  scheme: MediaQueryListMock;
  contrast: MediaQueryListMock;
  motion: MediaQueryListMock;
  matchMedia: Mock<MatchMedia>;
}

function createMediaQueryList(initialMatches: boolean): MediaQueryListMock {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQueryList = {
    get matches(): boolean {
      return matches;
    },

    media: '',

    onchange: null,

    addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject): void => {
      if (type !== 'change' || typeof listener !== 'function') {
        return;
      }

      listeners.add(listener as (event: MediaQueryListEvent) => void);
    }),

    removeEventListener: vi.fn(
      (type: string, listener: EventListenerOrEventListenerObject): void => {
        if (type !== 'change' || typeof listener !== 'function') {
          return;
        }

        listeners.delete(listener as (event: MediaQueryListEvent) => void);
      },
    ),

    addListener: vi.fn(),
    removeListener: vi.fn(),

    dispatchEvent: vi.fn((): boolean => true),

    change(nextMatches: boolean): void {
      matches = nextMatches;

      const event = {
        matches,
        media: mediaQueryList.media,
      } as MediaQueryListEvent;

      for (const listener of listeners) {
        listener(event);
      }
    },
  } as unknown as MediaQueryListMock;

  return mediaQueryList;
}

function createThemeMediaMock(options?: {
  scheme?: boolean;
  contrast?: boolean;
  motion?: boolean;
}): ThemeMediaMock {
  const scheme: MediaQueryListMock = createMediaQueryList(options?.scheme ?? false);
  const contrast: MediaQueryListMock = createMediaQueryList(options?.contrast ?? false);
  const motion: MediaQueryListMock = createMediaQueryList(options?.motion ?? false);

  const media = new Map<string, MediaQueryListMock>([
    [THEME_MEDIA_QUERIES.darkScheme, scheme],
    [THEME_MEDIA_QUERIES.highContrast, contrast],
    [THEME_MEDIA_QUERIES.reducedMotion, motion],
  ]);

  const matchMedia: Mock<MatchMedia> = vi.fn<MatchMedia>((query: string): MediaQueryList => {
    const mediaQueryList: MediaQueryList | undefined = media.get(query);

    if (!mediaQueryList) {
      throw new Error(`Media query no soportada en el test: ${query}`);
    }

    return mediaQueryList;
  });

  return {
    scheme,
    contrast,
    motion,
    matchMedia,
  };
}

describe('createThemeController', (): void => {
  it('debe aplicar el theme inicial utilizando las preferencias del sistema', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock({
      scheme: true,
      contrast: false,
      motion: true,
    });
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    expect(controller.getTheme()).toEqual({
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'standard',
      motion: 'reduced',
    });
    expect(element.getAttribute('data-theme-brand')).toBe('delaluz');
    expect(element.getAttribute('data-theme-scheme')).toBe('dark');
    expect(element.getAttribute('data-theme-contrast')).toBe('standard');
    expect(element.getAttribute('data-theme-motion')).toBe('reduced');
  });

  it('debe conservar la preferencia configurada', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock();
    const element: HTMLDivElement = document.createElement('div');
    const preference = {
      brand: 'neutral',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    } as const;
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference,
    });

    expect(controller.getPreference()).toEqual(preference);
  });

  it('debe crear una sola instancia por cada media query', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock();
    const element: HTMLDivElement = document.createElement('div');

    createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    expect(media.matchMedia).toHaveBeenCalledTimes(3);
    expect(media.matchMedia).toHaveBeenCalledWith(THEME_MEDIA_QUERIES.darkScheme);
    expect(media.matchMedia).toHaveBeenCalledWith(THEME_MEDIA_QUERIES.highContrast);
    expect(media.matchMedia).toHaveBeenCalledWith(THEME_MEDIA_QUERIES.reducedMotion);
  });

  it('debe suscribirse a los cambios de las tres media queries', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock();
    const element: HTMLDivElement = document.createElement('div');

    createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    expect(media.scheme.addEventListener).toHaveBeenCalledTimes(1);
    expect(media.contrast.addEventListener).toHaveBeenCalledTimes(1);
    expect(media.motion.addEventListener).toHaveBeenCalledTimes(1);
    expect(media.scheme.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(media.contrast.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(media.motion.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('debe actualizar el theme cuando cambia el esquema del sistema', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock({ scheme: false });
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    expect(controller.getTheme().scheme).toBe('light');
    expect(element.getAttribute('data-theme-scheme')).toBe('light');

    media.scheme.change(true);

    expect(controller.getTheme().scheme).toBe('dark');
    expect(element.getAttribute('data-theme-scheme')).toBe('dark');
  });

  it('debe actualizar el theme cuando cambia el contraste del sistema', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock({ contrast: false });
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    expect(controller.getTheme().contrast).toBe('standard');
    expect(element.getAttribute('data-theme-contrast')).toBe('standard');

    media.contrast.change(true);

    expect(controller.getTheme().contrast).toBe('high');
    expect(element.getAttribute('data-theme-contrast')).toBe('high');
  });

  it('debe actualizar el theme cuando cambia la preferencia de movimiento del sistema', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock({ motion: false });
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    expect(controller.getTheme().motion).toBe('standard');
    expect(element.getAttribute('data-theme-motion')).toBe('standard');

    media.motion.change(true);

    expect(controller.getTheme().motion).toBe('reduced');
    expect(element.getAttribute('data-theme-motion')).toBe('reduced');
  });

  it('debe actualizar el theme al cambiar manualmente la preferencia', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock();
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    controller.setPreference({
      brand: 'neutral',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });

    expect(controller.getPreference()).toEqual({
      brand: 'neutral',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });
    expect(controller.getTheme()).toEqual({
      brand: 'neutral',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });
    expect(element.getAttribute('data-theme-brand')).toBe('neutral');
    expect(element.getAttribute('data-theme-scheme')).toBe('dark');
    expect(element.getAttribute('data-theme-contrast')).toBe('high');
    expect(element.getAttribute('data-theme-motion')).toBe('reduced');
  });

  it('debe ignorar cambios del sistema cuando existe una preferencia explícita', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock({ scheme: false });
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'dark',
        contrast: 'standard',
        motion: 'standard',
      },
    });

    expect(controller.getTheme().scheme).toBe('dark');

    media.scheme.change(true);
    media.scheme.change(false);

    expect(controller.getTheme().scheme).toBe('dark');
    expect(element.getAttribute('data-theme-scheme')).toBe('dark');
  });

  it('debe volver a resolver y aplicar el theme al ejecutar refresh', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock({
      scheme: false,
      contrast: false,
      motion: false,
    });
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    element.removeAttribute('data-theme-brand');
    element.removeAttribute('data-theme-scheme');
    element.removeAttribute('data-theme-contrast');
    element.removeAttribute('data-theme-motion');

    controller.refresh();

    expect(controller.getTheme()).toEqual({
      brand: 'delaluz',
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });

    expect(element.getAttribute('data-theme-brand')).toBe('delaluz');
    expect(element.getAttribute('data-theme-scheme')).toBe('light');
    expect(element.getAttribute('data-theme-contrast')).toBe('standard');
    expect(element.getAttribute('data-theme-motion')).toBe('standard');
  });

  it('debe eliminar los listeners al destruir el controller', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock();
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    controller.dispose();

    expect(media.scheme.removeEventListener).toHaveBeenCalledTimes(1);
    expect(media.contrast.removeEventListener).toHaveBeenCalledTimes(1);
    expect(media.motion.removeEventListener).toHaveBeenCalledTimes(1);
    for (const mediaQueryList of [media.scheme, media.contrast, media.motion]) {
      const registration = vi.mocked(mediaQueryList.addEventListener).mock.calls[0];

      expect(registration).toEqual(['change', expect.any(Function)]);
      expect(vi.mocked(mediaQueryList.removeEventListener).mock.calls).toEqual([registration]);
    }
  });

  it('no debe reaccionar a cambios del sistema después de dispose', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock({ scheme: false });
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    expect(controller.getTheme().scheme).toBe('light');

    controller.dispose();
    media.scheme.change(true);
    media.contrast.change(true);
    media.motion.change(true);

    expect(controller.getTheme()).toEqual({
      brand: 'delaluz',
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });
    expect(element.getAttribute('data-theme-scheme')).toBe('light');
    expect(element.getAttribute('data-theme-contrast')).toBe('standard');
    expect(element.getAttribute('data-theme-motion')).toBe('standard');
  });

  it('debe permitir ejecutar dispose más de una vez sin eliminar nuevamente los listeners', (): void => {
    const media: ThemeMediaMock = createThemeMediaMock();
    const element: HTMLDivElement = document.createElement('div');
    const controller: ThemeController = createThemeController({
      element,
      matchMedia: media.matchMedia,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });

    controller.dispose();
    controller.dispose();

    expect(media.scheme.removeEventListener).toHaveBeenCalledTimes(1);
    expect(media.contrast.removeEventListener).toHaveBeenCalledTimes(1);
    expect(media.motion.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
