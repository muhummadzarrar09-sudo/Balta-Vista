import fs from 'node:fs';

function imageSize(file) {
  const buffer = fs.readFileSync(file);
  const isPng = buffer.toString('ascii', 1, 4) === 'PNG';
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8;
  if (isPng) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  if (isJpeg) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] === 0xFF && buffer[offset + 1] === 0xC0)
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      offset++;
    }
    throw new Error('Cannot parse JPEG: ' + file);
  }
  throw new Error('Not PNG or JPEG: ' + file);
}

const required = [
  ['public/assets/hero/luxury-hero-nathiagali.jpg', 1800, 1000, 'hero'],
  ['public/assets/rooms/room-suite-luxury.jpg', 1600, 1200, 'suite'],
  ['public/assets/rooms/room-double-luxury.jpg', 1600, 1200, 'double'],
  ['public/assets/rooms/room-single-luxury.jpg', 1600, 1200, 'single'],
  ['public/assets/experience/experience-snowfall-nathiagali.jpg', 1800, 1000, 'snow'],
  ['public/assets/experience/experience-trails-nathiagali.jpg', 1800, 1000, 'trails'],
  ['public/assets/experience/experience-bonfire-nathiagali.jpg', 1800, 1000, 'bonfire'],
  ['public/assets/story/owner-lounge-placeholder.jpg', 1000, 1400, 'story'],
];

for (const [file, minW, minH, label] of required) {
  if (!fs.existsSync(file)) throw new Error('Missing: ' + file);
  const { width, height } = imageSize(file);
  if (width < minW || height < minH) throw new Error(label + ' too small: ' + width + 'x' + height);
  console.log(label + ': ' + width + 'x' + height);
}

console.log('Asset QA passed: ' + required.length + ' images checked.');
