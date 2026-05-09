import { readdirSync, statSync, existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const assetDirs = ['src/assets', 'src/assets/corners', 'src/assets/atmosphere'];
const webpQuality = 80;
const avifQuality = 58;
const jpgQuality = 85;

let webpCount = 0;
let avifCount = 0;
let jpgOptimizedCount = 0;

async function processFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const targetWebp = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const targetAvif = filePath.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  if (['.png'].includes(ext)) {
    // Convert PNG to WebP + AVIF (PNG is unused at runtime)
    if (!existsSync(targetWebp)) {
      const webpBuf = await sharp(filePath).webp({ quality: webpQuality }).toBuffer();
      await writeFile(targetWebp, webpBuf);
      webpCount++;
      console.log(`  WebP ${basename(targetWebp)}: ${fmt(webpBuf.length)}`);
    }
    if (!existsSync(targetAvif)) {
      const avifBuf = await sharp(filePath).avif({ quality: avifQuality, effort: 6 }).toBuffer();
      await writeFile(targetAvif, avifBuf);
      avifCount++;
      console.log(`  AVIF ${basename(targetAvif)}: ${fmt(avifBuf.length)}`);
    }
  }

  if (['.jpg', '.jpeg'].includes(ext)) {
    // Generate WebP if missing
    if (!existsSync(targetWebp)) {
      const webpBuf = await sharp(filePath).webp({ quality: webpQuality }).toBuffer();
      await writeFile(targetWebp, webpBuf);
      webpCount++;
      console.log(`  WebP ${basename(targetWebp)}: ${fmt(webpBuf.length)}`);
    }
    // Generate AVIF if missing
    if (!existsSync(targetAvif)) {
      const avifBuf = await sharp(filePath).avif({ quality: avifQuality, effort: 6 }).toBuffer();
      await writeFile(targetAvif, avifBuf);
      avifCount++;
      console.log(`  AVIF ${basename(targetAvif)}: ${fmt(avifBuf.length)}`);
    }
  }
}

async function recompressJpeg(filePath) {
  // Recompress large JPGs in-place to reduce file size
  const stat = statSync(filePath);
  if (stat.size < 150 * 1024) return; // Skip files under 150KB

  const ext = extname(filePath).toLowerCase();
  if (['.jpg', '.jpeg'].includes(ext)) {
    const buffer = await sharp(filePath).jpeg({ quality: jpgQuality, mozjpeg: true }).toBuffer();
    if (buffer.length < stat.size) {
      await writeFile(filePath, buffer);
      jpgOptimizedCount++;
      console.log(`  JPG ${basename(filePath)}: ${fmt(stat.size)} → ${fmt(buffer.length)} (${Math.round((1 - buffer.length / stat.size) * 100)}%)`);
    }
  }
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  console.log('\nGenerating optimized image formats...\n');

  for (const dir of assetDirs) {
    const fullPath = join(root, dir);
    if (!existsSync(fullPath)) continue;

    const files = readdirSync(fullPath)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .map(f => join(fullPath, f));

    for (const filePath of files) {
      await processFile(filePath);
    }
  }

  // Second pass: recompress large JPGs in-place
  console.log('\nRecompressing large JPG originals...\n');
  for (const dir of assetDirs) {
    const fullPath = join(root, dir);
    if (!existsSync(fullPath)) continue;

    const jpgs = readdirSync(fullPath)
      .filter(f => /\.(jpg|jpeg)$/i.test(f))
      .map(f => join(fullPath, f));

    for (const filePath of jpgs) {
      await recompressJpeg(filePath);
    }
  }

  console.log('\nSummary:');
  if (webpCount > 0) console.log(`  WebP generated: ${webpCount}`);
  if (avifCount > 0) console.log(`  AVIF generated: ${avifCount}`);
  if (jpgOptimizedCount > 0) console.log(`  JPG recompressed: ${jpgOptimizedCount}`);
  if (webpCount === 0 && avifCount === 0 && jpgOptimizedCount === 0) {
    console.log('  All images already optimized.');
  }
  console.log('');
}

main().catch(err => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
