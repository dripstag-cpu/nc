# Camping Naescas: website (Astro)

Werkende demo van naescas.nl. Leidend bouwcontract: `../content/decisions.md` (versie 3: de mockups van de eigenaar letterlijk nagebouwd; de Mockup-inventaris bovenaan is leidend). Boekingsfeiten: `../assets/booking/tommy-widgets.md`. Dit bestand beschrijft hoe de code in elkaar zit. (`AGENTS.md` verwijst hierheen; het was in de Astro-template een symlink, nu een gewoon bestand.)

Alleen deze map `website/` wordt een git-repository (remote `git@github.com:dripstag-cpu/nc.git`, branch `main`). Niets van daarbuiten hoort erin. Geen git init, commit of push zonder expliciete opdracht van Bryan.

## Draaien en testen

```bash
npm install
npm run sync-copy        # copy uit ../content/copy/ naar src/content/copy/
npm run dev              # http://localhost:4321 (achtergrond: npx astro dev --background)
npm run check            # astro check (TypeScript), moet 0 errors geven
npm run build            # productie naar dist/
npx astro preview --port 4391
npm run test:copy        # parsertest op src/lib/__fixtures__/voorbeeld.md
npm run check:dist       # na build: 22 routes, widgets alleen op de 3 widgetpagina's, noindex/sitemap,
                         # één h1 en alt overal, JSON-LD, BRONNEN.md, geen em-dash/uitroepteken/emoji
python3 scripts/browser-test.py http://localhost:4391   # Playwright, alle 22 pagina's, 390x844 en 1280x900, plus de boekingsketens
                         # (werkt ook tegen de dev-server: python3 scripts/browser-test.py http://127.0.0.1:4321)
npm run images           # uitsnedes uit de mockups in ../assets/brand/ opnieuw maken (zie src/assets/images/BRONNEN.md)
```

De Astro dev-toolbar staat uit (`devToolbar` in astro.config.mjs): hij lag over de mobiele sticky balk en ving klikken af.
Preview starten zonder terminal-venster: `npx astro preview --background --port 4391`, stoppen met `npx astro preview stop` (Astro 7 houdt één preview tegelijk bij).

HTML altijd via localhost bekijken, nooit via file://. Schermafbeeldingen gaan naar `.screens/` (gitignored). De browsertest plaatst nooit een reservering.

## Structuur

```
src/
  pages/                 een .astro per route, trailing slash altijd (/verblijf/)
  layouts/BaseLayout.astro   head (SEO, OG, canonical, noindex, JSON-LD), skip-link, Header, main#main, Footer, StickyBar
  components/            Header, Logo (tijdelijk beeldmerk), Footer, StickyBar, Ornament, Botanical (weide en bladtak uit public/decor/),
                         Hero (home), PageHero (foto), PageHeader (licht), ImageCard (grote beeldkaart),
                         StayCard (verblijfskaart), IconRow, UspBand, ReserveBlock + DateSearch, SplitFeature,
                         QuoteBand, Gallery, FactRow, InOutList, Faq, ContactForm, Placeholder, RichText, Figure,
                         Icon (lijniconen) en Pictogram (bordpictogrammen voor badges), icon-names.ts, ICONEN.md (herkomst en gebruik),
                         AccommodationPage (sjabloon detailpagina), CopyPage (tekstpagina)
  components/booking/    TommyWidget (gedeeld) + TommySearchBar, TommySearchPage, TommyReservation, TommyMatrix
  content/copy/          gesynchroniseerde copy (niet met de hand bewerken, zie hieronder)
  content.config.ts      content collection `copy`
  lib/copy.ts            copy-parser (zonder afhankelijkheden)
  lib/page-copy.ts       pageCopy('home'): entry ophalen en parsen
  lib/sections.ts        hulpjes: "Label: waarde"-regels, "Wat er is:"+lijst, eerste zin, icoon per label
  lib/links.ts           knopteksten uit de copy naar routes (de copy heeft geen doelen bij knoppen)
  lib/__fixtures__/      testbestand voor de parser
  data/site.ts           naam, adres, accommodaties met Tommy-id's, navigatie, footer
  data/tommy.ts          Tommy-token en -instellingen (de ENIGE plek met het token)
  data/jsonld.ts         Campground, WebSite, BreadcrumbList, FAQPage (alleen vragen zonder chip),
                         Accommodation + Offer zonder prijs, CafeOrCoffeeShop
  data/images.ts         register van de tijdelijke beelden met kloppende alt-teksten, galerij per verblijf
  styles/global.css      tokens, reset, knoppen, sectieachtergronden, reveal, reduced motion
  styles/fonts.ts        @font-face en preloads (fontsource, latin)
  assets/images/         tijdelijke uitsnedes uit de mockups van de eigenaar, op dezelfde plek als in zijn mockups; herkomst per bestand in BRONNEN.md
public/decor/            weide.svg (footerhoeken) en tak.svg (watermerk), saliegroene silhouetten
public/                  robots.txt, llms.txt, favicon.svg
scripts/                 sync-copy, make-images, check-*.mjs (dist-controles), browser-test.py
```

## Copy: van markdown naar pagina

- De schrijvers werken in `../content/copy/<pagina>.md` (buiten de repo). `npm run sync-copy` spiegelt die map naar `src/content/copy/` (kopieert gewijzigde, verwijdert verdwenen bestanden). Die kopie wordt gecommit, zodat Vercel kan bouwen. Na elke wijziging in de bron: sync draaien. Nooit in `src/content/copy/` zelf bewerken.
- Gekozen omdat de glob-loader alleen betrouwbaar werkt binnen het project en Vercel alleen de repo ziet. `COPY_DIR=<pad>` overschrijft de map (handig om te testen).
- Collection-id = bestandsnaam zonder `.md` (`home`, `verblijf-glampingtent`). Frontmatter: `slug` (URL-pad), `title`, `description`, `h1`, `status`.
- In een pagina: `const copy = await pageCopy('home'); const hero = section(copy, 'Hero');`

Wat de copy-parser (`src/lib/copy.ts`) teruggeeft per `## sectie`:
- `blocks`: alinea's en lijsten, met inline tekst, **vet**, *cursief*, [links](/pad/) en placeholders.
- regels binnen één alinea houden hun regelafbreking (bijvoorbeeld een adres).
- `buttons` uit `knop: tekst` (optioneel `knop: tekst -> /pad/`), `alts` uit `alt: tekst`, `fields` uit elke andere sleutelregel in kleine letters (zoals `onderregel:`); `field(sectie, 'onderregel')` geeft de eerste waarde.
- `faq`: elke `### kop` die eindigt op `?`, met het antwoord als blocks. `items`: elke andere `### kop` (kaarten, stappen) met eigen blocks, knoppen, alts en fields.
- `[[NOG IN TE VULLEN: ...]]` wordt een inline-type `placeholder`; `<RichText>` rendert die als `<Placeholder>` (zichtbaar chipje "Nog in te vullen: ..."). `toPlain()` laat placeholders weg voor meta-tags en JSON-LD.
- HTML-commentaar is een bouwersnotitie: komt in `notes` van de sectie, wordt nooit gerenderd.

## Tommy-widgets

- Alleen op drie pagina's: `/beschikbaarheid/` (TommySearchPage), `/reserveren/` (TommyReservation) en `/tarieven/` (TommyMatrix voor alle accommodaties). Homepage, /verblijf/ en de vijf detailpagina's gebruiken ons eigen Reserveren-blok (`ReserveBlock` + `DateSearch`, gewone HTML-form) en laden geen Tommy-code.
- Boekingsketens: home, /verblijf/ en BOEK NU gaan naar `/beschikbaarheid/`. Een detailpagina stuurt `verblijf=<tommyId>` mee; `TommyWidget` zet dat (alleen voor de vijf bekende id's) als `data-accommodation-id` op de zoek-en-boek-widget, die dan alleen dat verblijf toont, en de pagina meldt "Je ziet alleen: ...". Boeken gaat naar `/reserveren/` en start bij "Uw gegevens". Een directe link naar `/reserveren/?accommodation=...` is getest en bewust niet gebruikt: bij een niet-boekbare datum toont Tommy dan een lege pagina.
- /beschikbaarheid/ zonder zoekopdracht in de URL: alleen ons blok en de uitleg, de widget wordt niet getoond en Tommy's script niet geladen. Met zoekopdracht: ons blok voorgevuld uit de URL, daaronder de widget zonder Tommy's eigen balk (`.has-search .t3-widget-searchbook .t3-search-bar` verborgen).
- Matrix (/tarieven/): `age-category-filter="1"` met standaard 2 volwassenen (een klein script drukt na het laden twee keer op + bij Volwassenen; Tommy leest geen standaard uit de URL), `months-filter="1"`. De prijspopover is in `TOMMY_STYLE_OVERRIDES` vast midden in beeld gezet: Tommy plaatst hem bij de eerste klik niet (hij bestaat dan nog niet) en hij viel ver boven het scherm.
- Boven matrix en zoek-en-boek staat een chip dat de module nog testprijzen toont. De regel "De boekingsmodule wordt geleverd door Tommy Booking Support." staat niet meer bij de widgets (besluit Bryan); Tommy wordt alleen in privacy en cookies genoemd.
- Eén widget per type per pagina (een tweede geeft een scriptfout).
- Volgorde in `TommyWidget.astro` is getest en essentieel: preconnect, widgets.css, daarna het `--t3-`-stijlblok, Consent Mode "denied", de widget-div, het script (defer; matrix pas bij in beeld komen). `data-result-page-url` en `data-reservation-page-url` worden bij runtime gezet op `location.origin + '/beschikbaarheid/'` en `'/reserveren/'`.
- Widgetpagina's krijgen `noindex` (BaseLayout-prop) en staan via de filter in `astro.config.mjs` niet in de sitemap (`/beschikbaarheid/`, `/reserveren/`, `/bevestiging/`).
- `DateSearch` stuurt `arrival-date`, `departure-date` en `age-category` (JSON, 39767 volwassenen, 39764 kinderen; kinderen alleen bij 1 of meer). Zonder JS gaan `volwassenen` en `kinderen` mee en zet `TommySearchPage` die om voordat de widget laadt.
- Huisstijl via `TOMMY_STYLE_OVERRIDES` in `tommy.ts`: primary/secondary donkergroen, Lato, radius 4 px, tekst donkergroen (`--t3-text-default`), resultaatvlakken crème (`--t3-results-background`).
- De matrix laadt via IntersectionObserver (400 px marge); op /tarieven/ staat hij direct onder de kop en laadt dus meteen.
- Het token staat alleen in `src/data/tommy.ts`. Niet kopiëren naar andere bestanden of documenten.

## Pagina's

- Homepage: de tien secties uit briefing hoofdstuk 7 in vaste volgorde; de sectie "Afsluitende CTA-band" uit home.md wordt bewust niet getoond (decisions: geen secties toevoegen).
- Detailpagina's (`/verblijf/*/`, `/camperplaats/`): één sjabloon, `AccommodationPage.astro`, gevoed door `site.ts` (`copy`, `tommyId`) en het copybestand; het blok "Reserveer deze ..." vervangt de matrix. Onbekende `##`-secties (zoals "Overnachten bij evenementen") worden als tekstblok getoond.
- Privacy, cookies, algemene voorwaarden, bevestiging: `CopyPage.astro`.
- Knopteksten krijgen hun doel via `lib/links.ts`; een knop zonder doel wordt niet getoond. Nieuwe knop in de copy: label daar toevoegen.

## Ontwerptokens (global.css)

- Kleuren: `--c-green-dark` #22422B (tekst op licht, koppen, primaire knop, USP-band), `--c-green-olive` #556D3D (iconen, hover), `--c-sage` #7D9771 en `--c-sage-light` #B6C2AF (alleen vlak en lijn), `--c-cream` #E9E4D7, `--c-paper` #F2EEE4 (50/50 crème en gebroken wit: de lichte crème die de mockups tonen; header, footer, kernwaarden, kaarten), `--c-offwhite` #FAF7F2 (tekst op donkergroen), `--c-brown` #8C6B45 (lijn, icoon), `--c-brown-text` #7A5B38 (bruine tekst).
- Secties: `.bg-offwhite`, `.bg-paper`, `.bg-cream`, `.bg-sage`, `.bg-dark` plus `.section` (verticale ruimte 56 tot 88 px) en `.container` (1400 px, zijmarge 20 px mobiel, 40 px desktop). Crème vlakken krijgen een papierkorrel (`--grain`, onder 6 procent). Tekstkolom `.prose` max 65 tekens.
- Letters (drie families): Cormorant Garamond 500 (H1 hero 64 px, H2 44 px, kaarttitels 22 tot 26 px, logo, grote getallen), Lato 400/700 (body 17 tot 18 px, menu 13 px kapitalen, knoppen 13 px kapitalen 0,08 em), Sacramento 400 voor de handgeschreven accentregels (`.accent`, `.payoff`, hooguit één per sectie; gekozen op ware grootte naast de mockup, zie `.screens/faseC/script-vergelijking.png`). Zelf gehost via @fontsource, latin. Gepreload: Cormorant 500, Lato 400, Lato 700 met `font-display: optional`; Sacramento met `swap`. Geen `local()`-fallbacks (05-build.md 5b).
- Knoppen: `.btn` + `--primary` (zachte schaduw), `--secondary` (omlijnd, lichte vulling bij hover), `--light`, `--ghost-light`; 52 px mobiel, 46 px desktop, radius 6 px, rand 1,5 px. De primaire knop op een foto heeft geen extra rand (mockup). Kaarten radius 8 px met dunne saliegroene rand en zachte schaduw.
- Header lichte crème met acht menu-items (actief: dunne onderstreping) en BOEK NU (kalendericoon); footer lichte crème met de weide in beide hoeken (mockup, niet donkergroen zoals de briefing-tekst).
- Focus: 2 px donkergroen met 2 px offset; op `.bg-dark` gebroken wit.
- Animatie: `.reveal` op één element per sectie (fade via IntersectionObserver in BaseLayout), kaartfoto 1,03 bij hover. Alleen transform en opacity. `prefers-reduced-motion` zet alles uit.

## Conventies

- Zichtbare tekst altijd Nederlands, je-vorm, geen em-dashes, geen uitroeptekens, geen emoji. Code en commentaar mogen Engels.
- Eén h1 per pagina, uit de pagina zelf (de copy-frontmatter `h1`). Sectiekoppen h2, daaronder h3.
- Beelden via `<Picture>`/`Figure` uit astro:assets (AVIF, WebP, origineel als fallback), altijd via `data/images.ts`. Alleen het LCP-beeld (hero, of de eerste galerijfoto) eager met `fetchpriority="high"`, de rest lazy. De homepage-hero heeft een staande uitsnede voor telefoons (art direction in `Hero.astro`). Geen CSS-filter of blend-mode op of boven de vouw. Nooit een hele mockup tonen, en geen gegenereerde beelden (besluit Bryan, fase E): alleen fotodelen uit de mockups, op de plek waar de eigenaar ze zette. Het stel uit de Over ons-mockup staat in de hero omdat de eigenaar die foto koos; het wordt nergens als de eigenaren aangeduid.
- Feiten die de klant nog moet bevestigen: `confirmed: false` of `null` in `site.ts` en een `<Placeholder>` in de weergave. Telefoon en e-mail zijn nog leeg; de sticky balk linkt dan naar /contact/. Geen getallen afleiden die niet in de bron staan.
- Contactformulier: demo zonder endpoint; velden hebben bewust nog geen `name` (anders komt persoonlijke tekst in de URL). Met het endpoint: `name`-attributen en `method="post"` toevoegen.
- Footer bevat "Website gemaakt door Local Levers" met een volgbare link (geen nofollow) en de regel over de tijdelijke beelden uit de briefing.
- Iconen: alleen uit `Icon.astro`/`Pictogram.astro`; een nieuw icoon krijgt een regel in `ICONEN.md` (uit welke mockup, waar gebruikt).
