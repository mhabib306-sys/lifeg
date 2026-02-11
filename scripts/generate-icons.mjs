import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = resolve(__dirname, '../public/icons');

const conversions = [
  { input: 'icon-192.svg', output: 'icon-192.png', size: 192 },
  { input: 'icon-512.svg', output: 'icon-512.png', size: 512 },
  { input: 'icon-192-maskable.svg', output: 'icon-192-maskable.png', size: 192 },
  { input: 'icon-512-maskable.svg', output: 'icon-512-maskable.png', size: 512 },
  { input: 'icon-192.svg', output: 'apple-touch-icon.png', size: 180 },
];

for (const { input, output, size } of conversions) {
  const svgBuffer = readFileSync(resolve(iconsDir, input));
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(resolve(iconsDir, output));
  console.log(`✓ ${output} (${size}x${size})`);
}
