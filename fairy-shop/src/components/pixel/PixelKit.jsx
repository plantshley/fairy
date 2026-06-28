// Pixel/Y2K UI kit — ported from the design project's ui-kit.jsx to real
// React 19 components. The mockup's A() asset helper is replaced with
// getAssetPath('/pixel/...') so paths survive the GitHub-Pages base path.
// Purely-decorative animated GIFs carry the `pixel-deco` class so the
// high-contrast / reduce-motion a11y toggles can drop them (see pixel.css).
import { px } from './asset';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';

// ---------------------------------------------------------------
//  Pixel window
// ---------------------------------------------------------------
export function PxWindow({
  title,
  children,
  border = 'var(--d-plum)',
  bg = '#fff',
  bar,
  barFg = '#fff',
  shadow = 'rgba(90,31,107,0.25)',
  close = true,
  style,
  bodyStyle,
  className = '',
}) {
  return (
    <div
      className={`pxwin ${className}`}
      style={{
        '--pxwin-border': border,
        '--pxwin-bg': bg,
        '--pxwin-bar': bar || border,
        '--pxwin-bar-fg': barFg,
        '--pxwin-shadow': shadow,
        background: bg,
        ...style,
      }}
    >
      {title && (
        <div className="pxwin__bar">
          <span>{title}</span>
          {close ? (
            <span className="pxwin__bar-x">×</span>
          ) : (
            <span className="pxwin__bar-dots"><span /><span /><span /></span>
          )}
        </div>
      )}
      <div className="pxwin__body" style={bodyStyle}>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------
//  Pixel button
// ---------------------------------------------------------------
export function PxButton({ children, bg, fg, border, style, onClick, wide, type = 'button', title }) {
  return (
    <button
      type={type}
      title={title}
      className={`pxbtn ${wide ? 'pxbtn--wide' : ''}`}
      style={{ '--btn-bg': bg, '--btn-fg': fg, '--btn-border': border, ...style }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------
//  Blinkie (88×31) — decorative web badge
// ---------------------------------------------------------------
export function Blinkie({ variant = 1, blink, rainbow, children }) {
  return (
    <span className={`blinkie pixel-deco blinkie--${variant} ${blink ? 'blinkie--blink' : ''} ${rainbow ? 'blinkie--rainbow' : ''}`}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------
//  Divider — repeating GIF strip (decorative)
// ---------------------------------------------------------------
export function Divider({ src, height = 12, opacity = 1, style }) {
  return (
    <div
      className="pixel-img pixel-deco"
      style={{
        height,
        backgroundImage: `url(${px('dividers/' + src)})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center',
        opacity,
        ...style,
      }}
    />
  );
}

// ---------------------------------------------------------------
//  Sprite — anchored decorative GIF
// ---------------------------------------------------------------
export function Sprite({ src, w, h, style, className = '', folder = 'icons' }) {
  return (
    <img
      src={px(`${folder}/${src}`)}
      className={`pixel-img pixel-deco ${className}`}
      style={{ width: w, height: h, ...style }}
      alt=""
    />
  );
}

// ---------------------------------------------------------------
//  Asset slot (placeholder for a user-supplied sprite/photo)
// ---------------------------------------------------------------
export function Slot({ label, w, h, bg, fg, style }) {
  return (
    <div
      className="asset-slot pixel-img"
      style={{ width: w, height: h, '--slot-bg': bg, '--slot-fg': fg, ...style }}
    >
      {label}
    </div>
  );
}

// ---------------------------------------------------------------
//  Marquee strip (content duplicated for a seamless loop)
// ---------------------------------------------------------------
export function Marquee({ children, speed = 40, style, className = '' }) {
  return (
    <div className={`marquee ${className}`} style={style}>
      <div className="marquee__inner" style={{ animationDuration: speed + 's' }}>
        {children}
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
//  Theme chip — mini swatch button
// ---------------------------------------------------------------
export function ThemeChip({ active, label, swatch, onClick, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-pixel"
      style={{
        background: '#fff',
        padding: '6px 10px 6px 6px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 10,
        color: accent,
        cursor: 'pointer',
        border: 'none',
        boxShadow: active
          ? `inset 0 0 0 2px ${accent}, 3px 3px 0 0 ${accent}`
          : `inset 0 0 0 2px ${accent}`,
        textTransform: 'lowercase',
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ display: 'inline-flex', gap: 0 }}>
        {swatch.map((c, i) => (
          <span key={i} style={{ width: 10, height: 14, background: c, display: 'inline-block' }} />
        ))}
      </span>
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------
//  Pegasus sprite (CSS pixel-cell mascot — no GIF, kept as content)
// ---------------------------------------------------------------
const PEGASUS_GRID = [
  '..............G...',
  '.............GG...',
  '............GG.M..',
  '...........BB.MM..',
  '..........BBBBM.M.',
  '..MM.....BBBBBME..',
  '.MMMMM..BBBBBBBC.B',
  '.MMMMMMWWBBBBBBB..',
  '..MMMWWWWWBBBBBB..',
  '....WWwwwBBBBBBB..',
  '.....BBBBBBBBBBB..',
  '.....B..BB..B..B..',
  '.....H..HH..H..H..',
  '.....H..HH..H..H..',
];
export function PegasusSprite({
  scale = 5,
  body = 'var(--b-cream)',
  mane = 'var(--d-pink-3)',
  wing = 'var(--b-cyan-soft)',
  wingShade = 'var(--b-cyan)',
  hoof = 'var(--d-plum)',
  horn = 'var(--b-yellow)',
  eye = 'var(--d-plum)',
  cheek = 'var(--d-pink-3)',
}) {
  const map = { B: body, M: mane, W: wing, w: wingShade, H: hoof, G: horn, E: eye, C: cheek };
  return (
    <div className="pixel-img" style={{ position: 'relative', width: 18 * scale, height: 14 * scale, flexShrink: 0 }} aria-hidden="true">
      {PEGASUS_GRID.map((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : (
            <div
              key={`${x}-${y}`}
              style={{ position: 'absolute', left: x * scale, top: y * scale, width: scale, height: scale, background: map[ch] }}
            />
          )
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------
//  Music player widget (decorative; kept as content)
// ---------------------------------------------------------------
export function MusicPlayer({
  accent = 'var(--d-plum)',
  border,
  bar,
  barFg = '#fff',
  bg = '#fff',
  width = '100%',
  track = 'lapis tower',
  artist = 'oasis fm',
}) {
  const { playing, toggle } = useBackgroundMusic();
  return (
    <PxWindow title="♪ now playing" border={border || accent} bar={bar || border || accent} barFg={barFg} bg={bg} close={false} style={{ width }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, background: accent, display: 'grid', placeItems: 'center' }}>
            <span className="font-pixel" style={{ color: '#fff', fontSize: 18 }}>♪</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-pixel" style={{ fontSize: 10, color: accent, lineHeight: 1.3 }}>{track}</div>
            <div className="font-pixel" style={{ fontSize: 8, color: accent, opacity: 0.65 }}>{artist}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={toggle}
            className="font-pixel"
            title={playing ? 'pause' : 'play'}
            aria-label={playing ? 'Pause music' : 'Play music'}
            style={{ width: 22, height: 22, fontSize: 9, background: accent, color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.08)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, width: playing ? '100%' : '0%', background: accent, transition: 'width 0.4s linear', backgroundImage: 'linear-gradient(90deg, var(--b-hotpink), var(--b-cyan), var(--b-yellow))', backgroundSize: '200% 100%', animation: playing ? 'holo-shift 3s linear infinite' : 'none' }} />
          </div>
          <span className="font-pixel" style={{ fontSize: 8, color: accent }}>{playing ? '♪♪♪' : '──'}</span>
        </div>
      </div>
    </PxWindow>
  );
}

// ---------------------------------------------------------------
//  NavBar — pixel site nav, wired to the router + accessibility menu
// ---------------------------------------------------------------
const NAV_PALETTE = [
  { bg: 'var(--d-pink-3)', fg: 'var(--d-plum)' },
  { bg: 'var(--b-yellow)', fg: 'var(--d-plum)' },
  { bg: 'var(--b-cyan)', fg: 'var(--d-plum)' },
  { bg: 'var(--d-lilac-2)', fg: 'var(--d-plum)' },
  { bg: '#ff4dff', fg: 'var(--d-plum)' },
];
const NAV_LINKS = ['home', 'shop', 'links', 'gallery', 'build'];

export function NavBar({ accent = 'var(--d-plum)', active = 'home', onTabChange, onOpenAccessibility }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <PegasusSprite scale={3} />
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {NAV_LINKS.map((l, i) => {
          const swatch = NAV_PALETTE[i % NAV_PALETTE.length];
          const isActive = active === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => onTabChange?.(l)}
              className="font-pixel nav-btn"
              style={{
                fontSize: 11,
                padding: '6px 10px',
                background: swatch.bg,
                color: swatch.fg,
                border: 'none',
                cursor: 'pointer',
                boxShadow: isActive ? `inset 0 0 0 2px ${accent}, 2px 2px 0 0 ${accent}` : `inset 0 0 0 2px ${accent}`,
                letterSpacing: '0.04em',
                fontWeight: isActive ? 700 : 400,
                transform: isActive ? 'translate(-1px, -1px)' : 'none',
                textTransform: 'lowercase',
              }}
            >
              {l}
            </button>
          );
        })}
        <button
          type="button"
          title="accessibility settings"
          aria-label="Open accessibility settings"
          onClick={onOpenAccessibility}
          className="font-pixel"
          style={{
            fontSize: 12,
            width: 28,
            height: 28,
            background: '#fff',
            color: accent,
            border: 'none',
            cursor: 'pointer',
            boxShadow: `inset 0 0 0 2px ${accent}`,
            display: 'grid',
            placeItems: 'center',
            marginLeft: 4,
          }}
        >
          ♿
        </button>
      </div>
    </div>
  );
}
