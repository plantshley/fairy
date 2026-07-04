# Shop images — how to add / update products

This folder holds the product images for the Shop page (both the standard themes
and the pixel theme read from the same data). You should never have to hand-edit
image sizes — there's a compression script that does it for you.

- `product-transparents/` — cut-out images with a transparent background, shown in
  the grid on the **standard themes**. Naming: `<slug>.png` (or `.jpg`).
- `product-photos/` — real photos, shown in the grid on the **pixel theme** and in
  the fullscreen lightbox on both themes. Naming: `<slug>.jpg` (or `.png`).

The `<slug>` comes from the product entry in
[`src/shopProducts.js`](../../src/shopProducts.js). Filenames are auto-derived from
it — there is no filesystem scan at runtime; the loader probes for the expected
names.

---

## Adding a new product

1. **Add the entry** in [`src/shopProducts.js`](../../src/shopProducts.js) — one
   line with a unique `slug`, `title`, `price`, `category`, and `kofiUrl`.
2. **Drop the image(s) in**, named after the slug (full size / straight from the
   camera is fine — the script shrinks them):
   - `product-transparents/<slug>.png` — the cut-out for the standard-theme grid.
   - `product-photos/<slug>.jpg` — a photo for the pixel grid + fullscreen view.
   - A product needs at least one of these. If it has no transparent, the grid
     falls back to the photo; if it has no photo, the lightbox falls back to the
     transparent.
3. **Compress:** run this from `fairy-shop/`:
   ```bash
   npm run compress-shop
   ```
   Or, if your terminal sits at the repo root (`fairy/`), either of these works
   without `cd`-ing in — the script resolves its own paths, so the working
   directory doesn't matter:
   ```bash
   node fairy-shop/scripts/compressShopImages.mjs   # simplest, runs from anywhere
   npm run compress-shop --prefix fairy-shop         # the npm alias, from the root
   ```
4. Check it in `npm run dev` → `/shop`, then commit.

### Extra angles (optional)

A product can cycle through multiple images in the grid and page through them in
the lightbox. Just add numbered variants — no code change needed:

```
product-transparents/<slug>.png     product-photos/<slug>.jpg
product-transparents/<slug>-2.png   product-photos/<slug>-2.jpg
product-transparents/<slug>-3.png   product-photos/<slug>-3.jpg
```

They're auto-detected at runtime (variant `-2`, `-3`, … until the first gap).

### Retiring a sold-out product

Delete its entry from `src/shopProducts.js`. You can leave the images or remove
them — the app only loads what's referenced by a product.

---

## The compression script

`npm run compress-shop` (→ [`scripts/compressShopImages.mjs`](../../scripts/compressShopImages.mjs))
— from `fairy-shop/`. From the repo root, use `node fairy-shop/scripts/compressShopImages.mjs`
or `npm run compress-shop --prefix fairy-shop` instead.

**What it does (balanced preset):**
- Downscales the longest edge to **≤ 1400px** (never upscales).
- PNGs → palette-compressed, **transparency preserved**.
- JPGs → re-encoded at mozjpeg quality 80.
- Only keeps the new version if it's actually smaller.

**Safe to run anytime:**
- It only touches files whose name matches a **real product slug** — so it won't
  degrade orphan source photos / unused art sitting in these folders.
- Files already within 1400px and under the size budget are **skipped**, so
  re-running only compresses newly-dropped big files. It never re-encodes an
  already-optimized image (no cumulative quality loss).
- Originals are recoverable via git. If one image ends up too soft, restore just
  that file with `git checkout -- <path>` and re-shoot/re-export it.

**Gotcha:** if you drop a photo but haven't added its product to
`src/shopProducts.js` yet, the script **skips it** (that slug isn't known). Add
the product entry first, then run `npm run compress-shop`.

---

## Why this exists

The grid displays images at ~250px but sources can be multi-thousand-px, multi-MB
files. Left uncompressed, one Shop page pulled ~90MB of transparents and made
Firefox warn that the page was slowing the browser down. Keeping images ≤ 1400px
and compressed keeps the page fast without any visible quality loss at display or
fullscreen size.
