import { useEffect, useRef, useState } from 'react';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';
import '@simonwep/pickr/dist/themes/classic.min.css';

export const ColorPicker = ({ color, onChange, label }) => {
  const pickrRef = useRef(null);
  const buttonRef = useRef(null);
  const [pickrInstance, setPickrInstance] = useState(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Initialize Pickr only once
  useEffect(() => {
    if (!buttonRef.current || pickrInstance) return;

    const pickrTheme = isMobile ? 'nano' : 'classic';

    const pickr = Pickr.create({
      el: buttonRef.current,
      theme: pickrTheme,
      default: color || '#ff69b4',
      swatches: [
        '#ff69b4', '#c5a3ff', '#89cff0', '#98fb98',
        '#ffb347', '#ff6b9d', '#ffffff', '#000000',
      ],
      components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
          hex: !isMobile,
          rgba: !isMobile,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: !isMobile,
          clear: false,
          save: isMobile,
        },
      },
    });

    // Only call onChange when user finishes interaction
    pickr.on('hide', () => {
      const currentColor = pickr.getColor();
      if (currentColor && onChange) {
        onChange(currentColor.toHEXA().toString());
      }
    });

    // Handle swatch clicks
    pickr.on('swatchselect', (color) => {
      if (onChange) {
        onChange(color.toHEXA().toString());
      }
      pickr.hide();
    });

    pickrRef.current = pickr;
    setPickrInstance(pickr);

    return () => {
      if (pickrRef.current) {
        pickrRef.current.destroyAndRemove();
      }
    };
  }, []);

  // Update Pickr color when prop changes
  useEffect(() => {
    if (pickrInstance && color) {
      const currentColor = pickrInstance.getColor();
      if (!currentColor || currentColor.toHEXA().toString() !== color) {
        pickrInstance.setColor(color, true); // silent update
      }
    }
  }, [color, pickrInstance]);

  return (
    <div className="flex items-center gap-2">
      <button
        ref={buttonRef}
        type="button"
        className="w-10 h-10 rounded border-2 border-gray-300"
        style={{ backgroundColor: color || '#ff69b4', cursor: 'pointer' }}
      />
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
    </div>
  );
};
