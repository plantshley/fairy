// Gallery data configuration
export const galleryCategories = [
  {
    id: 'crochet',
    name: 'Crochet',
    emoji: '🧶',
    folder: 'crochet/pictures',
    description: 'Handmade creaturely companions',
  },
  {
    id: 'digital',
    name: 'Digital Works',
    emoji: '🎨',
    folder: 'digital works',
    description: 'Digital art & illustrations',
  },
  {
    id: 'traditional',
    name: 'Traditional Works',
    emoji: '🖌️',
    folder: 'traditional works',
    description: 'Traditional art & paintings',
  },
  {
    id: 'cards',
    name: 'Cards & Sketches',
    emoji: '✏️',
    folder: 'cards & sketches',
    description: 'Sketches, cards & quick art',
  },
  {
    id: 'plantshley',
    name: 'Plantshley Books',
    emoji: '📚',
    folder: 'plantshley books',
    description: 'Plant-themed book series',
  },
];

// Helper function to dynamically import all images from a gallery folder
export const getGalleryImages = (category) => {
  const images = [];
  const folderPath = category.folder;

  // This will be populated based on the actual files in the public/gallery folder
  // For now, we'll use a dynamic approach
  try {
    const context = require.context(`../public/gallery`, true, /\.(png|jpe?g|gif|webp)$/i);
    const keys = context.keys();

    keys.forEach((key) => {
      if (key.includes(folderPath)) {
        images.push({
          src: `/gallery/${key.replace('./', '')}`,
          alt: key.split('/').pop().replace(/\.[^/.]+$/, ''),
        });
      }
    });
  } catch (error) {
    console.error('Error loading gallery images:', error);
  }

  return images;
};
