import fs from 'node:fs';

function pngSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} is not a PNG`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const required = [
  { file: 'public/assets/hero/luxury-hero-nathiagali.png', minWidth: 2600, minHeight: 1400, label: 'hero exterior' },
  { file: 'public/assets/rooms/room-suite-luxury.png', minWidth: 2200, minHeight: 1600, label: 'signature suite' },
  { file: 'public/assets/rooms/room-double-luxury.png', minWidth: 2200, minHeight: 1600, label: 'double bedroom' },
  { file: 'public/assets/rooms/room-single-luxury.png', minWidth: 2200, minHeight: 1600, label: 'single bedroom' },
  { file: 'public/assets/experience/experience-snowfall-nathiagali.png', minWidth: 2600, minHeight: 1400, label: 'snowfall experience' },
  { file: 'public/assets/experience/experience-trails-nathiagali.png', minWidth: 2600, minHeight: 1400, label: 'green trails experience' },
  { file: 'public/assets/experience/experience-bonfire-nathiagali.png', minWidth: 2600, minHeight: 1400, label: 'bonfire experience' },
  { file: 'public/assets/story/owner-lounge-placeholder.png', minWidth: 1600, minHeight: 2000, label: 'story/owner image' }
];

for (const asset of required) {
  if (!fs.existsSync(asset.file)) throw new Error(`Missing ${asset.label}: ${asset.file}`);
  const { width, height } = pngSize(asset.file);
  if (width < asset.minWidth || height < asset.minHeight) {
    throw new Error(`${asset.label} too small: ${asset.file} is ${width}x${height}, expected at least ${asset.minWidth}x${asset.minHeight}`);
  }
  console.log(`${asset.label}: ${width}x${height}`);
}

console.log(`Asset QA passed: ${required.length} raster assets checked.`);
