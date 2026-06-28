// Gallery categories, keyed to galleryManifest.json. Shared by the standard
// Gallery page and the pixel-theme PixelGallery so both read the same images.
// NOTE: `key` must match the manifest keys exactly (e.g. 'cards-and-sketches').
export const categories = [
  { id: 'crochet', name: 'crochet', key: 'crochet', description: 'handmade creaturely companions' },
  { id: 'digital', name: 'digital works', key: 'digital works', description: 'digital illustrations, logos, & stickers' },
  { id: 'traditional', name: 'traditional works', key: 'traditional works', description: 'colored pencil, graphite, & painted art' },
  { id: 'cards', name: 'cards & sketches', key: 'cards-and-sketches', description: 'a peek into my sketchbook & hand-painted cards' },
  { id: 'plantshley', name: 'plantshley books', key: 'plantshley books', description: 'illustrations from my childrens book series' },
];
