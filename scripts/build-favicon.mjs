// Régénère public/favicon.ico à partir de public/favicon.svg.
// Prérequis (ponctuels, non sauvegardés dans package.json) :
//   npm install --no-save --legacy-peer-deps sharp png-to-ico
// Exécution :
//   node scripts/build-favicon.mjs
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync, readFileSync } from 'node:fs';

const SVG_PATH = 'public/favicon.svg';
const ICO_PATH = 'public/favicon.ico';
const SIZES = [16, 32, 48, 64, 128, 256];

const svg = readFileSync(SVG_PATH);

const pngs = await Promise.all(
  SIZES.map((size) =>
    sharp(svg, { density: 384 })
      .resize(size, size)
      .png()
      .toBuffer(),
  ),
);

const ico = await pngToIco(pngs);
writeFileSync(ICO_PATH, ico);

console.log(`Wrote ${ICO_PATH} (${SIZES.join(', ')} px) — ${ico.length} bytes`);
