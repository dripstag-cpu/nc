// Cuts the photographic parts out of the owner's mockups and brand board (../assets/brand/, outside
// the repo) into src/assets/images/. Temporary images on the same spots as in the owner's mockups
// (Bryan, fase E: no generated images); see src/assets/images/BRONNEN.md.
// Only clean photo areas: no baked-in text, buttons, chevrons or UI. Small crops are upscaled with
// lanczos3 plus a light sharpen to the width they are shown at; they stay soft until the owner
// delivers real photos. Run: node scripts/make-images.mjs
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = join(root, '..', 'assets', 'brand');
const OUT = join(root, 'src', 'assets', 'images');

// [output name, source file, left, top, width, height, target width]
export const CROPS = [
  // homepage (ref-04 = ref-09 at 1536 px): hero right of the text, the three image cards above their titles
  ['hero-hutten-aan-het-pad.jpg', 'ref-04-homepage-mockup-p7.jpeg', 535, 82, 1001, 333, 2000],
  ['hero-hutten-aan-het-pad-mobiel.jpg', 'ref-04-homepage-mockup-p7.jpeg', 820, 82, 300, 333, 720],
  ['fietser-bij-kerk-aan-het-water.jpg', 'ref-04-homepage-mockup-p7.jpeg', 37, 565, 470, 135, 1000],
  ['kas-met-gasten.jpg', 'ref-04-homepage-mockup-p7.jpeg', 1030, 565, 470, 135, 1400],
  // verblijf (ref-07): aerial hero, three cards below the round badges
  ['terrein-luchtfoto.jpg', 'ref-07-verblijfpagina-mockup.jpeg', 0, 92, 1535, 488, 2000],
  ['caravanplaats-met-sanitairhuisje.jpg', 'ref-07-verblijfpagina-mockup.jpeg', 526, 684, 202, 104, 900],
  ['glampingtent-met-veranda.jpg', 'ref-07-verblijfpagina-mockup.jpeg', 750, 684, 205, 104, 900],
  ['trekkershut-aan-het-water.jpg', 'ref-07-verblijfpagina-mockup.jpeg', 978, 684, 205, 104, 900],
  // verblijf (ref-06 = p09): camper card, reserveerblok photo
  ['camper-op-grasveld.jpg', 'ref-06-verblijf-layout-klein.jpeg', 23, 153, 113, 89, 900],
  ['water-met-houten-brug.jpg', 'ref-06-verblijf-layout-klein.jpeg', 300, 471, 223, 85, 1000],
  // brand board (ref-01 = ref-08 at 1536 px): website mockup photo right of its text, mood photo lane
  ['water-met-kampeerplaatsen.jpg', 'ref-01-cover-hero.jpeg', 805, 545, 395, 217, 1000],
  ['laan-met-bomen.jpg', 'ref-01-cover-hero.jpeg', 968, 910, 170, 114, 1000],
  // Over ons (ref-05, left third): hero right of the text, two stacked photos, the Onze visie meadow
  ['stel-op-de-camping.jpg', 'ref-05-subpaginas-mockup.jpeg', 236, 70, 271, 204, 1200],
  ['houten-naambord-met-bloemen.jpg', 'ref-05-subpaginas-mockup.jpeg', 305, 303, 182, 140, 900],
  ['mokken-op-de-steiger.jpg', 'ref-05-subpaginas-mockup.jpeg', 304, 453, 183, 192, 900],
  ['weide-met-bomen.jpg', 'ref-05-subpaginas-mockup.jpeg', 413, 667, 94, 141, 1200],
  // Omgeving (ref-05, middle third): hero right of the text, four cards above their titles, sunset band left of the quote
  ['kerk-aan-het-water-met-bootje.jpg', 'ref-05-subpaginas-mockup.jpeg', 815, 70, 202, 200, 1200],
  ['fietsers-langs-het-water.jpg', 'ref-05-subpaginas-mockup.jpeg', 533, 375, 231, 95, 1000],
  ['wandelaars-in-de-polder.jpg', 'ref-05-subpaginas-mockup.jpeg', 768, 375, 232, 95, 1000],
  ['sloep-op-de-plas.jpg', 'ref-05-subpaginas-mockup.jpeg', 533, 532, 231, 95, 1000],
  ['dorp-met-kerktoren.jpg', 'ref-05-subpaginas-mockup.jpeg', 768, 532, 232, 95, 1000],
  ['zonsondergang-aan-het-water.jpg', 'ref-05-subpaginas-mockup.jpeg', 514, 781, 108, 113, 1200],
  // Horeca (ref-05, right third): hero right of the text, the two photos
  ['kas-met-gasten-aan-tafel.jpg', 'ref-05-subpaginas-mockup.jpeg', 1322, 70, 214, 205, 1200],
  ['gerecht-met-wijn.jpg', 'ref-05-subpaginas-mockup.jpeg', 1027, 486, 231, 180, 900],
  ['kas-met-terras.jpg', 'ref-05-subpaginas-mockup.jpeg', 1263, 486, 273, 180, 900],
  // entrance sign (ref-02 is itself a photo of the sign)
  ['toegangsbord-naescas.jpg', 'ref-02-logo-op-bord.jpeg', 0, 0, 1312, 1199, 1312],
];

for (const [name, file, left, top, width, height, target] of CROPS) {
  let img = sharp(join(BRAND, file)).extract({ left, top, width, height });
  if (target > width) img = img.resize({ width: target, kernel: 'lanczos3' }).sharpen({ sigma: 0.6 });
  await img.jpeg({ quality: 86, mozjpeg: true }).toFile(join(OUT, name));
}
console.log(`make-images: ${CROPS.length} images written`);
