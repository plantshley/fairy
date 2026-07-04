// A single product tile for the standard-theme Shop grid: a bobbing transparent
// image (auto-cycling through extra angles) that opens the fullscreen lightbox,
// with the name, price, and a Links-styled "+ adopt" button that links to Ko-fi.
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { getAssetPath } from '../utils/assetPath';
import { HoverSparkles } from './HoverSparkles';
import { useProductImages, useImageCycle } from '../hooks/useProductImages';
import { SHOP_URL } from '../shopProducts';

export function ShopProductCard({ product, index, currentTheme, reduceMotion = false, onOpenLightbox }) {
  const { gridImages, photoImages } = useProductImages(product.slug, false);
  const cycleIndex = useImageCycle(gridImages.length, index);
  const current = gridImages[cycleIndex];
  const lightboxImages = photoImages.length ? photoImages : gridImages;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative group flex flex-col h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <HoverSparkles currentTheme={currentTheme} index={index} isHovering={isHovering} idKey={product.slug} />
      {/* Bobbing image — click opens fullscreen */}
      <motion.button
        type="button"
        className="relative w-full aspect-square mb-2 focus:outline-none"
        onClick={() => lightboxImages.length && onOpenLightbox(lightboxImages)}
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={reduceMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: (index % 5) * 0.4 }}
        aria-label={`View ${product.title}`}
      >
        {/* Soft themed halo behind the transparent — brightens a touch on hover */}
        {current && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              width: '88%',
              height: '88%',
              background:
                'radial-gradient(circle, var(--accent-primary) 0%, var(--accent-secondary) 45%, transparent 72%)',
              filter: 'blur(22px)',
              opacity: isHovering ? 0.5 : 0.32,
            }}
          />
        )}
        <AnimatePresence>
          {current && (
            <motion.img
              key={current}
              src={getAssetPath(current)}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              draggable={false}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Name (left-aligned) */}
      <h3
        className="font-bonbon tracking-wide text-sm sm:text-base text-left leading-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {product.title}
      </h3>

      {/* Price (smaller) + adopt button on one row — pinned to the bottom so
          buttons align across a row even when names wrap to two lines */}
      <div className="flex justify-between items-center mt-auto pt-1 gap-2">
        <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          {product.price}
        </span>
        <a
          href={product.kofiUrl || SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="adopt-btn rounded-full px-3 py-1 text-xs font-bonbon tracking-wider whitespace-nowrap"
        >
          + adopt
        </a>
      </div>
    </div>
  );
}
