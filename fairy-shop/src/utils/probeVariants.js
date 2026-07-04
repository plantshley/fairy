import { getAssetPath } from './assetPath';

// Sequentially probes variant 1, 2, ... stopping at the first variant that has
// no image. `buildCandidates(n)` returns the ordered candidate paths for variant
// n (e.g. the same file as .png and .jpg); the first candidate that loads is the
// one used, so a product image can be saved with either extension. Resolves the
// ordered list of existing raw (public-relative) paths — possibly empty. This is
// how the grid auto-detects how many image variants a product has at runtime, so
// dropping a "<slug>-2.png" (or .jpg) into the folder "just works" with no code
// change.
//
// Returns a Promise with an `.abort()` method: calling it stops the chain from
// probing further variants (the caller should abort in its effect cleanup so an
// unmounted/replaced component doesn't keep firing image loads).
export function probeVariants(buildCandidates) {
  let aborted = false;
  const promise = new Promise((resolve) => {
    const found = [];

    // Try each candidate extension for variant n; resolve to the first that
    // loads, or null if none do.
    const tryCandidates = (candidates, i) =>
      new Promise((res) => {
        if (aborted || i >= candidates.length) {
          res(null);
          return;
        }
        const img = new Image();
        img.onload = () => res(candidates[i]);
        img.onerror = () => res(tryCandidates(candidates, i + 1));
        img.src = getAssetPath(candidates[i]);
      });

    const tryN = async (n) => {
      if (aborted) {
        resolve(found);
        return;
      }
      const candidates = buildCandidates(n);
      const hit = await Promise.resolve(tryCandidates(candidates, 0));
      if (aborted || !hit) {
        resolve(found);
        return;
      }
      found.push(hit);
      tryN(n + 1);
    };

    tryN(1);
  });
  promise.abort = () => {
    aborted = true;
  };
  return promise;
}
