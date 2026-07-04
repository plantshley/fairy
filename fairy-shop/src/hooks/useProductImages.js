import { useEffect, useState } from 'react';
import { probeVariants } from '../utils/probeVariants';
import { productTransparent, productPhoto } from '../shopProducts';

// Resolves a product's images at runtime (see src/shopProducts.js for naming).
//   gridImages  — what the grid shows: transparents on standard themes
//                 (falling back to photos if the product has no transparent),
//                 photos on the pixel theme.
//   photoImages — always the photo set; used by the fullscreen lightbox on both
//                 themes (falls back to gridImages if there are no photos).
export function useProductImages(slug, pixel) {
  const [gridImages, setGridImages] = useState([]);
  const [photoImages, setPhotoImages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const photosProbe = probeVariants((n) => productPhoto(slug, n));
    let transparentsProbe;
    (async () => {
      const photos = await photosProbe;
      if (cancelled) return;
      setPhotoImages(photos);
      if (pixel) {
        setGridImages(photos);
        return;
      }
      transparentsProbe = probeVariants((n) => productTransparent(slug, n));
      const transparents = await transparentsProbe;
      if (cancelled) return;
      setGridImages(transparents.length ? transparents : photos);
    })();
    return () => {
      cancelled = true;
      photosProbe.abort();
      if (transparentsProbe) transparentsProbe.abort();
    };
  }, [slug, pixel]);

  return { gridImages, photoImages };
}

// Advances an index through `count` images on an interval, with a per-card
// stagger so a grid of cards doesn't crossfade in unison. Returns 0 (no timer)
// when there are fewer than 2 images.
export function useImageCycle(count, staggerIndex = 0, intervalMs = 3000) {
  const [index, setIndex] = useState(0);
  // Reset to the first image whenever the image count changes (set-state-during-
  // render is the idiomatic React way to adjust state on a changed input).
  const [prevCount, setPrevCount] = useState(count);
  if (count !== prevCount) {
    setPrevCount(count);
    setIndex(0);
  }

  useEffect(() => {
    if (count < 2) return undefined;
    let interval;
    const advance = () => setIndex((i) => (i + 1) % count);
    const timeout = setTimeout(() => {
      advance();
      interval = setInterval(advance, intervalMs);
    }, staggerIndex * 400);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [count, staggerIndex, intervalMs]);

  return count > 0 ? index % count : 0;
}
