// Self-hosted fonts from @fontsource, latin subset only, with our own @font-face rules
// so we control font-display (the @fontsource CSS ships with `swap`).
// Three families (content/decisions.md v3): Cormorant Garamond 500 for headings, logo and big numbers;
// Lato 400 and 700 for body, menu, labels and buttons; Sacramento 400 for the handwritten accent lines
// (closest match to the mockups, comparison in .screens/faseC/script-vergelijking.png).
import cormorant500 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2?url';
import lato400 from '@fontsource/lato/files/lato-latin-400-normal.woff2?url';
import lato700 from '@fontsource/lato/files/lato-latin-700-normal.woff2?url';
import sacramento400 from '@fontsource/sacramento/files/sacramento-latin-400-normal.woff2?url';

interface Face {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  url: string;
  /** above the fold on every page: preloaded */
  preload: boolean;
}

// Unicode range of the fontsource latin subset
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

export const faces: Face[] = [
  // Preloaded: the three faces that render above the fold on every page. With font-display: optional
  // a face that is not preloaded and arrives late is skipped for that page view (seen in the test).
  { family: 'Cormorant Garamond', weight: 500, style: 'normal', url: cormorant500, preload: true }, // h1, h2, logo
  { family: 'Lato', weight: 400, style: 'normal', url: lato400, preload: true }, // body
  { family: 'Lato', weight: 700, style: 'normal', url: lato700, preload: true }, // menu, buttons
  { family: 'Sacramento', weight: 400, style: 'normal', url: sacramento400, preload: false }, // accent lines
];

// font-display (05-build.md 5b): `optional` for the preloaded faces, so no late swap and no CLS.
// The face that is not preloaded (Sacramento: accent lines, mostly below the fold or beside the
// hero text) gets `swap`: with `optional` the browser skipped it for the whole first page view.
// No local() metric-override fallback faces: those fonts do not exist on Linux/Android
// and cause CLS that only shows up on PageSpeed.
export const fontFaceCss = faces
  .map(
    (f) =>
      `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:${f.preload ? 'optional' : 'swap'};src:url(${f.url}) format('woff2');unicode-range:${LATIN}}`,
  )
  .join('');
