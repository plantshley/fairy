import { motion } from 'framer-motion';

export const BodyTypeTabContent = ({
  bodyTypes,
  selectedBody,
  bodySizeMultiplier,
  onBodySelect,
  onSizeChange,
  onHistorySave,
  theme,
}) => {
  const isDarkTheme = theme?.id === 'midnightVelvetMeadow';

  return (
    <div className="space-y-4">
      <h3
        className="font-bonbon tracking-wider text-lg font-bold text-center"
        style={{ color: 'var(--text-primary)' }}
      >
        Choose Your Body
      </h3>

      {/* Body Size Slider - always visible */}
      <div className="space-y-2 px-2" style={{ opacity: selectedBody ? 1 : 0.5 }}>
        <label
          className="text-sm font-medium block text-center"
          style={{ color: 'var(--text-secondary)' }}
        >
          Body Size: {Math.round((bodySizeMultiplier || 0.5) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={bodySizeMultiplier || 0.5}
          onMouseDown={selectedBody ? onHistorySave : undefined}
          onTouchStart={selectedBody ? onHistorySave : undefined}
          onChange={(e) => selectedBody && onSizeChange(parseFloat(e.target.value))}
          disabled={!selectedBody}
          className="w-full brush-slider"
          style={{
            '--slider-color': 'var(--accent-primary)',
          }}
        />
      </div>

      {/* Body Type Grid */}
      <div className="grid grid-cols-3 gap-1">
        {bodyTypes.map((body) => (
          <button
            key={body.id}
            className={`p-1 rounded-lg transition-all shadow-md aspect-square flex flex-col items-center justify-center ${
              selectedBody?.id === body.id
                ? 'ring-2 ring-offset-1 scale-105'
                : 'active:scale-95'
            }`}
            style={{
              '--tw-ring-color': theme?.colors?.accentPrimary || '#ff9dda',
              '--tw-ring-offset-color': isDarkTheme
                ? 'rgba(42, 16, 53, 1)'
                : 'rgba(255, 255, 255, 1)',
              backgroundColor: isDarkTheme
                ? 'rgba(42, 16, 53, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
            }}
            onClick={() => onBodySelect(body)}
          >
            <div className="text-2xl mb-0.5">{body.emoji}</div>
            <div
              className="text-[10px] font-semibold leading-tight text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              {body.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
