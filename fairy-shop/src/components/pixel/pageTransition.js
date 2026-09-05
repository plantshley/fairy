import { staggerDelay } from '../../utils/staggerDelay';

// Spread onto each pixel page's root <motion.div>. Deliberately identical to the
// values the standard-theme pages use (Home/Shop/Links), so switching tabs feels
// the same whichever theme is active instead of cutting instantly.
//
// Lives in its own module rather than PixelKit.jsx: mixing non-component exports
// into a file of components breaks React Fast Refresh.
export const pixelPageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

// Entrance for a block inside a pixel page. Mirrors what the standard-theme
// pages do to their own sections, so elements arrive in sequence instead of the
// whole page appearing at once. Pass a delay to order the blocks down the page.
export const pixelItem = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: 'easeOut' },
});

// Entrance for a page's hero/title. Scale-only, matching the standard pages'
// h1 treatment, so the title settles rather than sliding.
export const pixelTitle = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay, duration: 0.7, ease: 'easeOut' },
});

// Entrance for one cell of a grid. `index` staggers the cells, `base` offsets
// the whole grid so it lands after the blocks above it, and `step` tunes the
// gap between cells — small for dense image grids, larger for a handful of
// cards, the same way Gallery and LinkCard differ in the standard theme.
// The delay is capped (see staggerDelay) so large grids stay responsive.
export const pixelCell = (index, base = 0, step = 0.02) => ({
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: staggerDelay(index, base, step), duration: 0.4, ease: 'easeOut' },
});
