#!/usr/bin/env node
/**
 * Generate iOS app icons from source icon (512x512 or larger).
 * Usage: node scripts/generate-ios-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SOURCE = 'public/icons/icon-512.png';
const OUT_DIR = 'ios/App/App/Assets.xcassets/AppIcon.appiconset';

// iOS required sizes (single-size since Xcode 15+)
const sizes = [
  { size: 1024, scale: 1, filename: 'AppIcon-1024.png', idiom: 'universal' },
];

async function generate() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const { size, scale, filename } of sizes) {
    const px = size * scale;
    await sharp(SOURCE)
      .resize(px, px, { fit: 'cover' })
      .png()
      .toFile(join(OUT_DIR, filename));
    console.log(`  Generated ${filename} (${px}x${px})`);
  }

  // Also generate the 1024@2x that Capacitor created by default
  await sharp(SOURCE)
    .resize(1024, 1024, { fit: 'cover' })
    .png()
    .toFile(join(OUT_DIR, 'AppIcon-512@2x.png'));
  console.log('  Updated AppIcon-512@2x.png (1024x1024)');

  // Write Contents.json
  const contents = {
    images: [
      {
        filename: 'AppIcon-1024.png',
        idiom: 'universal',
        platform: 'ios',
        size: '1024x1024',
      },
    ],
    info: { author: 'xcode', version: 1 },
  };

  writeFileSync(join(OUT_DIR, 'Contents.json'), JSON.stringify(contents, null, 2) + '\n');
  console.log('  Wrote Contents.json');
  console.log('Done!');
}

generate().catch(e => { console.error(e); process.exit(1); });
