import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gallery categories and their folder paths
const categories = [
  { key: 'cards-and-sketches', folder: 'cards-and-sketches' },
  { key: 'crochet', folder: 'crochet/pictures' },
  { key: 'digital works', folder: 'digital works' },
  { key: 'plantshley books', folder: 'plantshley books' },
  { key: 'traditional works', folder: 'traditional works' }
];

// Valid image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'];

const manifest = {};

categories.forEach(({ key, folder }) => {
  const galleryPath = path.join(__dirname, '..', 'public', 'gallery', folder);

  // Check if directory exists
  if (!fs.existsSync(galleryPath)) {
    console.warn(`Warning: Directory not found: ${galleryPath}`);
    manifest[key] = [];
    return;
  }

  // Read all files in directory
  const files = fs.readdirSync(galleryPath);

  // Filter for image files only and get their stats
  const imageFilesWithStats = files
    .filter(file => {
      const ext = path.extname(file);
      return imageExtensions.includes(ext);
    })
    .map(file => {
      const filePath = path.join(galleryPath, file);
      const stats = fs.statSync(filePath);
      return {
        file,
        mtime: stats.mtime,
        isPreview: file.toLowerCase().startsWith('preview')
      };
    });

  // Sort by: preview first, then by category-specific sorting
  imageFilesWithStats.sort((a, b) => {
    // Preview files always come first
    if (a.isPreview && !b.isPreview) return -1;
    if (!a.isPreview && b.isPreview) return 1;

    // For traditional works, sort by filename (descending)
    if (key === 'traditional works') {
      return b.file.localeCompare(a.file);
    }

    // For all other categories, sort by modification time (newest first)
    return b.mtime - a.mtime;
  });

  // Map to gallery paths
  const imageFiles = imageFilesWithStats.map(item => `gallery/${folder}/${item.file}`);

  manifest[key] = imageFiles;
  console.log(`✓ ${key}: Found ${imageFiles.length} images`);
});

// Write manifest to src directory
const manifestPath = path.join(__dirname, '..', 'src', 'galleryManifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('\n✓ Gallery manifest generated successfully!');
console.log(`✓ Saved to: ${manifestPath}`);
