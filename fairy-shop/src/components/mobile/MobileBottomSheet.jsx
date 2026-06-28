import { motion, useMotionValue, useTransform, useDragControls, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useVisualViewport } from '../../hooks/useVisualViewport';

// Continuous (free-drag) bottom sheet. Rests at ANY height between a peek and
// near-full, and lightly snaps only when released near the top/bottom extremes.
// Sized from the VisualViewport so its content always clears iOS Safari's
// floating bottom toolbar — which env(safe-area-inset-bottom) does NOT cover.

const PEEK = 96; // px of sheet visible when collapsed (drag handle + quick actions)
const TOP_MARGIN = 16; // px gap left above the sheet when fully open
const SNAP_THRESHOLD = 56; // px from a bound within which a release snaps to it
const FLICK_VELOCITY = 600; // px/s flick that jumps to the nearer bound
const SNAP_TRANSITION = { type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] };

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const MobileBottomSheet = ({ theme, children }) => {
  const dragControls = useDragControls();
  const contentRef = useRef(null);

  const { height, offsetTop, layoutHeight } = useVisualViewport();
  const bottomOfVisible = offsetTop + height; // CSS px from layout-viewport top to just above the toolbar
  const minTop = TOP_MARGIN; // sheet pulled up the most
  const maxTop = Math.max(minTop, bottomOfVisible - PEEK); // only the peek showing

  // `y` is the sheet's top edge (translate, px). This initial value is only an
  // estimate; it's corrected to a true ~half-open position once the viewport is
  // measured in the effect below.
  const y = useMotionValue(clamp(bottomOfVisible - height * 0.5, minTop, maxTop));

  // Dim backdrop scales with how open the sheet is (purely visual — never blocks the canvas).
  // Range is built off a >=1 span so it stays strictly increasing on tiny viewports.
  const range = Math.max(1, maxTop - minTop);
  const backdropOpacity = useTransform(
    y,
    [minTop, minTop + range * 0.35, minTop + range],
    [0.35, 0, 0],
  );

  // Latest visible-area bottom (read by the imperative height updater so it never
  // goes stale), and whether the user has taken control of the sheet position yet.
  const bottomRef = useRef(bottomOfVisible);
  const userMovedRef = useRef(false);

  // Subscribe once: keep the content band as tall as the visible area above the
  // toolbar, updating live while dragging — imperative, so no React re-renders.
  useEffect(() => {
    const apply = () => {
      if (contentRef.current) {
        contentRef.current.style.height = `${Math.max(0, bottomRef.current - y.get())}px`;
      }
    };
    apply();
    return y.on('change', apply);
  }, [y]);

  // React to viewport changes (first measurement, rotation, address-bar / keyboard
  // show-hide): cache the new bottom, keep the sheet ~half open until the user takes
  // control, then only clamp into the new bounds. Finally re-fit the band height.
  useEffect(() => {
    bottomRef.current = bottomOfVisible;
    if (userMovedRef.current) {
      y.set(clamp(y.get(), minTop, maxTop));
    } else {
      y.set(clamp(bottomOfVisible - height * 0.5, minTop, maxTop));
    }
    if (contentRef.current) {
      contentRef.current.style.height = `${Math.max(0, bottomOfVisible - y.get())}px`;
    }
  }, [bottomOfVisible, height, minTop, maxTop, y]);

  const snapTo = (target) => {
    userMovedRef.current = true;
    return animate(y, target, SNAP_TRANSITION);
  };

  const handleDragEnd = (_event, info) => {
    userMovedRef.current = true;
    const current = y.get();
    const velocity = info.velocity.y;

    if (velocity < -FLICK_VELOCITY) return void snapTo(minTop); // flick up → open
    if (velocity > FLICK_VELOCITY) return void snapTo(maxTop); // flick down → peek
    if (current - minTop < SNAP_THRESHOLD) return void snapTo(minTop);
    if (maxTop - current < SNAP_THRESHOLD) return void snapTo(maxTop);
    // Otherwise: rest exactly where released.
  };

  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';
  const buttonBg = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <>
      {/* Dim backdrop (visual only) */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-40"
        style={{ opacity: backdropOpacity }}
      />

      {/* Bottom Sheet — full-height background (covers down past the toolbar so there's no gap) */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 rounded-t-3xl shadow-2xl"
        style={{
          y,
          height: layoutHeight,
          backgroundColor: isDarkTheme ? 'rgba(42, 16, 53, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: minTop, bottom: maxTop }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        {/* Interactive band — height tracks the visible area above the toolbar (set imperatively) */}
        <div
          ref={contentRef}
          className="flex flex-col overflow-hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Drag Handle (touch-action:none so the gesture isn't stolen by page scroll) */}
          <div
            className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing relative flex-shrink-0"
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => dragControls.start(e)}
          >
            {/* Expand button - left */}
            <button
              className="absolute left-4 top-2 px-1.5 py-0.5 flex items-center justify-center rounded-full transition-all"
              style={{ backgroundColor: buttonBg, color: 'var(--text-secondary)' }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                snapTo(minTop);
              }}
              aria-label="Expand control panel"
            >
              <span className="text-[10px] font-mono font-semibold">▲</span>
            </button>

            {/* Collapse button - right */}
            <button
              className="absolute right-4 top-2 px-1.5 py-0.5 flex items-center justify-center rounded-full transition-all"
              style={{ backgroundColor: buttonBg, color: 'var(--text-secondary)' }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                snapTo(maxTop);
              }}
              aria-label="Collapse control panel"
            >
              <span className="text-[10px] font-mono font-semibold">▼</span>
            </button>

            {/* Drag handle bar */}
            <div
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' }}
            />
          </div>

          {/* Content (header rows + flex-1 scroll area, provided by the parent) */}
          <div className="flex-1 min-h-0 flex flex-col px-4 pb-4">{children}</div>
        </div>
      </motion.div>
    </>
  );
};
