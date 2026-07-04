import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkle } from '../components/Sparkle';
import { ShopProductCard } from '../components/ShopProductCard';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { shopProducts, SHOP_CATEGORIES } from '../shopProducts';
import { trackPageView, trackTiming } from '../utils/analytics';

export const Shop = ({ currentTheme, reduceMotion = false }) => {
  const entryTimeRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    trackPageView('shop');
    entryTimeRef.current = Date.now();
    return () => {
      if (entryTimeRef.current) {
        const timeSpent = Math.round((Date.now() - entryTimeRef.current) / 1000);
        trackTiming('shop_page_time', timeSpent, 'shop_engagement');
      }
    };
  }, []);

  // Only show pills for categories that actually have a product (plus "all").
  const pills = useMemo(
    () => [
      { id: 'all', label: 'all' },
      ...SHOP_CATEGORIES.filter((c) => shopProducts.some((p) => p.category === c.id)),
    ],
    []
  );

  const filtered = useMemo(
    () =>
      selectedCategory === 'all'
        ? shopProducts
        : shopProducts.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  const openLightbox = (images) => {
    setLightboxImages(images);
    setLightboxImage(images[0]);
  };

  const isMidnight = currentTheme?.id === 'midnightVelvetMeadow';

  return (
    <motion.div
      className="w-full min-h-dvh flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Title + subtitle */}
      <motion.h1
        className="font-kalnia text-2xl sm:text-3xl md:text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.97 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ✧･ﾟ: *✧･ﾟ:* shop *:･ﾟ✧*:･ﾟ✧
      </motion.h1>

      <p
        className="text-center text-sm sm:text-base md:text-lg font-bonbon tracking-wider px-4 mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        ･ﾟ✧ browse my crochet creatures ✧ﾟ･
      </p>

      {/* Filter pills — Gallery style, smaller font */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 max-w-4xl">
        {pills.map((cat) => (
          <motion.button
            key={cat.id}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-bonbon tracking-wider text-[10px] sm:text-xs"
            style={{
              background:
                selectedCategory === cat.id
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  : isMidnight
                  ? 'rgba(42, 16, 53, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
              color: selectedCategory === cat.id ? 'white' : 'var(--text-primary)',
            }}
            onClick={() => setSelectedCategory(cat.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-4 sm:gap-6 w-full max-w-5xl">
        {filtered.map((product, i) => (
          <ShopProductCard
            key={product.slug}
            product={product}
            index={i}
            currentTheme={currentTheme}
            reduceMotion={reduceMotion}
            onOpenLightbox={openLightbox}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm mt-8" style={{ color: 'var(--text-secondary)' }}>
          ⋆˙⟡ nothing here yet — check back soon ⟡˙⋆
        </p>
      )}

      <p className="text-sm text-center mt-10" style={{ color: 'var(--text-secondary)' }}>
        ⋆⁺₊⋆ handmade with love &amp; care · tap a plushie to see it up close ⋆⁺₊⋆
      </p>

      <GalleryLightbox
        images={lightboxImages}
        currentImage={lightboxImage}
        onClose={() => setLightboxImage(null)}
        onSelect={setLightboxImage}
      />
    </motion.div>
  );
};
