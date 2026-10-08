// Button labels in the copy have no targets. This maps the labels that occur in
// src/content/copy to routes, so pages do not each keep their own list.
const LINKS: Record<string, string> = {
  'Bekijk beschikbaarheid': '/beschikbaarheid/',
  'Bekijk beschikbaarheid camperplaatsen': '/camperplaats/#beschikbaarheid',
  'Koffie en lunch bij het Rustpunt': '/horeca/',
  'Bekijk het Rustpunt': '/horeca/',
  'Naar het Rustpunt': '/horeca/',
  'Bekijk de omgeving': '/omgeving/',
  'Ontdek de omgeving': '/omgeving/',
  'Naar de omgeving': '/omgeving/',
  'Fietsen en wandelen in de omgeving': '/omgeving/#fietsen-en-wandelen',
  'Bekijk tarieven': '/tarieven/',
  'Alle verblijven bekijken': '/verblijf/',
  'Bekijk de verblijven met privé sanitair': '/verblijf/kampeerplaats-prive-sanitair/',
  'Alle faciliteiten': '/faciliteiten/',
  'Naar contact en route': '/contact/#route',
  'Route plannen': '/contact/#route',
  'Naar de menukaart': '/horeca/#menukaart',
  'Terug naar de homepage': '/',
  'Naar de homepage': '/',
};

export const linkFor = (label: string): string | undefined => LINKS[label.trim()];
