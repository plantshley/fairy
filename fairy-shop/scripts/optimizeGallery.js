import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// One-off / repeatable gallery optimizer.
// Downscales oversized images and re-encodes them to WebP so the deployed
// artifact stays well under GitHub Pages' 1 GB limit. Originals are backed up
// elsewhere, so we replace in place. Original mtimes are preserved because the
// gallery manifest sorts most categories by mtime.
//
// After running this, re-run `npm run update-gallery` and commit both the
// gallery folder and the regenerated manifest.

const GALLERY_DIR = path.join(__dirname, '..', 'public', 'gallery');
const MAX_DIM = 1800;      // longest edge, px (no enlargement)
const WEBP_QUALITY = 82;   // balanced: near-invisible loss, big savings

const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png']);
const DROP = new Set(['.tif', '.tiff']); // not web-displayable & not in manifest

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const stats = { converted: 0, dropped: 0, skipped: 0, bytesBefore: 0, bytesAfter: 0, errors: 0 };

const files = walk(GALLERY_DIR);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();

  if (DROP.has(ext)) {
    const size = fs.statSync(file).size;
    fs.unlinkSync(file);
    stats.dropped++;
    stats.bytesBefore += size;
    console.log(`  dropped  ${path.relative(GALLERY_DIR, file)} (${(size / 1e6).toFixed(1)} MB, not web-displayable)`);
    continue;
  }

  if (!CONVERTIBLE.has(ext)) {
    stats.skipped++;
    continue; // README.md, desktop.ini, already-webp, gif, etc.
  }

  const target = file.slice(0, -ext.length) + '.webp';

  // Guard against collisions (e.g. foo.png + foo.jpg -> foo.webp).
  if (target !== file && fs.existsSync(target)) {
    console.warn(`  SKIP (target exists) ${path.relative(GALLERY_DIR, target)}`);
    stats.errors++;
    continue;
  }

  const before = fs.statSync(file);

  try {
    const buf = await sharp(file)
      .rotate() // honor EXIF orientation before we strip metadata
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    fs.writeFileSync(target, buf);
    fs.utimesSync(target, before.atime, before.mtime); // preserve manifest ordering
    if (target !== file) fs.unlinkSync(file);

    stats.converted++;
    stats.bytesBefore += before.size;
    stats.bytesAfter += buf.length;
    console.log(
      `  ${path.relative(GALLERY_DIR, file)}  ${(before.size / 1e6).toFixed(1)} → ${(buf.length / 1e6).toFixed(2)} MB`
    );
  } catch (err) {
    stats.errors++;
    console.error(`  ERROR ${path.relative(GALLERY_DIR, file)}: ${err.message}`);
  }
}

console.log('\n─── summary ───');
console.log(`converted: ${stats.converted}   dropped: ${stats.dropped}   skipped: ${stats.skipped}   errors: ${stats.errors}`);
console.log(`before:    ${(stats.bytesBefore / 1e6).toFixed(0)} MB`);
console.log(`after:     ${(stats.bytesAfter / 1e6).toFixed(0)} MB (converted files only; dropped files removed)`);
