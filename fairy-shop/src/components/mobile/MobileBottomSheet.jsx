import { motion, useAnimation, useDragControls } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Sheet state heights (in viewport height percentage)
const SHEET_HEIGHTS = {
  collapsed: 80, // 80px (drag handle + quick actions fully visible)
  half: 50, // 50vh
  full: 85, // 85vh
};

export const MobileBottomSheet = ({
  currentState = 'half',
  onStateChange,
  theme,
  children,
}) => {
  const controls = useAnimation();
  const dragControls = useDragControls();
  const sheetRef = useRef(null);

  // Calculate the Y position based on state
  const getYPosition = (state) => {
    switch (state) {
      case 'collapsed':
        return `calc(100vh - ${SHEET_HEIGHTS.collapsed}px)`;
      case 'half':
        return `${100 - SHEET_HEIGHTS.half}vh`;
      case 'full':
        return `${100 - SHEET_HEIGHTS.full}vh`;
      default:
        return `${100 - SHEET_HEIGHTS.half}vh`;
    }
  };

  // Move to current state instantly (no animation)
  useEffect(() => {
    controls.start({
      y: getYPosition(currentState),
      transition: {
        duration: 0,
      },
    });
  }, [currentState, controls]);

  // Handle drag end to determine new state
  const handleDragEnd = (event, info) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Fast swipe detection - lowered thresholds for easier gesture
    if (velocity > 250) {
      // Fast swipe down
      if (currentState === 'full') {
        onStateChange('half');
      } else if (currentState === 'half') {
        onStateChange('collapsed');
      }
      return;
    }

    if (velocity < -250) {
      // Fast swipe up
      if (currentState === 'collapsed') {
        onStateChange('half');
      } else if (currentState === 'half') {
        onStateChange('full');
      }
      return;
    }

    // Snap to nearest state based on position
    const windowHeight = window.innerHeight;
    const currentY = sheetRef.current?.getBoundingClientRect().top || 0;

    // Calculate thresholds - aligned with actual sheet heights
    const collapsedThreshold = windowHeight - (SHEET_HEIGHTS.collapsed + 30); // 90px from bottom
    const halfThreshold = windowHeight * 0.6;
    const fullThreshold = windowHeight * 0.4;

    if (currentY > collapsedThreshold) {
      onStateChange('collapsed');
    } else if (currentY > halfThreshold) {
      onStateChange('half');
    } else {
      onStateChange('full');
    }
  };

  // Cycle through all three states on handle tap
  const handleHandleTap = () => {
    if (currentState === 'collapsed') {
      onStateChange('half');
    } else if (currentState === 'half') {
      onStateChange('full');
    } else {
      onStateChange('collapsed');
    }
  };

  // Handle backdrop tap to collapse
  const handleBackdropClick = () => {
    if (currentState === 'full') {
      onStateChange('half');
    }
  };

  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';

  return (
    <>
      {/* Backdrop overlay - only blocks interaction in full mode */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-40"
        initial={{ opacity: 0 }}
        animate={{
          opacity: currentState === 'full' ? 0.4 : 0,
          pointerEvents: currentState === 'full' ? 'auto' : 'none',
        }}
        transition={{ duration: 0 }}
        onClick={handleBackdropClick}
        style={{ pointerEvents: currentState === 'full' ? 'auto' : 'none' }}
      />

      {/* Bottom Sheet */}
      <motion.div
        ref={sheetRef}
        className="fixed left-0 right-0 z-50 rounded-t-3xl shadow-2xl"
        style={{
          height: '100vh',
          backgroundColor: isDarkTheme ? 'rgba(42, 16, 53, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        initial={{ y: getYPosition(currentState) }}
        animate={controls}
        drag="y"
        dragControls={dragControls}
        dragConstraints={{
          top: window.innerHeight * 0.3,
          bottom: window.innerHeight - SHEET_HEIGHTS.collapsed,
        }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        dragListener={false}
      >
        {/* Drag Handle */}
        <motion.div
          className="flex justify-center pt-2 pb-3 cursor-grab active:cursor-grabbing relative"
          onPointerDown={(e) => dragControls.start(e)}
          onTap={handleHandleTap}
        >
          {/* Expand Up Button - Left Side */}
          <button
            className="absolute left-4 top-2 px-1.5 py-0.5 flex items-center justify-center rounded-full transition-all"
            style={{
              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: 'var(--text-secondary)',
              opacity: currentState === 'full' ? 0.3 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (currentState === 'collapsed') onStateChange('half');
              else if (currentState === 'half') onStateChange('full');
            }}
            disabled={currentState === 'full'}
            aria-label="Expand sheet upward"
          >
            <span className="text-[10px] font-mono font-semibold">▲</span>
          </button>

          {/* Collapse Down Button - Right Side */}
          <button
            className="absolute right-4 top-2 px-1.5 py-0.5 flex items-center justify-center rounded-full transition-all"
            style={{
              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: 'var(--text-secondary)',
              opacity: currentState === 'collapsed' ? 0.3 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (currentState === 'full') onStateChange('half');
              else if (currentState === 'half') onStateChange('collapsed');
            }}
            disabled={currentState === 'collapsed'}
            aria-label="Collapse sheet downward"
          >
            <span className="text-[10px] font-mono font-semibold">▼</span>
          </button>

          {/* Drag Handle Bar */}
          <div
            className="w-12 h-1.5 rounded-full"
            style={{
              backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            }}
          />
        </motion.div>

        {/* Sheet Content */}
        <div
          className="px-4 pb-4 overflow-hidden"
          style={{
            height: `calc(${SHEET_HEIGHTS.full}vh - 40px)`,
          }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
};
