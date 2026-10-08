// Registry of the temporary images: photo parts cut from the owner's mockups and brand board, on the
// same spots as in his mockups (see src/assets/images/BRONNEN.md), with alt texts that describe what is
// actually in each image. Pages pick images by key.
import type { ImageMetadata } from 'astro';
import heroHutten from '../assets/images/hero-hutten-aan-het-pad.jpg';
import heroHuttenMobiel from '../assets/images/hero-hutten-aan-het-pad-mobiel.jpg';
import fietserKerk from '../assets/images/fietser-bij-kerk-aan-het-water.jpg';
import kasGasten from '../assets/images/kas-met-gasten.jpg';
import luchtfoto from '../assets/images/terrein-luchtfoto.jpg';
import caravanSanitair from '../assets/images/caravanplaats-met-sanitairhuisje.jpg';
import glampingtent from '../assets/images/glampingtent-met-veranda.jpg';
import trekkershut from '../assets/images/trekkershut-aan-het-water.jpg';
import camper from '../assets/images/camper-op-grasveld.jpg';
import waterBrug from '../assets/images/water-met-houten-brug.jpg';
import waterKampeerplaatsen from '../assets/images/water-met-kampeerplaatsen.jpg';
import laan from '../assets/images/laan-met-bomen.jpg';
import stel from '../assets/images/stel-op-de-camping.jpg';
import naambord from '../assets/images/houten-naambord-met-bloemen.jpg';
import mokken from '../assets/images/mokken-op-de-steiger.jpg';
import weide from '../assets/images/weide-met-bomen.jpg';
import kerkBootje from '../assets/images/kerk-aan-het-water-met-bootje.jpg';
import fietsers from '../assets/images/fietsers-langs-het-water.jpg';
import wandelaars from '../assets/images/wandelaars-in-de-polder.jpg';
import sloep from '../assets/images/sloep-op-de-plas.jpg';
import dorp from '../assets/images/dorp-met-kerktoren.jpg';
import zonsondergang from '../assets/images/zonsondergang-aan-het-water.jpg';
import kasTafel from '../assets/images/kas-met-gasten-aan-tafel.jpg';
import gerecht from '../assets/images/gerecht-met-wijn.jpg';
import kasTerras from '../assets/images/kas-met-terras.jpg';
import toegangsbord from '../assets/images/toegangsbord-naescas.jpg';

export interface Img {
  src: ImageMetadata;
  alt: string;
}

export const img = {
  heroHutten: { src: heroHutten, alt: 'Donkere houten hutten aan een licht tegelpad onder bomen met roodbruin blad' },
  heroHuttenMobiel: { src: heroHuttenMobiel, alt: 'Donkere houten hutten aan een licht tegelpad onder bomen met roodbruin blad' },
  fietserKerk: { src: fietserKerk, alt: 'Water met een kerktoren aan de overkant en een fiets op het pad langs de oever' },
  kasGasten: { src: kasGasten, alt: 'Glazen kas met groen langs het dak en gasten aan tafel' },
  luchtfoto: { src: luchtfoto, alt: 'Luchtfoto van een rij kampeerplaatsen met eigen sanitairhuisje en safaritenten aan een groen veld' },
  caravanSanitair: { src: caravanSanitair, alt: 'Caravans op ruime plaatsen, elk met een eigen houten sanitairhuisje' },
  glampingtent: { src: glampingtent, alt: 'Safaritent met houten veranda en trap tussen het groen' },
  trekkershut: { src: trekkershut, alt: 'Houten trekkershut met veranda aan het water' },
  camper: { src: camper, alt: 'Camper op een grasveld tussen de bomen' },
  waterBrug: { src: waterBrug, alt: 'Water met een houten bruggetje en bomen' },
  waterKampeerplaatsen: { src: waterKampeerplaatsen, alt: 'Kampeerplaatsen met tenten en caravans aan het water, met een grote boom' },
  laan: { src: laan, alt: 'Zandpad door een laan met bomen in tegenlicht' },
  stel: { src: stel, alt: 'Lachende man en vrouw op een camping, met een houten hut op de achtergrond' },
  naambord: { src: naambord, alt: 'Houten bord met de naam Naescas tussen de bloemen' },
  mokken: { src: mokken, alt: 'Twee mokken met de teksten Rust is een keuze en Goede mensen mooie plekken op een steiger aan het water' },
  weide: { src: weide, alt: '' },
  kerkBootje: { src: kerkBootje, alt: 'Bootje met twee mensen op het water, met een kerktoren tussen de bomen' },
  fietsers: { src: fietsers, alt: 'Twee fietsers op een pad langs het water' },
  wandelaars: { src: wandelaars, alt: 'Twee wandelaars met rugzak tussen het hoge gras' },
  sloep: { src: sloep, alt: 'Sloep met mensen op een rustige plas' },
  dorp: { src: dorp, alt: 'Dorp met een kerktoren en bakstenen huizen' },
  zonsondergang: { src: zonsondergang, alt: '' },
  kasTafel: { src: kasTafel, alt: 'Gasten aan houten tafels tussen bloemen en planten in de kas' },
  gerecht: { src: gerecht, alt: 'Bord met een gerecht en een glas witte wijn' },
  kasTerras: { src: kasTerras, alt: 'Gasten aan gedekte tafels onder het glazen dak van de kas' },
  toegangsbord: { src: toegangsbord, alt: 'Groen toegangsbord van Naescas met logo, tussen de struiken' },
} satisfies Record<string, Img>;

/** Gallery per accommodation slug: the card photo of this accommodation plus the aerial photo */
export const gallery: Record<string, Img[]> = {
  'kampeerplaats-prive-sanitair': [img.caravanSanitair, img.luchtfoto],
  kampeerplaats: [img.waterKampeerplaatsen, img.luchtfoto],
  glampingtent: [img.glampingtent, img.luchtfoto],
  trekkershut: [img.trekkershut, img.luchtfoto],
  camperplaats: [img.camper, img.luchtfoto],
};

/** Card image per accommodation slug (ref-07 and p09) */
export const cardImage: Record<string, Img> = {
  'kampeerplaats-prive-sanitair': img.caravanSanitair,
  kampeerplaats: img.waterKampeerplaatsen,
  glampingtent: img.glampingtent,
  trekkershut: img.trekkershut,
  camperplaats: img.camper,
};
