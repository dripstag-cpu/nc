// Tommy Booking Support (account 7007). The ONLY place the widget token lives.
// Source: ../assets/booking/tommy-widgets.md (live test 2026-10-08).
// The token is public (it ends up in the page HTML) but is not repeated anywhere else in this repo.
export const TOMMY_TOKEN =
  '7007-ec1a007f2d85d247f181a181f54b2f7cd246ec74c27826c9f9e3e2ebb53cb1d93accb5dc4eaec2b853e7423fadeab7490945c0b3d4afa937559dea199278bea1';

export const TOMMY_HOST = 'https://public.tommbookingsupport.nl';
export const TOMMY_CSS = `${TOMMY_HOST}/assets/widgets.css`;

export type TommyWidget = 'searchbar' | 'searchpage' | 'reservation' | 'matrix';
export const tommyScript = (widget: TommyWidget) => `${TOMMY_HOST}/${widget}.js`;

// Age categories in account 7007
export const AGE_CATEGORY = {
  babies: 39761,
  children: 39764, // Kinderen 2 tot 15
  adults: 39767,
  seniors: 39770,
} as const;

// Paths on our own site the widgets link to. Turned into absolute URLs at runtime
// (location.origin + path) so the same build works on localhost and in production.
export const RESULT_PAGE_PATH = '/beschikbaarheid/';
export const RESERVATION_PAGE_PATH = '/reserveren/';

// House style overrides. Boxes, price cells and the matrix popover in offwhite (250, 247, 242), never hard white.
// Must be placed AFTER the widgets.css link (tested: before it, Tommy wins).
// --t3-secondary is used by the search button and prices; without it they stay orange.
// decisions.md v2: also text in dark green (default black), result tiles in cream (default grey),
// radius 4px like the mockup buttons.
//
// Matrix price popover: Tommy toggles it on click and tries to position it in the same tick, before
// Vue has rendered it, so the positioning is skipped and widgets.css leaves it at
// position:absolute; top:50%; left:50% of the document. On any page where the matrix is not at the
// very top, the popover (with the Boeken button) opens far above the viewport. Below 576px Tommy never
// positions it. Fix: show it as a dialog fixed in the middle of the viewport, overriding any inline values.
export const TOMMY_STYLE_OVERRIDES = `:root{--t3-primary:34, 66, 43;--t3-primary-hover:85, 109, 61;--t3-secondary:34, 66, 43;--t3-secondary-hover:85, 109, 61;--t3-font-family:Lato, 'Helvetica Neue', Arial, sans-serif;--t3-border-radius:4px;--t3-calendar-cell-active-background-color:#22422B;--t3-text-default:34, 66, 43;--t3-results-background:233, 228, 215;--t3-box-bg:250, 247, 242;--t3-box-bg-hover:242, 238, 228;--t3-matrix-cols-bg:250, 247, 242}.t3-widget-root .t3-matrix-popover{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%);z-index:70;min-width:0;width:min(360px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow-y:auto;overscroll-behavior:contain;background-color:rgb(250, 247, 242)}`;

// Consent Mode default "denied" before any widget script: Tommy's built-in GTM then sets no _ga cookies.
export const CONSENT_DEFAULT_SCRIPT =
  "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})";
