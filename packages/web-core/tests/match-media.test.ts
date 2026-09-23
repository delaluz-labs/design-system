import { describe, expect, it, type Mock, vi } from 'vitest';
import { createBrowserMatchMedia, type MatchMedia } from '../src';

describe('createBrowserMatchMedia', (): void => {
  it('debe delegar la consulta al navegador', (): void => {
    const mediaQueryList = { matches: true, media: '(test)' } as MediaQueryList;
    const matchMediaMock: Mock = vi.fn().mockReturnValue(mediaQueryList);
    const windowObject = { matchMedia: matchMediaMock } as unknown as Window;
    const matchMedia: MatchMedia = createBrowserMatchMedia(windowObject);
    const result: MediaQueryList = matchMedia('(test)');

    expect(matchMediaMock).toHaveBeenCalledWith('(test)');
    expect(result).toBe(mediaQueryList);
  });
});
