# Gallery Images

This folder contains all gallery images organized by category.

## Important: Optimize New Images First (keeps the deploy under GitHub Pages' 1 GB limit)

GitHub Pages rejects a build artifact larger than **1 GB**. Full-resolution art
(multi-MB PNG/JPG) blows past that fast, and the deploy fails with
`Uploaded artifact size ... exceeds the allowed size of 1 GB`.

**Before adding large images to the gallery, run the optimizer.** The script
lives in `fairy-shop/scripts/`, so run it from the `fairy-shop` folder (not the
repo root, or `node` will fail with `Cannot find module ...\scripts\optimizeGallery.js`):

```powershell
# Change into the folder and run:
cd .\fairy-shop
node scripts/optimizeGallery.js

# Or, from the repo root, point node at the full path:
node .\fairy-shop\scripts\optimizeGallery.js
```

(The script always targets `fairy-shop/public/gallery/` regardless of where you
run it — the path is resolved relative to the script's own location.)

What it does (see [scripts/optimizeGallery.js](../../scripts/optimizeGallery.js)):
- Downscales anything larger than **1800px** on its longest edge (never upscales).
- Re-encodes to **WebP** at quality 82 — near-invisible quality loss, ~90% smaller.
- Preserves each file's original **mtime**, so gallery ordering stays the same.
- Drops non-displayable files (e.g. `.tif`) and skips files that are already WebP.

It rewrites files **in place**, so keep your master originals backed up elsewhere.
After optimizing, regenerate the manifest (next section). Then `npm run build` and
check `dist/` is comfortably under 1 GB before pushing.

> Tune `MAX_DIM` (max pixels) and `WEBP_QUALITY` at the top of the script if you
> want higher fidelity or smaller files.

## Important: After Adding/Removing Images

Whenever you add or remove images from any gallery folder, you **MUST** run:

```bash
npm run update-gallery
```

> Note: If you run the command from the repository root where there is no `package.json`, npm will fail with an `ENOENT` error. The `package.json` and the `update-gallery` script live in the `fairy-shop` folder.

Run the script from `fairy-shop` (PowerShell examples):

```powershell
# From the repo root, point npm at the package folder:
npm --prefix .\fairy-shop run update-gallery

# Or change into the folder and run normally:
cd .\fairy-shop
npm run update-gallery
```

This will regenerate the `galleryManifest.json` file to match your actual files.

### How it works:
- The script scans all folders in `public/gallery/`
- Finds all image files (jpg, jpeg, png, gif, webp)
- Files named `preview.*` are automatically used as category preview images
- Generates the manifest at `src/galleryManifest.json`

### Folders:
- `cards-and-sketches/` - Cards & sketches gallery
- `crochet/pictures/` - Crochet gallery
- `digital works/` - Digital works gallery
- `plantshley books/` - Plantshley books gallery
- `traditional works/` - Traditional works gallery
