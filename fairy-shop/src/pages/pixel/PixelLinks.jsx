// Pixel-theme Links page. Reuses the shared links list (src/linksData.js) so it
// stays in sync with the standard Links page; only the chrome differs.
import { motion } from 'framer-motion';
import { NavBar, Divider } from '../../components/pixel/PixelKit';
import { pixelPageTransition, pixelItem, pixelTitle, pixelCell } from '../../components/pixel/pageTransition';
import { px } from '../../components/pixel/asset';
import { links } from '../../linksData';
// Side-effect import: registers the <pixel-canvas> web component (hover shimmer).
import '../../components/pixel/pixelCanvas';

const ACCENT = 'var(--d-plum)';

// Warm palette (oranges / yellows / warm purples / pinks — no blues), cycled
// across the cards so brand-blue links (Venmo, PayPal, Behance) read warm here.
const WARM = [
  { bar: '#ff4545', tile: '#ff6966' },
  { bar: '#ff8afd', tile: '#f0c8eb' },
  { bar: '#ffd166', tile: '#fff0b3' },
  { bar: '#ff85c8', tile: '#ffd1ec' },
  { bar: '#ffb347', tile: '#ffc9a3' },
  { bar: '#e8a390', tile: '#d8b8f0' },
];
// pixel-canvas shimmer colors — warm sparks.
const SHIMMER = '#ff9f45,#ffd166,#ff85c8,#c08aff,#ffe85c';

export function PixelLinks({ activeTab, onTabChange, onOpenAccessibility }) {
  return (
    <motion.div
      className="pixel-scene relative w-full min-h-dvh overflow-hidden"
      {...pixelPageTransition}
      style={{
        backgroundImage: `url(${px('scenes/scene-links.gif')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        imageRendering: 'pixelated',
      }}
    >
      {/* soft warm wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(255,209,102,0.30), rgba(216,184,240,0.30))', mixBlendMode: 'screen' }}
      />

      <div className="relative z-[2] px-4 py-6 sm:px-10 lg:px-20">
        <NavBar accent={ACCENT} active={activeTab} onTabChange={onTabChange} onOpenAccessibility={onOpenAccessibility} />

        <motion.div className="text-center my-6" {...pixelTitle(0.05)}>
          <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-5">
            <img src={px('icons/strawberry-flowers.gif')} alt="" className="pixel-img pixel-deco w-9 sm:w-12 flex-shrink-0" />
            <div className="deco-title deco-title--d deco-title--d-yellow font-rainy whitespace-nowrap" style={{ fontSize: 'clamp(26px, 8vw, 80px)' }}>
              ✦ links ✦
            </div>
            <img src={px('icons/strawberry-flowers.gif')} alt="" className="pixel-img pixel-deco w-9 sm:w-12 flex-shrink-0" />
          </div>
        </motion.div>

        <motion.div {...pixelItem(0.12)}>
          <Divider src="hibiscus.gif" height={40} style={{ margin: '0 0 18px' }} />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-5 sm:gap-6 max-w-6xl mx-auto">
          {links.map((link, i) => {
            const warm = WARM[i % WARM.length];
            return (
              <motion.a
                key={link.url + link.label}
                {...pixelCell(i, 0.18, 0.05)}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col no-underline h-full overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.94)',
                  boxShadow: `inset 0 0 0 3px ${ACCENT}, 4px 4px 0 0 ${ACCENT}`,
                  color: ACCENT,
                }}
              >
                {/* hover shimmer (hexagoncircle/pixel-canvas); decorative → dropped
                    by high-contrast / reduce-motion via .pixel-deco */}
                <pixel-canvas
                  class="pixel-deco"
                  data-colors={SHIMMER}
                  data-gap="6"
                  data-speed="35"
                  style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
                />

                {/* title bar */}
                <div
                  className="relative z-[1] flex items-center justify-end px-2.5 py-1.5"
                  style={{ background: warm.bar, boxShadow: `inset 0 0 0 3px ${ACCENT}` }}
                >
                  <span className="font-pixel" style={{ fontSize: 10, color: ACCENT }}>×</span>
                </div>
                <div className="relative z-[1] flex flex-1 items-center gap-3 px-3.5 pb-3 pt-3.5">
                  <div
                    className="grid place-items-center flex-shrink-0"
                    style={{ width: 42, height: 42, background: warm.tile, boxShadow: `inset 0 0 0 2px ${ACCENT}` }}
                  >
                    {link.pixelIcon ? (
                      <img src={px(`icons/${link.pixelIcon}`)} alt="" className="pixel-img" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                    ) : (
                      <span className="text-xl">{link.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-rainy" style={{ fontSize: 26, color: ACCENT, lineHeight: 1, textTransform: 'lowercase' }}>
                      {link.label}{link.labelSuffix ? ` ${link.labelSuffix}` : ''}
                    </div>
                    {link.subtitle && (
                      <div className="font-pixel" style={{ fontSize: 9, color: ACCENT, opacity: 0.7, marginTop: 4, textTransform: 'lowercase' }}>
                        {link.subtitle}
                      </div>
                    )}
                  </div>
                  <span className="font-pixel" style={{ fontSize: 14, color: 'var(--d-pink-3)' }}>→</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
