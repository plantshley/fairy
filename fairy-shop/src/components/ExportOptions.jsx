import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const OPTIONS = [
  { id: 'transparent', label: 'Transparent' },
  { id: 'white', label: 'White background' },
  { id: 'black', label: 'Black background' },
];

// Checkerboard swatch for "transparent", solid swatches otherwise.
const swatchStyle = (id) => {
  if (id === 'transparent') {
    return {
      backgroundColor: '#ffffff',
      backgroundImage:
        'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
      backgroundSize: '8px 8px',
      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
    };
  }
  return { backgroundColor: id === 'black' ? '#000000' : '#ffffff' };
};

const OptionButtons = ({ onExport }) => (
  <div className="space-y-1.5">
    {OPTIONS.map((opt) => (
      <button
        key={opt.id}
        className="w-full py-1.5 px-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] flex items-center gap-2"
        style={{ background: 'var(--bg-gradient-start)', color: 'var(--text-primary)' }}
        onClick={() => onExport(opt.id)}
      >
        <span
          aria-hidden="true"
          className="w-4 h-4 rounded border shrink-0"
          style={{ ...swatchStyle(opt.id), borderColor: 'rgba(0, 0, 0, 0.25)' }}
        />
        {opt.label}
      </button>
    ))}
  </div>
);

// Background choices for the PNG export. `inline` renders under the desktop
// Export button; `modal` is the mobile popup opened from the quick actions.
export const ExportOptions = ({ onExport, onClose, variant = 'inline', theme }) => {
  if (variant === 'inline') return <OptionButtons onExport={onExport} />;
  return <ExportModal onExport={onExport} onClose={onClose} theme={theme} />;
};

// Portaled to <body> so it stacks above the fixed nav and theme buttons.
const ExportModal = ({ onExport, onClose, theme }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Export image"
        className="w-full max-w-xs rounded-2xl p-4 shadow-2xl"
        style={{ backgroundColor: isDarkTheme ? 'rgba(42, 16, 53, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium mb-3 text-center" style={{ color: 'var(--text-primary)' }}>
          Export image
        </p>
        <OptionButtons onExport={onExport} />
        <button
          className="mt-3 w-full py-1.5 text-xs"
          style={{ color: 'var(--text-secondary)' }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </motion.div>,
    document.body
  );
};
