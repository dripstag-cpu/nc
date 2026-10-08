# Camping Naescas

Astro-website voor Camping Naescas in Ter Aar, in het Groene Hart. Boeken via de widgets van Tommy Booking Support.

## Lokaal draaien

```bash
npm install
npm run sync-copy   # haal de laatste copy op uit ../content/copy/
npm run dev         # http://localhost:4321
npm run build       # productie-build naar dist/
npx astro preview --port 4391   # build lokaal bekijken op http://localhost:4391
```

Testen na een build (preview draait op poort 4391):

```bash
npm run check            # TypeScript
npm run check:dist       # controles op dist/
python3 scripts/browser-test.py http://localhost:4391
```

## Deploy naar Vercel

Nog niet uitvoeren zonder akkoord van Bryan. Zo gaat het straks:

1. Deze map (`website/`) is de root van de repository `git@github.com:dripstag-cpu/nc.git`, branch `main`. Niets van buiten deze map gaat mee.
2. Maak in Vercel een **New Project** en koppel de GitHub-repository.
3. Vercel herkent Astro: framework **Astro**, build `npm run build`, output `dist/`. Node 22.12 of hoger.
4. Geen environment variables nodig.
5. Deploy. Koppel daarna het domein `naescas.nl` onder **Settings > Domains** (Vercel regelt HTTPS).

Let op: in `astro.config.mjs` staat `site: 'https://naescas.nl'`; sitemap en canonicals gebruiken die waarde.

De copy komt uit `src/content/copy/`. Die map is een gecommitte kopie van `../content/copy/` (de werkmap van de schrijvers, buiten de repository). Draai `npm run sync-copy` na elke wijziging en commit het resultaat, anders bouwt Vercel met oude teksten.

## Nog te doen voor livegang

- [ ] Telefoonnummer, e-mailadres en bevestigd adres in `src/data/site.ts`
- [ ] Echte fotografie in plaats van de tijdelijke referentiebeelden
- [ ] Definitief logo in plaats van het tijdelijke beeldmerk (`src/components/Logo.astro`, `public/favicon.svg`)
- [ ] Contactformulier aan een endpoint koppelen (zie CLAUDE.md)
- [ ] Echte fotografie: `src/assets/images/` en `src/data/images.ts`
- [ ] Cookie- en analyticskeuze (Tommy laadt zijn eigen Google Tag Manager; Consent Mode staat op "denied")
- [ ] In Tommy: succes-URL `/bevestiging/`, privacy- en voorwaarden-URL's, echte prijzen
- [ ] Redirects van campingdeouderijn.nl
- [ ] Lighthouse tegen de live URL
- [ ] Google Search Console en Bing, sitemap indienen

## Structuur

Zie `CLAUDE.md`.
