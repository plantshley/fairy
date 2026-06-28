import { useState, useEffect } from 'react';

// Reads the *visible* viewport band — the area between the top browser chrome and
// the floating bottom toolbar — via the VisualViewport API. This is the only
// reliable way to keep fixed UI (e.g. the build bottom sheet) above iOS Safari's
// floating toolbar, which is NOT covered by env(safe-area-inset-bottom).
//
// Returns CSS-pixel values:
//   height       — visible viewport height (excludes top chrome + bottom toolbar)
//   offsetTop    — distance from the layout-viewport top to the visible band's top
//   layoutHeight — full layout-viewport height (used to extend backgrounds to the
//                  very bottom of the screen so there's no gap behind the toolbar)
const readViewport = () => {
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  const layoutHeight =
    (typeof document !== 'undefined' && document.documentElement?.clientHeight) ||
    (typeof window !== 'undefined' ? window.innerHeight : 0);

  if (!vv) {
    return { height: layoutHeight, offsetTop: 0, layoutHeight };
  }
  return { height: vv.height, offsetTop: vv.offsetTop, layoutHeight };
};

export const useVisualViewport = () => {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    const vv = window.visualViewport;
    const update = () => setViewport(readViewport());

    // Run once after mount in case the API reported stale values during SSR/initial render.
    update();

    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return viewport;
};
