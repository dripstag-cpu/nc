// Shared helpers for the dist checks.
import { readFileSync, existsSync } from 'node:fs';

// The 22 routes from PLAN.md fase 2a (without /en/, which is out of scope until the language choice)
export const ROUTES = [
  '/', '/verblijf/', '/verblijf/kampeerplaats/', '/verblijf/kampeerplaats-prive-sanitair/',
  '/verblijf/glampingtent/', '/verblijf/trekkershut/', '/camperplaats/', '/camping/', '/faciliteiten/',
  '/horeca/', '/omgeving/', '/tarieven/', '/beschikbaarheid/', '/reserveren/', '/bevestiging/',
  '/over-ons/', '/contact/', '/veelgestelde-vragen/', '/privacy/', '/cookies/', '/algemene-voorwaarden/', '/404/',
];
// Detail pages have no Tommy code: their Reserveren block opens /beschikbaarheid/?verblijf=<id>.
export const WIDGET_PAGES = {
  '/beschikbaarheid/': 'searchpage',
  '/reserveren/': 'reservation',
  '/tarieven/': 'matrix',
};
export const NOINDEX = ['/beschikbaarheid/', '/reserveren/', '/bevestiging/', '/404/'];
export const file = (route) => (route === '/404/' ? 'dist/404.html' : `dist${route}index.html`);
export const html = (route) => readFileSync(file(route), 'utf8');
export const exists = (route) => existsSync(file(route));
