import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle } from '../components/Sparkle';
import { useState, useEffect, useMemo } from 'react';
import { Particles, initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import galleryManifest from '../galleryManifest.json';

const categories = [
  {
    id: 'crochet',
    name: 'crochet',
    key: 'crochet',
    description: 'handmade creaturely companions',
  },
  {
    id: 'digital',
    name: 'digital works',
    key: 'digital works',
    description: 'digital illustrations, logos, & stickers',
  },
  {
    id: 'traditional',
    name: 'traditional works',
    key: 'traditional works',
    description: 'colored pencil, graphite, & painted art',
  },
  {
    id: 'cards',
    name: 'cards & sketches',
    key: 'cards-and-sketches',
    description: 'a peek into my sketchbook & hand-painted cards',
  },
  {
    id: 'plantshley',
    name: 'plantshley books',
    key: 'plantshley books',
    description: 'illustrations from my childrens book series',
  },
];

const CategoryBox = ({ category, isHovered, currentTheme, onMouseEnter, onMouseLeave, onClick }) => {
  const [particleState, setParticlesReady] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const images = galleryManifest[category.key] || [];
  // Look for a file named "preview" (with any extension) first, otherwise use first image
  const previewImage = images.find(img => img.toLowerCase().includes('/preview.')) || images[0] || '';

  console.log(`[${category.name}] Key: "${category.key}", Images found: ${images.length}, Preview: ${previewImage}`);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Delay particle rendering until after expansion animation
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => setShowParticles(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowParticles(false);
    }
  }, [isHovered]);

  // Preload image
  useEffect(() => {
    if (previewImage) {
      console.log(`[${category.name}] Attempting to load:`, previewImage);
      // Only encode spaces in the path, leave other special characters
      const fullPath = `/${previewImage.replace(/ /g, '%20')}`;

      // Directly set the image URL
      setImageUrl(fullPath);

      // Still preload to catch errors
      const img = new Image();
      img.onload = () => {
        console.log(`[${category.name}] Successfully loaded:`, fullPath);
      };
      img.onerror = (e) => {
        console.error(`[${category.name}] Failed to load:`, fullPath, e);
        setImageUrl(null);
      };
      img.src = fullPath;
    }
  }, [previewImage, category.name]);

  // Initialize particles once, not on every hover
  useEffect(() => {
    const particleThemes = ['twinkleFairyDream', 'celestialAngelicClouds', 'crystalSeasideGarden', 'midnightVelvetMeadow'];
    if (!particleThemes.includes(currentTheme?.id)) return;

    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, [currentTheme?.id]);

  const particleOptions = useMemo(() => ({
    key: `star-${category.id}`,
    name: "Star",
    particles: {
      number: {
        value: 30,
        density: { enable: false },
      },
      color: {
        value: [
          currentTheme?.colors.bgGradientStart,
          currentTheme?.colors.bgGradientMid,
          currentTheme?.colors.bgGradientEnd,
          currentTheme?.colors.accentPrimary,
          currentTheme?.colors.accentSecondary,
        ],
      },
      shape: {
        type: "star",
        options: { star: { sides: 4 } },
      },
      opacity: { value: 0.9 },
      size: { value: { min: 2, max: 5 } },
      rotate: {
        value: { min: 0, max: 360 },
        enable: true,
        direction: "clockwise",
        animation: { enable: true, speed: 10, sync: false },
      },
      links: { enable: false },
      reduceDuplicates: true,
      move: {
        enable: true,
        center: { x: 50, y: 50 },
      },
    },
    interactivity: { events: {} },
    smooth: true,
    fpsLimit: 120,
    background: { color: "transparent", size: "cover" },
    fullScreen: { enable: false },
    detectRetina: true,
    absorbers: [
      {
        enable: true,
        opacity: 0,
        size: { value: 1, density: 1, limit: { radius: 5, mass: 5 } },
        position: { x: 50, y: 50 },
      },
    ],
    emitters: [
      {
        autoPlay: true,
        fill: true,
        life: { wait: true },
        rate: { quantity: 8, delay: 0.4 },
        position: { x: 50, y: 50 },
      },
    ],
  }), [category.id, currentTheme]);

  const modifiedOptions = useMemo(() => {
    return { ...particleOptions, autoPlay: isHovered };
  }, [isHovered, particleOptions]);

  const getClassName = () => {
    const baseClass = 'relative';
    if (currentTheme?.id === 'glitterGroovyRainbow') {
      return `${baseClass} rainbow-glow-card`;
    }
    return baseClass;
  };

  const shouldShowParticles = ['twinkleFairyDream', 'celestialAngelicClouds', 'crystalSeasideGarden', 'midnightVelvetMeadow'].includes(currentTheme?.id);

  return (
    <div
      className={getClassName()}
      style={{
        flex: isHovered ? (isMobile ? '2' : '3') : '0.5',
        height: isMobile ? '250px' : '500px',
        minHeight: isMobile ? '250px' : '500px',
        minWidth: isMobile ? '80px' : 'auto',
        transition: 'flex 0.5s ease',
        position: 'relative',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Particles effect - positioned above and around the card */}
      {shouldShowParticles && particleState && showParticles && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            zIndex: 30,
          }}
        >
          <Particles
            id={`gallery-particles-${category.id}`}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
            particlesLoaded={async () => {
              setParticlesReady("ready");
            }}
            options={modifiedOptions}
          />
        </div>
      )}

      <div
        className="rounded-3xl overflow-hidden shadow-2xl cursor-pointer relative"
        style={{
          width: '100%',
          height: '100%',
          border: `3px solid ${isHovered ? 'var(--accent-primary)' : 'transparent'}`,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Background image layer */}
        {imageUrl && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        {/* Fallback background for missing images */}
        {!imageUrl && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            }}
          />
        )}

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isHovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Category info */}
        <div
          className={`absolute left-0 right-0 p-2 sm:p-4 md:p-6 text-white transition-all duration-500 ${isMobile ? 'top-1/2 -translate-y-1/2' : 'bottom-0'}`}
          style={{
            opacity: isHovered ? 1 : 0.9,
            transform: isHovered && !isMobile ? 'translateY(0)' : !isMobile ? 'translateY(10px)' : undefined,
          }}
        >
          <h2 className={`font-bonbon tracking-wider text-xs sm:text-lg md:text-2xl mb-0.5 sm:mb-1 px-1 ${isMobile ? 'text-left break-words' : 'text-center'}`}>{category.name}</h2>
          {isHovered && !isMobile && (
            <p className="text-center text-xs sm:text-sm opacity-90 font-jetbrains transition-opacity duration-300">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const Gallery = ({ currentTheme }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const getCategoryImages = (key) => {
    // Images are already sorted by modification date in the manifest (preview first, then newest to oldest)
    return galleryManifest[key] || [];
  };

  // Reset zoom when image changes
  useEffect(() => {
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  }, [selectedImage]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (selectedCategory) {
    const images = getCategoryImages(selectedCategory.key);
    const currentIndex = selectedImage ? images.indexOf(selectedImage) : -1;

    return (
      <motion.div
        className="w-full h-full flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with back button */}
        <div className="w-full max-w-7xl mb-4 sm:mb-6 flex items-center justify-between px-2 sm:px-0">
          <motion.button
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bonbon tracking-wider text-sm sm:text-lg"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: 'white',
            }}
            onClick={() => setSelectedCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← back
          </motion.button>

          <motion.h1
            className="font-kalnia text-lg sm:text-2xl md:text-3xl gradient-text text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {selectedCategory.name}
          </motion.h1>

          <div className="w-16 sm:w-24" /> {/* Spacer for centering */}
        </div>

        {/* Category navigation tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap justify-center px-2 sm:px-0">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bonbon tracking-wider text-xs sm:text-sm"
              style={{
                background: selectedCategory.id === cat.id
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  : currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                color: selectedCategory.id === cat.id ? 'white' : 'var(--text-primary)',
              }}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedImage(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Image grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 w-full max-w-7xl px-2 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {images.map((imagePath, index) => {
            // Only encode spaces in the path, leave other special characters
            const encodedSrc = `/${imagePath.replace(/ /g, '%20')}`;
            return (
              <motion.div
                key={imagePath}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xl"
                style={{
                  backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(imagePath)}
              >
                <img
                  src={encodedSrc}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error(`Failed to load image: ${imagePath}`, `Encoded: ${encodedSrc}`);
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Lightbox for selected image */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedImage(null);
                setZoomLevel(1);
                setDragPosition({ x: 0, y: 0 });
              }}
              onWheel={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const delta = e.deltaY * -0.001;
                setZoomLevel((prev) => Math.max(1, Math.min(5, prev + delta)));
              }}
            >
              <motion.button
                className="absolute top-4 right-4 text-white text-4xl font-bold hover:opacity-70"
                style={{ zIndex: 100 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                  setZoomLevel(1);
                  setDragPosition({ x: 0, y: 0 });
                }}
              >
                ×
              </motion.button>

              {/* Zoom indicator */}
              {zoomLevel > 1 && (
                <motion.div
                  className="absolute top-4 left-4 text-white text-sm font-bonbon tracking-wider px-3 py-2 rounded-full pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {Math.round(zoomLevel * 100)}%
                </motion.div>
              )}

              {/* Previous button */}
              {currentIndex > 0 && (
                <motion.button
                  className="absolute left-4 text-white text-4xl font-bold hover:opacity-70"
                  style={{ zIndex: 100 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(images[currentIndex - 1]);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ←
                </motion.button>
              )}

              {/* Next button */}
              {currentIndex < images.length - 1 && (
                <motion.button
                  className="absolute right-4 text-white text-4xl font-bold hover:opacity-70"
                  style={{ zIndex: 100 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(images[currentIndex + 1]);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  →
                </motion.button>
              )}

              <motion.img
                src={`/${selectedImage.replace(/ /g, '%20')}`}
                alt="Selected gallery image"
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  cursor: zoomLevel > 1 ? 'grab' : 'default',
                }}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: 0.8 * zoomLevel,
                  x: dragPosition.x,
                  y: dragPosition.y,
                }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                drag={zoomLevel > 1}
                dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                dragElastic={0.05}
                onDragEnd={(_e, info) => {
                  setDragPosition({
                    x: dragPosition.x + info.offset.x,
                    y: dragPosition.y + info.offset.y,
                  });
                }}
                whileDrag={{ cursor: 'grabbing' }}
              />

              {/* Instructions hint */}
              <motion.p
                className="absolute bottom-4 text-white text-xs font-bonbon tracking-wider opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
              >
                scroll to zoom • drag to pan
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-2xl sm:text-3xl md:text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ₊˚⊹♡ gallery ♡⊹˚₊
      </motion.h1>

      <p className="text-center mb-8 text-base sm:text-lg md:text-xl font-bonbon tracking-wider px-4" style={{ color: 'var(--text-primary)' }}>
        ⊹ creations & artwork ⊹
      </p>

      {/* Expandable category boxes */}
      <div
        className="flex flex-row gap-2 sm:gap-4 w-full max-w-6xl items-stretch pb-4 pt-8 overflow-x-auto sm:overflow-x-visible"
        style={{
          overflowY: 'visible'
        }}
      >
        {categories.map((category) => (
          <CategoryBox
            key={category.id}
            category={category}
            isHovered={hoveredCategory === category.id}
            currentTheme={currentTheme}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      <motion.p
        className="mt-8 text-xs sm:text-sm px-4 text-center"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="hidden sm:inline">⋆｡°✩ hover to preview, click to explore ✩°｡⋆</span>
        <span className="sm:hidden">⋆｡°✩ tap to explore ✩°｡⋆</span>
      </motion.p>
    </motion.div>
  );
};
