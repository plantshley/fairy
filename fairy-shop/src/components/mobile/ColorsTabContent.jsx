import { ColorPicker } from '../ColorPicker';

export const ColorsTabContent = ({
  selectedBody,
  selectedId,
  placedObjects,
  currentColor,
  onBodyColorChange,
  onBodyOutlineColorChange,
  onObjectColorChange,
  onDrawingColorChange,
  onHistorySave,
  theme,
}) => {
  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';
  const hasBody = !!selectedBody;
  const hasSelectedObject = !!selectedId;

  // Get selected object's current colors
  const selectedObject = placedObjects?.find((obj) => obj.id === selectedId);

  const colorRowStyle = {
    backgroundColor: isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  };

  const disabledStyle = {
    opacity: 0.4,
    pointerEvents: 'none',
  };

  return (
    <div className="pb-4">
      <h3
        className="font-bonbon tracking-wider text-lg font-bold text-center mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Colors
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {/* Body Color */}
        <div
          className="p-2 rounded-xl"
          style={{
            ...colorRowStyle,
            ...(hasBody ? {} : disabledStyle),
          }}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
              Body Color
            </span>
            <ColorPicker
              color={selectedBody?.color || '#ff69b4'}
              onChange={onBodyColorChange}
            />
          </div>
          {!hasBody && (
            <p className="text-[10px] mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>
              Select a body type first
            </p>
          )}
        </div>

        {/* Body Outline Color */}
        <div
          className="p-2 rounded-xl"
          style={{
            ...colorRowStyle,
            ...(hasBody ? {} : disabledStyle),
          }}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
              Body Outline
            </span>
            <ColorPicker
              color={selectedBody?.outlineColor || '#000000'}
              onChange={onBodyOutlineColorChange}
            />
          </div>
          {!hasBody && (
            <p className="text-[10px] mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>
              Select a body type first
            </p>
          )}
        </div>

        {/* Object & Drawing Color - Combined */}
        <div className="p-2 rounded-xl" style={colorRowStyle}>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
              Object & Drawing
            </span>
            <ColorPicker
              color={selectedObject?.color || currentColor}
              onChange={(newColor) => {
                onDrawingColorChange(newColor);
                if (selectedObject) {
                  onHistorySave?.();
                  onObjectColorChange?.(newColor);
                }
              }}
            />
          </div>
        </div>

        {/* Object Outline Color */}
        <div
          className="p-2 rounded-xl"
          style={{
            ...colorRowStyle,
            ...(hasSelectedObject ? {} : disabledStyle),
          }}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
              Object Outline
            </span>
            <ColorPicker
              color={selectedObject?.outlineColor || '#000000'}
              onChange={(newColor) => {
                onHistorySave?.();
                onObjectColorChange?.(newColor, true); // true = outline
              }}
            />
          </div>
          {!hasSelectedObject && (
            <p className="text-[10px] mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>
              Select an object on canvas
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
