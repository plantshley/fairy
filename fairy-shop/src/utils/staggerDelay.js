// Longest a grid's entrance stagger may run, regardless of how many cells there
// are. Without a cap the delay grows without bound: the gallery's crochet
// category holds 183 images, which at 0.02s per cell would leave the last one
// starting 3.8s after mount. The cap keeps the sense of cells arriving in
// sequence while guaranteeing the grid settles quickly.
export const MAX_STAGGER = 0.3;

// Delay for one cell of a staggered grid. `base` offsets the whole grid so it
// lands after the blocks above it; `step` tunes the gap between cells — small
// for dense image grids, larger for a handful of cards.
export const staggerDelay = (index, base = 0, step = 0.02) =>
  base + Math.min(index * step, MAX_STAGGER);
