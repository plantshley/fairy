// Shared fullscreen image lightbox (scroll-to-zoom, drag-to-pan, prev/next).
// Used by both the standard Gallery page and the pixel-theme PixelGallery so the
// viewer behaves identically. The parent owns which image is open; this owns the
// transient zoom/pan state and the body-scroll lock.
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAssetPath } from '../utils/assetPath';

export function GalleryLightbox({ images, currentImage, onClose, onSelect }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const currentIndex = currentImage ? images.indexOf(currentImage) : -1;

  // Reset zoom/pan whenever the displayed image changes.
  useEffect(() => {
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  }, [currentImage]);

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = currentImage ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [currentImage]);

  const close = () => {
    onClose();
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  };

  return (
    <AnimatePresence>
      {currentImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
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
              close();
            }}
          >
            ×
          </motion.button>

          {/* Zoom indicator */}
          {zoomLevel > 1 && (
            <motion.div
              className="absolute top-4 left-4 text-white text-sm font-bonbon tracking-wider px-3 py-2 rounded-full pointer-events-none"
              style={{ background: 'rgba(255, 255, 255, 0.1)', zIndex: 100 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Math.round(zoomLevel * 100)}%
            </motion.div>
          )}

          {/* Previous */}
          {currentIndex > 0 && (
            <motion.button
              className="absolute left-4 text-white text-4xl font-bold hover:opacity-70"
              style={{ zIndex: 100 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(images[currentIndex - 1]);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </motion.button>
          )}

          {/* Next */}
          {currentIndex < images.length - 1 && (
            <motion.button
              className="absolute right-4 text-white text-4xl font-bold hover:opacity-70"
              style={{ zIndex: 100 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(images[currentIndex + 1]);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              →
            </motion.button>
          )}

          <motion.img
            src={getAssetPath(`/${currentImage.replace(/ /g, '%20')}`)}
            alt="Selected gallery image"
            className="max-w-full max-h-full object-contain select-none"
            style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 0.8 * zoomLevel, x: dragPosition.x, y: dragPosition.y }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            drag={zoomLevel > 1}
            dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
            dragElastic={0.05}
            onDragEnd={(_e, info) => {
              setDragPosition((prev) => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }));
            }}
            whileDrag={{ cursor: 'grabbing' }}
          />

          {/* Hint */}
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
  );
}
