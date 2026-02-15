import { useEffect, useRef, useState } from 'react';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';
import '@simonwep/pickr/dist/themes/classic.min.css';

export const ColorPicker = ({ color, onChange, onActivate, label }) => {
  const pickrRef = useRef(null);
  const buttonRef = useRef(null);
  const [pickrInstance, setPickrInstance] = useState(null);
  const onChangeRef = useRef(onChange);
  const onActivateRef = useRef(onActivate);

  // Keep refs up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onActivateRef.current = onActivate;
  }, [onActivate]);

  // Initialize Pickr only once
  useEffect(() => {
    if (!buttonRef.current || pickrInstance) return;

    // Delay initialization to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      if (!buttonRef.current || pickrInstance) return;

      try {
        const pickr = Pickr.create({
          el: buttonRef.current,
          theme: 'nano',
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
              hex: false,
              rgba: false,
              hsla: false,
              hsva: false,
              cmyk: false,
              input: false,
              clear: false,
              save: true,
            },
          },
        });

        // Update preview button color in real-time
        pickr.on('change', (color) => {
          // Update Pickr's button element directly
          const pickrButton = pickr.getRoot().button;
          if (pickrButton) {
            pickrButton.style.backgroundColor = color.toHEXA().toString();
          }
        });

        // Set initial color on button after Pickr is created
        setTimeout(() => {
          const pickrButton = pickr.getRoot().button;
          if (pickrButton) {
            pickrButton.style.backgroundColor = color || '#ff69b4';
          }
        }, 50);

        // Fire onActivate when picker is shown
        pickr.on('show', () => {
          if (onActivateRef.current) onActivateRef.current();
        });

        // Track if we already called onChange to prevent double-calling
        let colorChanged = false;

        // Call onChange when save button is clicked (nano theme)
        pickr.on('save', (color) => {
          if (color && onChangeRef.current) {
            onChangeRef.current(color.toHEXA().toString());
            colorChanged = true;
          }
          pickr.hide();
        });

        // Also call onChange when picker is hidden (only if not already called by save)
        pickr.on('hide', () => {
          const currentColor = pickr.getColor();
          if (currentColor && onChangeRef.current && !colorChanged) {
            onChangeRef.current(currentColor.toHEXA().toString());
          }
          // Reset flag for next time
          colorChanged = false;
        });

        // Handle swatch clicks
        pickr.on('swatchselect', (color) => {
          if (onChangeRef.current) {
            onChangeRef.current(color.toHEXA().toString());
            colorChanged = true;
          }
          pickr.hide();
        });

        pickrRef.current = pickr;
        setPickrInstance(pickr);
      } catch (error) {
        console.error('Error initializing Pickr:', error);
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (pickrRef.current) {
        try {
          pickrRef.current.destroyAndRemove();
        } catch (error) {
          console.error('Error destroying Pickr:', error);
        }
        pickrRef.current = null;
      }
    };
  }, []);

  // Update Pickr color when prop changes
  useEffect(() => {
    if (pickrInstance && color) {
      const currentColor = pickrInstance.getColor();
      if (!currentColor || currentColor.toHEXA().toString() !== color) {
        pickrInstance.setColor(color, true); // silent update

        // Also update the button background color
        const pickrButton = pickrInstance.getRoot().button;
        if (pickrButton) {
          pickrButton.style.backgroundColor = color;
        }
      }
    }
  }, [color, pickrInstance]);

  return (
    <div className="flex items-center gap-2">
      <button
        ref={buttonRef}
        type="button"
        className="w-6 h-6 border-2 border-gray-300"
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
