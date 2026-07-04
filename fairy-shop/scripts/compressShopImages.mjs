// One-off: compress the Shop product images in place. Targets ONLY files whose
// name matches a product slug (or a "-N" variant of one) so we don't touch the
// orphan source photos / unused art sitting in the same folders. Balanced preset:
// downscale the longest edge to <=1400px (never upscale), palette-compress PNGs
// (keeps alpha), re-encode JPGs at mozjpeg q80. Originals are recoverable via git.
//
// Run from fairy-shop/:  node scripts/compressShopImages.mjs
import { readFile, readdir, rename, stat } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const MAX_EDGE = 1400;

const FOLDERS = [
  join(root, 'public', 'shop', 'product-transparents'),
  join(root, 'public', 'shop', 'product-photos'),
];

// Pull the product slugs straight out of shopProducts.js so this stays in sync.
const src = await readFile(join(root, 'src', 'shopProducts.js'), 'utf8');
const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const slugSet = new Set(slugs);

// A filename belongs to a product if it's "<slug>.ext" or "<slug>-<n>.ext".
const matchesProduct = (name) => {
  const stem = basename(name, extname(name));
  if (slugSet.has(stem)) return true;
  const m = stem.match(/^(.*)-\d+$/);
  return m ? slugSet.has(m[1]) : false;
};

const fmtMB = (b) => (b / 1024 / 1024).toFixed(2);
let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for (const folder of FOLDERS) {
  let entries;
  try {
    entries = await readdir(folder);
  } catch {
    console.warn(`skip (missing): ${folder}`);
    continue;
  }

  for (const name of entries) {
    const ext = extname(name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    if (!matchesProduct(name)) continue;

    const filePath = join(folder, name);
    const before = (await stat(filePath)).size;

    let pipeline = sharp(filePath).rotate().resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (ext === '.png') {
      pipeline = pipeline.png({ palette: true, quality: 82, effort: 8, compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
    }

    const tmp = `${filePath}.tmp`;
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;

    // Only keep the re-encoded version if it actually got smaller.
    if (after < before) {
      await rename(tmp, filePath);
      totalBefore += before;
      totalAfter += after;
      count += 1;
      console.log(`${name.padEnd(40)} ${fmtMB(before)}MB -> ${fmtMB(after)}MB`);
    } else {
      const { unlink } = await import('node:fs/promises');
      await unlink(tmp);
      console.log(`${name.padEnd(40)} kept original (${fmtMB(before)}MB, no gain)`);
    }
  }
}

console.log(
  `\n${count} files compressed: ${fmtMB(totalBefore)}MB -> ${fmtMB(totalAfter)}MB ` +
    `(saved ${fmtMB(totalBefore - totalAfter)}MB)`
);
