// Pixel-theme Gallery page. Reuses the real galleryManifest.json + shared
// categories and the shared GalleryLightbox; only the grid chrome is reskinned.
import { useState } from 'react';
import { NavBar, PxButton, Divider } from '../../components/pixel/PixelKit';
import { px } from '../../components/pixel/asset';
import { GalleryLightbox } from '../../components/GalleryLightbox';
import { categories } from '../../galleryCategories';
import galleryManifest from '../../galleryManifest.json';
import { getAssetPath } from '../../utils/assetPath';
import { trackEvent } from '../../utils/analytics';

const ACCENT = 'var(--d-plum)';

export function PixelGallery({ activeTab, onTabChange, onOpenAccessibility }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = galleryManifest[selectedCategory.key] || [];

  return (
    <div
      className="pixel-scene relative w-full min-h-dvh overflow-hidden px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10 lg:px-20"
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

        <div className="text-center my-4">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <img src={px('icons/uba-hearts.gif')} alt="" className="pixel-img pixel-deco w-10 sm:w-[60px]" />
            <div className="deco-title deco-title--d deco-title--d-purple font-rainy" style={{ fontSize: 'clamp(40px, 9vw, 80px)' }}>
              ✿ gallery ✿
            </div>
            <img src={px('icons/uba-hearts.gif')} alt="" className="pixel-img pixel-deco w-10 sm:w-[60px]" />
          </div>
          <div className="font-pixel" style={{ fontSize: 10, color: ACCENT, opacity: 0.85, marginTop: 8 }}>
            a scrapbook of plushies, cards &amp; doodles
          </div>
        </div>

        {/* category filter */}
        <div className="flex flex-wrap gap-1.5 justify-center my-3.5">
          {categories.map((c) => {
            const active = c.id === selectedCategory.id;
            return (
              <PxButton
                key={c.id}
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
        </div>

        {/* image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-w-6xl mx-auto">
          {images.map((imagePath, i) => {
            const src = getAssetPath(`/${imagePath.replace(/ /g, '%20')}`);
            return (
              <button
                key={imagePath}
                type="button"
                onClick={() => {
                  setSelectedImage(imagePath);
                  trackEvent('gallery_image_clicked', { category_id: selectedCategory.id, image_path: imagePath, image_index: i });
                }}
                className="text-left border-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.94)', boxShadow: `inset 0 0 0 2px ${ACCENT}, 3px 3px 0 0 var(--d-pink-3)`, padding: 6 }}
              >
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                  <img src={src} alt="" loading="lazy" className="pixel-img w-full h-full" style={{ objectFit: 'cover' }} />
                </div>
              </button>
            );
          })}
        </div>

        <Divider src="uba08-heart-line.gif" height={30} style={{ margin: '20px 0 0' }} />
      </div>

      <GalleryLightbox
        images={images}
        currentImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        onSelect={setSelectedImage}
      />
    </div>
  );
}
