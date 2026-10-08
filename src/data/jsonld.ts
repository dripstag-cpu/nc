// JSON-LD builders. Pass the result to BaseLayout's `jsonLd` prop.
import { site, type Accommodation } from './site';
import { toPlain, type FaqPair } from '../lib/copy';

type Json = Record<string, unknown>;

export const campground = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Campground',
  '@id': `${site.url}/#campground`,
  name: site.name,
  alternateName: 'Camping De Oude Rijn',
  slogan: site.payoff,
  url: `${site.url}/`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  // geo left out until the coordinates are confirmed; sameAs empty until profiles exist
  sameAs: [],
});

export const website = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  name: site.name,
  url: `${site.url}/`,
  inLanguage: 'nl-NL',
  publisher: { '@id': `${site.url}/#campground` },
});

/** crumbs: [{ name, path }], path relative like '/verblijf/' */
export const breadcrumbs = (crumbs: { name: string; path: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${site.url}${c.path}`,
  })),
});

/** FAQ pairs as plain text (strip placeholders before passing them in) */
export const faqPage = (items: { question: string; answer: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.question,
    acceptedAnswer: { '@type': 'Answer', text: i.answer },
  })),
});

/** FAQPage from parsed copy pairs: only questions whose answer has no placeholder (decisions.md v2).
 *  Returns null when no question qualifies, so no empty FAQPage is emitted. */
export const faqPageFromCopy = (pairs: FaqPair[]): Json | null => {
  const done = pairs.filter((p) => !JSON.stringify(p.answer).includes('"type":"placeholder"'));
  return done.length ? faqPage(done.map((p) => ({ question: p.question, answer: toPlain(p.answer) }))) : null;
};

const address = () => ({
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  postalCode: site.address.postalCode,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  addressCountry: site.address.country,
});

/** One accommodation type with an Offer that links to the booking page. No price until the
 *  client supplies one (an Offer without price is valid; Google shows no price snippet). */
export const accommodation = (a: Accommodation, description: string): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Accommodation',
  '@id': `${site.url}${a.href}#accommodation`,
  name: a.name,
  description,
  url: `${site.url}${a.href}`,
  occupancy: { '@type': 'QuantitativeValue', maxValue: a.maxPersons, unitText: 'personen' },
  containedInPlace: { '@id': `${site.url}/#campground` },
  offers: {
    '@type': 'Offer',
    url: `${site.url}/beschikbaarheid/`,
    availability: 'https://schema.org/InStock',
    seller: { '@id': `${site.url}/#campground` },
  },
});

/** Horeca: opening hours only once they are known (copy note). */
export const cafe = (name: string, description: string): Json => ({
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  '@id': `${site.url}/horeca/#cafe`,
  name,
  description,
  url: `${site.url}/horeca/`,
  address: address(),
  containedInPlace: { '@id': `${site.url}/#campground` },
});
