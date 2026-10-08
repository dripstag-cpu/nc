// JSON-LD per page (decisions/coordinator brief).
import { ROUTES, html } from './lib-dist.mjs';
const problems = [];
const blocks = (r) => [...html(r).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const types = (r) => blocks(r).map((b) => b['@type']);
for (const r of ROUTES) {
  const t = types(r);
  if (r === '/') {
    const c = blocks(r).find((b) => b['@type'] === 'Campground');
    if (!c || !c.alternateName?.includes('Camping De Oude Rijn')) problems.push('/: Campground with alternateName missing');
    if (t.includes('BreadcrumbList')) problems.push('/: has BreadcrumbList');
  } else if (r !== '/404/' && !t.includes('BreadcrumbList')) problems.push(`${r}: no BreadcrumbList`);
  if (r.startsWith('/verblijf/') && r !== '/verblijf/' || r === '/camperplaats/') {
    const a = blocks(r).find((b) => b['@type'] === 'Accommodation');
    if (!a || a.offers?.['@type'] !== 'Offer' || 'price' in (a.offers ?? {})) problems.push(`${r}: Accommodation/Offer`);
  }
  if (r === '/horeca/' && !t.includes('CafeOrCoffeeShop')) problems.push('/horeca/: no CafeOrCoffeeShop');
  for (const b of blocks(r).filter((b) => b['@type'] === 'FAQPage')) {
    for (const q of b.mainEntity) if (!q.acceptedAnswer.text || /nog in te vullen/i.test(q.acceptedAnswer.text)) problems.push(`${r}: FAQ with placeholder: ${q.name}`);
  }
}
const faq = blocks('/veelgestelde-vragen/').find((b) => b['@type'] === 'FAQPage');
console.log(`FAQPage on /veelgestelde-vragen/: ${faq ? faq.mainEntity.length : 0} questions`);
if (!faq) problems.push('/veelgestelde-vragen/: no FAQPage');
console.log(problems.join('\n') || 'JSONLD OK');
