export type MatchMedia = (query: string) => MediaQueryList;

export function createBrowserMatchMedia(windowObject: Window): MatchMedia {
  return (query: string): MediaQueryList => windowObject.matchMedia(query);
}
