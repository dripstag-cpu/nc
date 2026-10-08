# Iconen, pictogrammen en decoratie

Alles is nagetekend naar de mockups van de eigenaar (decisions.md v3, Iconenstijl). Eén stijl: dunne lijn, afgeronde uiteinden en hoeken, geen vulling, raster 24 x 24. De lijndikte schaalt mee met de maat (`Icon.astro`: 1,05 vanaf 30 px, 1,3 vanaf 22 px, anders 1,55), zodat hij op het scherm rond 1,5 px blijft, zoals in de mockups. Kleur volgt `currentColor`: donkergroen of olijfgroen op licht, crème of gebroken wit op donkergroen.

Mockups: ref-04 = homepage (`assets/brand/ref-04-homepage-mockup-p7.jpeg`), ref-05 = Over ons, Omgeving, Horeca, ref-07 = verblijfpagina, p09 = verblijfpagina met vier kaarten en de mini-mockups, ref-02 = toegangsbord, ref-03 = logorichtingen, ref-08 = merkboard (blok "Iconen stijl").

## Lijniconen (`Icon.astro`)

| Naam | Uit welke mockup | Waar gebruikt |
|---|---|---|
| `leaf` | ref-04 kernwaarden, Rust (twee bladeren); ref-05 Over ons, Respect voor natuur | homepage kernwaarde Rust, Over ons waarde Rust, ruimte en groen, feit "open vuur" (sections.ts) |
| `walk` | ref-04 kernwaarden, Wandelen | homepage kernwaarde Fietsen en wandelen |
| `bike` | ref-04 kernwaarden en USP-band; ref-05 Omgeving, Fietsverhuur; ref-08 fiets verhuur | homepage USP-band, omgeving icoonrij, faciliteiten fietsenstalling, contact route per fiets |
| `bird` | ref-04 kernwaarden, Natuur; ref-07 feitenraster, Natuur en water | homepage kernwaarde Natuur en Groene Hart |
| `leafsprig` | ref-04 USP-band (bladornament links en Natuur en ruimte) | USP-band, Reserveren-blok "Liever telefonisch?" (p09 blad-icoon), standaard feiticoon |
| `heart` | ref-04 USP-band, Persoonlijke benadering; ref-05 Over ons, Met passie | USP-band, horeca icoonrij (borrel) |
| `pin` | ref-04 USP-band, Midden in het Groene Hart; ref-05 Omgeving, Uitgestippelde routes | USP-band, omgeving icoonrij, homepage praktisch (locatie), contact adres |
| `person` | ref-05 Over ons, Persoonlijke aandacht; p09 Persoonlijke service en kaartfeit "Voor 2-4 pers." | Over ons waarde, verblijf praktische rij, feit personen op kaarten en detailpagina's |
| `users` | ref-05 Over ons, Kleinschalig (groepje van drie) | Over ons waarde Geen animatie of massatoerisme, feit "bezoek" (sections.ts) |
| `leafsingle` | ref-05 Horeca, streekproducten (blad met nerf) | horeca icoonrij (iets lekkers), kop van de kaart Praktische info op detailpagina's (ref-07) |
| `home` | decisions.md inventaris Over ons, huisje | homepage kernwaarde Ruimte en comfort, Over ons waarde Comfortabele verblijfsmogelijkheden, kaartfeit aantal plaatsen |
| `camera` | ref-05 Omgeving, Mooiste fotoplekken | omgeving icoonrij |
| `tree` | ref-05 Omgeving, Natuurgebieden (naaldboom) | omgeving icoonrij |
| `coffee` | ref-05 Horeca, Koffie en gebak (kop met schotel en damp) | horeca icoonrij, faciliteiten horeca |
| `cutlery` | ref-05 Horeca, Lunch (vork en mes); ref-08 horeca | horeca icoonrij |
| `wine` | ref-05 Horeca, Borrel (wijnglas) | horeca icoonrij |
| `shower` | ref-07 feitenraster, Privé sanitair (douchekop met druppels); ref-08 douche | kaartfeit sanitair, faciliteiten, feit sanitair op detailpagina's |
| `wifi` | ref-07 feitenraster, Gratis Wi-Fi; p09 praktische rij; ref-08 wifi | verblijf praktische rij, faciliteiten |
| `plug` | ref-08 elektra; ref-06 kaartfeit Stroom | faciliteiten stroom en oplaadpunt, feit stroom |
| `wash` | ref-08 afwas (bak met kraan) | faciliteiten wasruimte |
| `paw` | ref-08 huisdieren welkom; p09 Huisdieren welkom | verblijf praktische rij, feit honden op detailpagina's |
| `car` | ref-07 feitenraster, Parkeren bij de plek | homepage praktisch (bereikbaarheid), contact route per auto, feit verkeer |
| `clock` | ref-07 Praktische info, Inchecken en Uitchecken (wekker); p09 In- en uitchecken | verblijf praktische rij, Praktische info op detailpagina's (aankomst, vertrek) |
| `ruler` | ref-06 kaartfeit (afmeting) | feit maximale lengte (camperplaats) |
| `calendar` | ref-04 en alle mockups, knop BOEK NU; p09 Reserveren | header BOEK NU, sticky balk, tweede heroknop, kop van het Reserveren-blok, homepage praktisch (openingsperiode), feit seizoen en minimale verblijfsduur |
| `phone` | p09 en contact-mini-mockup | sticky balk, homepage praktisch (contact) |
| `check` | ref-07 kaartlijst (vinkjes); p09 faciliteiten-mini-mockup | wat er wel is, camping Voor wie, faciliteiten checklist, feit inbegrepen |
| `x` | tegenhanger van het vinkje (zelfde stijl) | wat er niet is, camping Voor wie niet |
| `chevron` | ref-04 beeldkaarten (in een dunne cirkel); ref-05 knop Bekijk menukaart | beeldkaarten, horeca knop, faciliteitenlinks |
| `route` | contact-mini-mockup (route) | contact, overige route |
| `map` | contact-mini-mockup (kaartvlak) | camping plattegrond |
| `bus` | zelfde stijl, voor openbaar vervoer (staat niet in een mockup, de copy vraagt erom) | contact route met openbaar vervoer |
| `camper` | ref-02 bordpictogram camper, als lijnicoon | contact route met de camper |
| `water` | ref-08 merkboard kernwaarden, Water | faciliteiten water en lozen voor campers |
| `info` | zelfde stijl (geen mockup-icoon voor huisregels) | feit huisregels en rusttijden |
| `trash` | zelfde stijl (geen mockup-icoon voor afval) | faciliteiten afval |
| `facebook` | ref-04 footer, ronde social-iconen | footer (placeholder, geen link) |
| `instagram` | ref-04 footer | footer (placeholder) |
| `tripadvisor` | ref-04 footer, derde rondje (uil-achtige ogen) | footer (placeholder) |

Bewust niet getekend: boot verhuur (ref-08) en de pijl Receptie (ref-02), omdat geen pagina een bevestigde botenverhuur of bewegwijzering toont. Bij echte botenverhuur: zelfde stijl toevoegen.

## Bordpictogrammen (`Pictogram.astro`)

Vlak gevuld zoals op het toegangsbord (ref-02), gebroken wit in een donkergroene ronde badge van 52 px met een witte rand (ref-07 en p09: badge op de foto).

| Naam | Uit welke mockup | Waar gebruikt |
|---|---|---|
| `cabin` | ref-02 bord, Trekkershutten (huisje op palen) | badge trekkershut |
| `camper` | ref-02 bord, Camperplaatsen | badge camperplaats |
| `tent` | ref-02 bord, Glampingtenten | badge glampingtent |
| `caravan` | ref-02 bord, caravan uit Campingplekken met privé sanitair | badge kampeerplaats |
| `caravan-shower` | ref-02 bord, Campingplekken met privé sanitair (caravan plus huisje met douche) | badge kampeerplaats met privé sanitair |

## Ornament, beeldmerk en botanische tekeningen

| Onderdeel | Uit welke mockup | Waar gebruikt |
|---|---|---|
| `Ornament.astro` (lijn, takje met drie blaadjes op een lichte boog, lijn) | ref-04 hero boven en onder de titel, onder de scriptregels; ref-05 | homepage hero, paginahero's, scriptregels, Praktische info-kaart, visie- en citaatband, horeca-kaart |
| `Logo.astro` beeldmerk (ronde boomkruin met stam, slingerend pad, water met riet, kerktoren, twee vogels) | ref-02 bord, ref-03 concept 1, ref-08 merkboard | header, mobiel menu (lichte versie), footer (gestapeld), horeca-kaart (alleen beeldmerk) |
| `public/decor/weide.svg` (grassen, aren, schermbloemen, silhouet in saliegroen) | ref-04 en ref-05 footerhoeken | footer, beide hoeken (links gespiegeld) |
| `public/decor/tak.svg` (bladtak) | ref-04 watermerk achter "Ruimte om tot rust te komen" | kernwaardenrij, lichte paginakop |
| papierkorrel (`--grain` in global.css, onder 6 procent dekking) | ref-08 patroon/textuur | crème en lichte crème vlakken |
