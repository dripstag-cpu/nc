import type { PictogramName } from '../components/icon-names';

// Core site data. Facts come from ../intake.md and ../assets/booking/tommy-widgets.md.
// Anything not confirmed by the client is marked `confirmed: false` and rendered with a Placeholder.

export const site = {
  name: 'Camping Naescas',
  shortName: 'Naescas',
  descriptor: 'Camping · Het Groene Hart',
  payoff: 'Rustpunt in het Groene Hart',
  url: 'https://naescas.nl',
  formerNames: ['Camping De Oude Rijn'],
  owners: ['Rob Ubink', 'Manon Wilkes'],
  address: {
    street: 'Westkanaalweg 123',
    postalCode: '2461 GW',
    city: 'Ter Aar',
    region: 'Zuid-Holland',
    country: 'NL',
    // Address from camping directories, still to be confirmed by the client (intake vraag 1)
    confirmed: false,
  },
  // Not yet supplied by the client (intake vraag 1). Components show a Placeholder or
  // fall back to /contact/ while these are null.
  phone: null as { display: string; href: string } | null,
  email: null as string | null,
} as const;

export interface Accommodation {
  slug: string;
  href: string;
  name: string;
  /** file name in src/content/copy (without .md) */
  copy: string;
  /** name as it is in Tommy */
  tommyName: string;
  tommyId: number;
  /** max persons according to Tommy */
  maxPersons: number;
  /** number of units according to the factsheet; null = unknown */
  count: number | null;
  /** pictogram from the entrance sign in the round badge on the card */
  icon: PictogramName;
  /** sanitary line for the card fact row (only confirmed facts) */
  sanitary: string | null;
}

// Five accommodations in Tommy account 7007 (ids from the live test).
// Order = decisions.md v2 ("Kies jouw verblijf").
export const accommodations: Accommodation[] = [
  {
    slug: 'kampeerplaats-prive-sanitair',
    href: '/verblijf/kampeerplaats-prive-sanitair/',
    name: 'Kampeerplaats met privé sanitair',
    copy: 'verblijf-kampeerplaats-prive-sanitair',
    tommyName: 'Kampeerplek met prive sanitair',
    tommyId: 153221,
    maxPersons: 6,
    count: 6,
    icon: 'caravan-shower',
    sanitary: 'Eigen privé sanitair',
  },
  {
    slug: 'kampeerplaats',
    href: '/verblijf/kampeerplaats/',
    name: 'Kampeerplaats',
    copy: 'verblijf-kampeerplaats',
    tommyName: 'Kampeerplaats',
    tommyId: 153224,
    maxPersons: 4,
    count: null, // factsheet: 14 kampeerplaatsen in total, of which 6 with private sanitary; no separate number
    icon: 'caravan',
    sanitary: null,
  },
  {
    slug: 'glampingtent',
    href: '/verblijf/glampingtent/',
    name: 'Glampingtent',
    copy: 'verblijf-glampingtent',
    tommyName: 'Glampingtent met sanitair',
    tommyId: 153215,
    maxPersons: 6,
    count: 4,
    icon: 'tent',
    sanitary: 'Eigen privé sanitair',
  },
  {
    slug: 'trekkershut',
    href: '/verblijf/trekkershut/',
    name: 'Trekkershut',
    copy: 'verblijf-trekkershut',
    tommyName: 'Trekkershut',
    tommyId: 153212,
    maxPersons: 4,
    count: null, // not stated in the factsheet (intake vraag 4)
    icon: 'cabin',
    sanitary: null,
  },
  {
    slug: 'camperplaats',
    href: '/camperplaats/',
    name: 'Camperplaats',
    copy: 'camperplaats',
    tommyName: 'Camperplaats',
    tommyId: 153218,
    maxPersons: 6,
    count: 12,
    icon: 'camper',
    sanitary: null,
  },
];

export const accommodationBySlug = (slug: string) => accommodations.find((a) => a.slug === slug);
/** match a card title from the copy ("Kampeerplaats met privé sanitair") to the data */
export const accommodationByName = (name: string) =>
  accommodations.find((a) => a.name.toLowerCase() === name.trim().toLowerCase());

export interface NavItem {
  label: string;
  href: string;
}

// Main menu: briefing chapter 6, eight items (decisions.md v2)
export const mainNav: NavItem[] = [
  { label: 'Verblijf', href: '/verblijf/' },
  { label: 'Camping', href: '/camping/' },
  { label: 'Horeca', href: '/horeca/' },
  { label: 'Omgeving', href: '/omgeving/' },
  { label: 'Faciliteiten', href: '/faciliteiten/' },
  { label: 'Tarieven', href: '/tarieven/' },
  { label: 'Over ons', href: '/over-ons/' },
  { label: 'Contact', href: '/contact/' },
];

export const bookingCta: NavItem = { label: 'Boek nu', href: '/beschikbaarheid/' };

// Footer columns after the mockup (decisions.md v2, Footer)
export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: 'Navigatie',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Verblijf', href: '/verblijf/' },
      { label: 'Camping', href: '/camping/' },
      { label: 'Horeca', href: '/horeca/' },
      { label: 'Omgeving', href: '/omgeving/' },
      { label: 'Faciliteiten', href: '/faciliteiten/' },
    ],
  },
  {
    title: 'Tarieven',
    links: [
      { label: 'Tarieven', href: '/tarieven/' },
      { label: 'Beschikbaarheid', href: '/beschikbaarheid/' },
      { label: 'Reserveren', href: '/reserveren/' },
    ],
  },
  {
    title: 'Over ons',
    links: [
      { label: 'Over ons', href: '/over-ons/' },
      { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen/' },
    ],
  },
];

export const legalLinks: NavItem[] = [
  { label: 'Privacyverklaring', href: '/privacy/' },
  { label: 'Cookies', href: '/cookies/' },
  { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden/' },
];

// Pages without the mobile sticky booking bar (booking pages)
export const noStickyBarPaths = ['/beschikbaarheid/', '/reserveren/', '/bevestiging/'];
