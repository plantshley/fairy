# Gallery Images

This folder contains all gallery images organized by category.

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
