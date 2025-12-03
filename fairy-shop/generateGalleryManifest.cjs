const fs = require('fs');
const path = require('path');

const galleryDir = 'public/gallery';
const categories = fs.readdirSync(galleryDir);

const manifest = {};

categories.forEach(category => {
  const categoryPath = path.join(galleryDir, category);
  if (fs.statSync(categoryPath).isDirectory()) {
    const images = [];

    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          scanDir(itemPath);
        } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item)) {
          const relativePath = itemPath.replace('public' + path.sep, '').split(path.sep).join('/');
          images.push(relativePath);
        }
      });
    };

    scanDir(categoryPath);
    manifest[category] = images;
  }
});

fs.writeFileSync('src/galleryManifest.json', JSON.stringify(manifest, null, 2));
console.log('Gallery manifest created successfully!');
console.log(`Found ${Object.keys(manifest).length} categories`);
Object.keys(manifest).forEach(cat => {
  console.log(`  ${cat}: ${manifest[cat].length} images`);
});
