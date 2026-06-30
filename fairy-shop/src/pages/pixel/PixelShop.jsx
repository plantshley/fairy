// Pixel-theme Shop page. Renders pixel product cards from src/shopProducts.js
// (placeholder data for now — the seam for a real storefront). Each card links
// out to its Ko-fi product.
import { NavBar, PxButton, Marquee, Slot } from '../../components/pixel/PixelKit';
import { px } from '../../components/pixel/asset';
import { shopProducts, SHOP_URL } from '../../shopProducts';

const ACCENT = 'var(--d-plum)';
const CATEGORIES = ['plushies', 'pegasi', 'bears', 'bunnies', 'accessories'];

export function PixelShop({ activeTab, onTabChange, onOpenAccessibility }) {
  return (
    <div className="bgD relative w-full min-h-dvh overflow-hidden">
      <img
        src={px('icons/sparkles.gif')}
        alt=""
        className="pixel-img pixel-deco pointer-events-none absolute inset-0 w-full h-full"
        style={{ opacity: 0.3, mixBlendMode: 'screen' }}
      />
      {/* butterflies tiled across the bg */}
      <div
        className="pixel-img pixel-deco pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${px('icons/butterflies.gif')})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px auto',
          opacity: 0.95,
        }}
      />

      <div className="relative z-[2] px-4 py-6 sm:px-10 lg:px-20">
        <NavBar accent={ACCENT} active={activeTab} onTabChange={onTabChange} onOpenAccessibility={onOpenAccessibility} />

        <div className="text-center my-5">
          <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-5">
            <img src={px('icons/twinkle-shop.gif')} alt="" className="pixel-img pixel-deco w-9 sm:w-12 flex-shrink-0" />
            <div className="deco-title deco-title--d deco-title--d-neon font-rainy whitespace-nowrap" style={{ fontSize: 'clamp(26px, 8vw, 80px)' }}>
              ♡ shop ♡
            </div>
            <img src={px('icons/twinkle-shop.gif')} alt="" className="pixel-img pixel-deco w-9 sm:w-12 flex-shrink-0" />
          </div>
        </div>

        {/* animated marquee banner */}
        <div
          className="my-4"
          style={{
            background: 'linear-gradient(90deg, var(--d-pink-3), var(--b-yellow), var(--d-lilac-2), var(--d-pink-3))',
            backgroundSize: '300% 100%',
            animation: 'holo-shift 5s linear infinite',
            boxShadow: `inset 0 0 0 3px ${ACCENT}, 4px 4px 0 0 var(--d-pink-3)`,
            padding: '8px 0',
          }}
        >
          <Marquee speed={28}>
            <span className="font-pixel" style={{ fontSize: 12, color: '#fff', textShadow: `1px 1px 0 ${ACCENT}`, padding: '0 8px', display: 'inline-block' }}>
              ✦ page under maintenance ✦ &nbsp; ♡ see my ko-fi page link to shop ♡ &nbsp; ★ commissions open ★ &nbsp; 
            </span>
          </Marquee>
        </div>

        {/* category strip */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {CATEGORIES.map((c, i) => (
            <PxButton key={c} bg={i === 0 ? 'var(--d-pink-3)' : '#fff'} border={ACCENT} fg={i === 0 ? '#fff' : ACCENT}>{c}</PxButton>
          ))}
        </div>

        {/* product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {shopProducts.map((p, i) => (
            <a
              key={p.title}
              href={p.kofiUrl || SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline block"
              style={{ background: 'rgba(255,255,255,0.96)', boxShadow: `inset 0 0 0 3px ${ACCENT}, 4px 4px 0 0 ${ACCENT}`, padding: 10 }}
            >
              <div className="relative mb-2.5">
                {p.image ? (
                  <img src={px(p.image)} alt={p.title} className="pixel-img w-full" style={{ height: 150, objectFit: 'cover' }} />
                ) : (
                  <Slot label={`PLUSH /${i + 1}`} w="100%" h={150} bg={p.tint} fg={ACCENT} />
                )}
                {p.tag && (
                  <span className="font-pixel" style={{ position: 'absolute', top: 6, left: 6, background: ACCENT, color: '#fff', fontSize: 8, padding: '2px 6px' }}>{p.tag}</span>
                )}
                <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 14, color: 'var(--d-pink-3)' }}>♡</span>
              </div>
              <div className="font-rainy" style={{ fontSize: 22, color: ACCENT, lineHeight: 1, marginBottom: 4 }}>{p.title}</div>
              <div className="flex justify-between items-center">
                <span className="font-pixel" style={{ fontSize: 12, color: 'var(--d-pink-3)' }}>{p.price}</span>
                <span className="pxbtn" style={{ '--btn-bg': 'var(--d-pink-3)', '--btn-border': ACCENT, '--btn-fg': '#fff' }}>+ cart</span>
              </div>
            </a>
          ))}
        </div>

        <p className="font-pixel text-center mt-6" style={{ fontSize: 10, color: ACCENT, opacity: 0.8 }}>
          ⋆⁺₊⋆ handmade with love &amp; care · tap a plushie to visit the ko-fi shop ⋆⁺₊⋆
        </p>
      </div>
    </div>
  );
}
