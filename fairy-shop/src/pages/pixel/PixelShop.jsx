// Pixel-theme Shop page. Reads the shared product data from src/shopProducts.js
// (same source as the standard-theme Shop). Photos come from public/shop/
// product-photos/; tapping a product opens the shared fullscreen lightbox and
// the "+ adopt" button links out to the item's Ko-fi page.
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar, PxButton, Marquee, Slot } from '../../components/pixel/PixelKit';
import { px } from '../../components/pixel/asset';
import { GalleryLightbox } from '../../components/GalleryLightbox';
import { getAssetPath } from '../../utils/assetPath';
import { useProductImages, useImageCycle } from '../../hooks/useProductImages';
import { shopProducts, SHOP_CATEGORIES, SHOP_URL } from '../../shopProducts';
// Side-effect import: registers the <pixel-canvas> web component (hover shimmer,
// same effect as the pixel Links page).
import '../../components/pixel/pixelCanvas';

const ACCENT = 'var(--d-plum)';
const SLOT_TINTS = ['var(--d-pink)', 'var(--d-lilac)', 'var(--d-pink-2)', 'var(--b-yellow)', 'var(--d-cyan)', 'var(--d-cream-2)'];
// pixel-canvas shimmer colors — warm pink/lilac sparks to match the shop accent.
const SHIMMER = '#ff85c8,#ffd166,#c08aff,#ffb3e6,#ffe85c';

// Favorite-heart icons (from public/pixel/icons/). When a card is favorited the
// outline ♡ swaps to one of these pixel GIFs. Icons are handed out to products via
// a shuffle bag (every icon is used once before any repeats), randomised per
// install but persisted so a given plushie keeps its charm across reloads.
const FAV_ICONS = ['heart', 'angel-heart', 'clover', 'strawb4', 'rainbow-star', 'spooky3', 'rainbow2-left', "wand2"];
const favKey = (slug) => `fairy-shop-fav:${slug}`;

// Small seeded PRNG so the (random) icon assignment is reproducible from one stored
// seed — same seed + same product/icon lists => same map, stable across reloads.
const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// One persisted random seed per install (falls back to a fixed value if storage is
// unavailable, so the map is still stable within the session).
const getFavSeed = () => {
  try {
    let s = localStorage.getItem('fairy-shop-fav-seed');
    if (s == null) {
      s = String((Math.random() * 0xffffffff) >>> 0);
      localStorage.setItem('fairy-shop-fav-seed', s);
    }
    return Number(s) >>> 0;
  } catch {
    return 0x9e3779b9;
  }
};

// Walk the products in order, drawing from a reshuffled bag of all icons so each is
// used once before any repeat (with no repeat straddling a bag boundary either).
const buildIconMap = (slugs) => {
  const rand = mulberry32(getFavSeed());
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const map = {};
  let bag = [];
  let last = null;
  for (const slug of slugs) {
    if (bag.length === 0) {
      bag = shuffle(FAV_ICONS);
      // We pop from the end; if that would repeat the previous card's icon, swap it
      // to the front so the boundary doesn't land on a duplicate.
      if (bag.length > 1 && bag[bag.length - 1] === last) {
        [bag[bag.length - 1], bag[0]] = [bag[0], bag[bag.length - 1]];
      }
    }
    last = bag.pop();
    map[slug] = last;
  }
  return map;
};

const ICON_MAP = buildIconMap(shopProducts.map((p) => p.slug));
const iconForSlug = (slug) => ICON_MAP[slug] || FAV_ICONS[0];

function PixelProductCard({ product, index, onOpenLightbox }) {
  const { gridImages, photoImages } = useProductImages(product.slug, true);
  const cycleIndex = useImageCycle(gridImages.length, index);
  const current = gridImages[cycleIndex];
  const lightboxImages = photoImages.length ? photoImages : gridImages;
  const [liked, setLiked] = useState(() => {
    try {
      return localStorage.getItem(favKey(product.slug)) === '1';
    } catch {
      return false;
    }
  });
  const toggleLike = () =>
    setLiked((v) => {
      const next = !v;
      try {
        if (next) localStorage.setItem(favKey(product.slug), '1');
        else localStorage.removeItem(favKey(product.slug));
      } catch {
        /* localStorage unavailable (private mode) — favorite is session-only */
      }
      return next;
    });

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.96)', boxShadow: `inset 0 0 0 3px ${ACCENT}, 4px 4px 0 0 ${ACCENT}`, padding: 10 }}
    >
      {/* hover shimmer (pixel-canvas) — decorative; dropped by high-contrast /
          reduce-motion via .pixel-deco */}
      <pixel-canvas
        class="pixel-deco"
        data-colors={SHIMMER}
        data-gap="6"
        data-speed="35"
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <button
        type="button"
        onClick={() => lightboxImages.length && onOpenLightbox(lightboxImages)}
        aria-label={`View ${product.title}`}
        className="relative z-[1] block w-full aspect-square mb-2.5 p-0 bg-transparent overflow-hidden"
        style={{ border: 'none', cursor: lightboxImages.length ? 'pointer' : 'default' }}
      >
        {current ? (
          <AnimatePresence>
            <motion.img
              key={current}
              src={getAssetPath(current)}
              alt={product.title}
              className="pixel-img absolute inset-0 w-full h-full"
              style={{ objectFit: 'cover', display: 'block' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              draggable={false}
            />
          </AnimatePresence>
        ) : (
          <Slot label={product.title} w="100%" h="100%" bg={SLOT_TINTS[index % SLOT_TINTS.length]} fg={ACCENT} />
        )}
      </button>
      {/* Favorite heart — its own button (not nested in the image button) so a tap
          toggles it without opening the lightbox. When favorited the outline ♡ swaps
          to this product's pixel charm; state persists in localStorage. */}
      <motion.button
        type="button"
        onClick={toggleLike}
        aria-label={liked ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
        aria-pressed={liked}
        whileTap={{ scale: 1.4 }}
        transition={{ type: 'spring', stiffness: 600, damping: 15 }}
        className="absolute z-[3] flex items-center justify-center p-0 bg-transparent leading-none"
        style={{
          top: 12,
          right: 12,
          width: 26,
          height: 26,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {liked ? (
          <img
            src={px(`icons/${iconForSlug(product.slug)}.gif`)}
            alt=""
            className="pixel-img block w-full h-full"
            draggable={false}
          />
        ) : (
          <span style={{ fontSize: 20, lineHeight: 1, color: 'var(--d-pink-3)' }}>♡</span>
        )}
      </motion.button>
      <div className="relative z-[1] font-rainy" style={{ fontSize: 22, color: ACCENT, lineHeight: 1, marginBottom: 4 }}>{product.title}</div>
      <div className="relative z-[1] flex justify-between items-center mt-auto">
        <span className="font-pixel" style={{ fontSize: 12, color: 'var(--d-pink-3)' }}>{product.price}</span>
        <a
          href={product.kofiUrl || SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pxbtn no-underline"
          style={{ '--btn-bg': 'var(--d-pink-3)', '--btn-border': ACCENT, '--btn-fg': '#fff' }}
        >
          + adopt
        </a>
      </div>
    </div>
  );
}

export function PixelShop({ activeTab, onTabChange, onOpenAccessibility }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

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

  return (
    <div className="bgD relative w-full min-h-dvh overflow-hidden">
      <img
        src={px('icons/sparkles.gif')}
        alt=""
        className="pixel-img pixel-deco pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.3, mixBlendMode: 'screen' }}
      />
      {/* butterflies tiled across the bg */}
      <div
        className="pixel-img pixel-deco pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${px('icons/butterflies.gif')})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px auto',
          opacity: 0.95,
        }}
      />

      <div className="relative z-[2] px-4 py-6 sm:px-10 lg:px-20">
        <NavBar accent={ACCENT} active={activeTab} onTabChange={onTabChange} onOpenAccessibility={onOpenAccessibility} />

        <div className="text-center my-5">
          <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-5">
            <img src={px('icons/twinkle-shop.gif')} alt="" className="pixel-img pixel-deco w-9 sm:w-12 flex-shrink-0" />
            <div className="deco-title deco-title--d deco-title--d-neon font-rainy whitespace-nowrap" style={{ fontSize: 'clamp(26px, 8vw, 80px)' }}>
              ♡ shop ♡
            </div>
            <img src={px('icons/twinkle-shop.gif')} alt="" className="pixel-img pixel-deco w-9 sm:w-12 flex-shrink-0" />
          </div>
        </div>

        {/* animated marquee banner */}
        <div
          className="my-4"
          style={{
            background: 'linear-gradient(90deg, var(--d-pink-3), var(--b-yellow), var(--d-lilac-2), var(--d-pink-3))',
            backgroundSize: '300% 100%',
            animation: 'holo-shift 5s linear infinite',
            boxShadow: `inset 0 0 0 3px ${ACCENT}, 4px 4px 0 0 var(--d-pink-3)`,
            padding: '8px 0',
          }}
        >
          <Marquee speed={28}>
            <span className="font-pixel" style={{ fontSize: 12, color: '#fff', textShadow: `1px 1px 0 ${ACCENT}`, padding: '0 8px', display: 'inline-block' }}>
              ♡ tap a plushie to see it up close ♡ &nbsp; ★ commissions open ★ &nbsp; ♡ + adopt visits my ko-fi ♡ &nbsp; ✦ DM me for 5% off ✦ &nbsp;
            </span>
          </Marquee>
        </div>

        {/* category strip */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {pills.map((c) => {
            const active = selectedCategory === c.id;
            return (
              <PxButton
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                bg={active ? 'var(--d-pink-3)' : '#fff'}
                border={ACCENT}
                fg={active ? '#fff' : ACCENT}
              >
                {c.label}
              </PxButton>
            );
          })}
        </div>

        {/* product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-3 sm:gap-4 max-w-5xl mx-auto">
          {filtered.map((product, i) => (
            <PixelProductCard key={product.slug} product={product} index={i} onOpenLightbox={openLightbox} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-pixel text-center mt-6" style={{ fontSize: 10, color: ACCENT }}>
            ✦ nothing here yet — check back soon ✦
          </p>
        )}

        <p className="font-pixel text-center mt-6" style={{ fontSize: 10, color: ACCENT, opacity: 0.8 }}>
          ⋆⁺₊⋆ handmade with love &amp; care · tap a plushie to see it up close ⋆⁺₊⋆
        </p>
      </div>

      <GalleryLightbox
        images={lightboxImages}
        currentImage={lightboxImage}
        onClose={() => setLightboxImage(null)}
        onSelect={setLightboxImage}
      />
    </div>
  );
}
