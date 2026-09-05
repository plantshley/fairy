// Pixel-theme Gallery page. Reuses the real galleryManifest.json + shared
// categories and the shared GalleryLightbox; only the grid chrome is reskinned.
import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavBar, PxButton, Divider } from '../../components/pixel/PixelKit';
import { pixelPageTransition, pixelItem, pixelTitle, pixelCell } from '../../components/pixel/pageTransition';
import { px } from '../../components/pixel/asset';
import { GalleryLightbox } from '../../components/GalleryLightbox';
import { categories } from '../../galleryCategories';
import galleryManifest from '../../galleryManifest.json';
import { getAssetPath } from '../../utils/assetPath';
import { trackEvent } from '../../utils/analytics';

const ACCENT = 'var(--d-plum)';

// Thumbnail backing. #1e0556 is the darkest violet in scene-gallery.gif's own
// color table — the shade under the stage. Semi-transparent so the sparkles
// behind still show through art that has a transparent background, instead of
// the flat white card those used to sit on.
const THUMB_BG = 'rgba(69, 11, 75, 0.59)';

export function PixelGallery({ activeTab, onTabChange, onOpenAccessibility }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = galleryManifest[selectedCategory.key] || [];

  return (
    <motion.div
      className="pixel-scene relative w-full min-h-dvh overflow-hidden px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10 lg:px-20"
      {...pixelPageTransition}
      style={{
        backgroundImage: `url(${px('scenes/scene-gallery.gif')})`,
        backgroundSize: '100% auto',
        backgroundRepeat: 'repeat-y',
        backgroundPosition: 'top center',
        imageRendering: 'pixelated',
      }}
    >
      <img
        src={px('icons/sparkles.gif')}
        alt=""
        className="pixel-img pixel-deco pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.3, mixBlendMode: 'screen' }}
      />

      <div className="relative z-[2]">
        <NavBar accent={ACCENT} active={activeTab} onTabChange={onTabChange} onOpenAccessibility={onOpenAccessibility} />

        <motion.div className="text-center my-4" {...pixelTitle(0.05)}>
          <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-5">
            <img src={px('icons/uba-hearts.gif')} alt="" className="pixel-img pixel-deco w-10 sm:w-[60px] flex-shrink-0" />
            <div className="deco-title deco-title--d deco-title--d-purple font-rainy whitespace-nowrap" style={{ fontSize: 'clamp(26px, 8vw, 80px)' }}>
              ✿ gallery ✿
            </div>
            <img src={px('icons/uba-hearts.gif')} alt="" className="pixel-img pixel-deco w-10 sm:w-[60px] flex-shrink-0" />
          </div>
          <div className="font-pixel" style={{ fontSize: 10, color: ACCENT, opacity: 0.85, marginTop: 8 }}>
            a scrapbook of plushies, cards &amp; doodles
          </div>
        </motion.div>

        {/* category filter */}
        <motion.div className="flex flex-wrap gap-1.5 justify-center my-3.5" {...pixelItem(0.12)}>
          {categories.map((c) => {
            const active = c.id === selectedCategory.id;
            return (
              <PxButton
                key={c.id}
                className="pxbtn--filter"
                bg={active ? 'var(--d-pink-3)' : '#fff'}
                border={ACCENT}
                fg={active ? '#fff' : ACCENT}
                onClick={() => {
                  setSelectedCategory(c);
                  setSelectedImage(null);
                  trackEvent('gallery_category_selected', { category_id: c.id, category_name: c.name, source: 'pixel_tab' });
                }}
              >
                {c.name}
              </PxButton>
            );
          })}
        </motion.div>

        {/* image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {images.map((imagePath, i) => {
            const src = getAssetPath(`/${imagePath.replace(/ /g, '%20')}`);
            return (
              <motion.button
                key={imagePath}
                {...pixelCell(i, 0.18)}
                type="button"
                onClick={() => {
                  setSelectedImage(imagePath);
                  trackEvent('gallery_image_clicked', { category_id: selectedCategory.id, image_path: imagePath, image_index: i });
                }}
                className="text-left border-none cursor-pointer"
                style={{ background: THUMB_BG, boxShadow: `inset 0 0 0 3px ${ACCENT}, 5px 5px 0 0 var(--b-lilac)`, padding: 4 }}
              >
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                  <img src={src} alt="" loading="lazy" className="pixel-img w-full h-full" style={{ objectFit: 'cover' }} />
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div {...pixelItem(0.24)}>
          <Divider src="uba08-heart-line.gif" height={30} style={{ margin: '20px 0 0' }} />
        </motion.div>
      </div>

      <GalleryLightbox
        images={images}
        currentImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        onSelect={setSelectedImage}
      />
    </motion.div>
  );
}
