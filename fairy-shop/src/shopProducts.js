// Single source of truth for the Shop page (both the standard themes and the
// pixel theme read from here).
//
// ─── Updating the shop ────────────────────────────────────────────────────────
//  • Add a product : add an entry below, then drop the images (see naming) in.
//  • Retire a sold-out product : delete its entry.
//  • Category tag  : set `category` to one of the SHOP_CATEGORIES ids below.
//                    Leave it '' to show the product only under the "all" pill.
//  • Ko-fi link    : set `kofiUrl` to the item's Ko-fi product page
//                    (ko-fi.com/s/<hash>). Leave '' to fall back to the shop.
//
// ─── Image naming (auto-derived from `slug`) ──────────────────────────────────
//  • Transparent (non-pixel themes) : public/shop/product-transparents/<slug>.png
//  • Photo (pixel theme + fullscreen): public/shop/product-photos/<slug>.jpg
//  • Extra angles : add <slug>-2.png / <slug>-3.png (or -2.jpg ...). They are
//    auto-detected at runtime and cycle in the grid — no code change needed.
//  • A product with no transparent falls back to its photo in the grid.

export const SHOP_URL = 'https://ko-fi.com/kirametki/shop';

// Ordered filter pills — mirrors the Ko-fi shop tabs. `id` is set on products;
// `label` is the display text (emoji included to match Ko-fi). "all" is implicit.
export const SHOP_CATEGORIES = [
  { id: 'griffon',  label: 'griffon friends 🦁🦉' },
  { id: 'harpy',    label: 'harpy friends 🦇🧚‍♀️' },
  { id: 'impy',     label: 'impy friends 😈🐾' },
  { id: 'kirarin',  label: 'Kirarin friends ✨🦄' },
  { id: 'lovely',   label: 'Lovely friends 💖' },
  { id: 'sylph',    label: 'sylph friends 🪻🦢' },
  { id: 'tenshi',   label: 'Tenshi friends 👼☁' },
  { id: 'toodie',   label: 'Toodie frootie 🍋🌈' },
  { id: 'yosei',    label: 'yosei friends 🧚‍♂️👹' },
  { id: 'patterns', label: 'patterns 🧶' },
];

export const shopProducts = [
  { slug: 'hibiscus-ribbon',            title: 'Hibiscus Ribbon Kirarin',    price: '$40',   category: 'kirarin',   kofiUrl: 'https://ko-fi.com/s/63843f0724' },
  { slug: 'glittering-glorp',           title: 'Glittering Glorp Harpy',     price: '$65',   category: 'harpy',     kofiUrl: 'https://ko-fi.com/s/4d26b702a0' },
  { slug: 'lil-macaron',                title: 'Lil Macaron',                price: '$20',   category: 'kirarin',   kofiUrl: 'https://ko-fi.com/s/8225780d32' },
  { slug: 'star-bee',                   title: 'Bee a Star Frootie',         price: '$35',  category: 'toodie',    kofiUrl: 'https://ko-fi.com/s/8e7ba8f0ea' },
  { slug: 'vampire-rock-harpy',         title: 'Vampire Rock Harpy',         price: '$55',   category: 'harpy',    kofiUrl: 'https://ko-fi.com/s/58b54f21fa' },
  { slug: 'blip',                       title: 'Blip',                       price: '$55',   category: 'impy',         kofiUrl: 'https://ko-fi.com/s/8831030034' },
  { slug: 'midnight-sun-lovely',        title: 'Midnight Sun Lovely',        price: '$50',   category: 'lovely',   kofiUrl: 'https://ko-fi.com/s/4dbbfc064d' },
  { slug: 'sunkissed-rainshower-sylph', title: 'Sunkissed Rainshower Sylph', price: '$50',   category: 'sylph',    kofiUrl: 'https://ko-fi.com/s/5b9a67ad2b' },
  { slug: 'dutchess-swan-griffon',      title: 'Dutchess Swan Griffon',      price: '$35',   category: 'griffon',  kofiUrl: 'https://ko-fi.com/s/33f9844a0b' },
  { slug: 'vanilla-sugar-rose',         title: 'Vanilla Sugar Rose',         price: '$35',   category: 'kirarin',         kofiUrl: 'https://ko-fi.com/s/54f3adc0fa' },
  { slug: 'lavender-of-minerva-butterfly', title: 'Lavender of Minerva Butterfly', price: '$60', category: 'tenshi',    kofiUrl: 'https://ko-fi.com/s/35f4899930' },
  { slug: 'starlight-stone',            title: 'Starlight Stone',            price: '$30',   category: 'kirarin',         kofiUrl: 'https://ko-fi.com/s/70f12dba1f' },
  { slug: 'funky-bun-keychain',         title: 'Funky Bun Keychain',         price: '$7.50', category: 'yosei',         kofiUrl: 'https://ko-fi.com/s/4b9512719f' },
  { slug: 'coasters',                   title: 'Coasters',                   price: '$5',    category: '',         kofiUrl: 'https://ko-fi.com/s/01b13d856f' },
  { slug: 'mini-magnets',               title: 'Mini Magnets',               price: '$5',    category: 'yosei',         kofiUrl: 'https://ko-fi.com/s/95112971d4' },
  { slug: 'pan-pride-party',            title: 'Pan Party Kirarin',          price: '$40',   category: 'kirarin',  kofiUrl: 'https://ko-fi.com/s/ef6280c1df' },
  { slug: 'holy-night-candle',          title: 'Holy Night Candle Griffon',  price: '$35',   category: 'griffon',    kofiUrl: 'https://ko-fi.com/s/3317ada073' },
  { slug: 'barasuishou',                title: 'Barasuishou (Rose Crystal) Sylph', price: '$60',   category: 'sylph',         kofiUrl: 'https://ko-fi.com/s/f6a38245da' },
  { slug: 'black-cherry-imp',           title: 'Black Cherry Imp',           price: '$50',   category: 'impy',   kofiUrl: 'https://ko-fi.com/s/46d2ce4db6' },
  { slug: 'mary-princess',              title: 'Mary the Princess Sylph',    price: '$60',   category: 'sylph',    kofiUrl: 'https://ko-fi.com/s/60e28a38b2' },
  { slug: 'silver-moon',                title: 'Crystal Winter Moon Lovely',         price: '$55',   category: 'lovely',         kofiUrl: 'https://ko-fi.com/s/9373448382' },
  { slug: 'twinkle-hearts-griffon',     title: 'Twinkle Hearts Griffon',     price: '$100', category: 'griffon',    kofiUrl: 'https://ko-fi.com/s/517a097b9d' },

  { slug: 'kirapillar-friend-pattern',  title: 'Kirapillar Friend Pattern',  price: '$3',    category: 'patterns', kofiUrl: 'https://ko-fi.com/s/281ba8fc64' },
  { slug: 'toodie-friend-pattern',  title: 'Toodie Frootie Friend Pattern',  price: '$3',    category: 'patterns', kofiUrl: 'https://ko-fi.com/s/d5ab24d6be' },
  { slug: 'sylph-friend-pattern',  title: 'Sylph Friend Pattern',  price: '$3',    category: 'patterns', kofiUrl: 'https://ko-fi.com/s/74967ec726' },
  { slug: 'kirarin-friend-pattern',  title: 'Kirarin Friend Pattern',  price: '$3',    category: 'patterns', kofiUrl: 'https://ko-fi.com/s/209cdca5ef' },
  { slug: 'tenshi-friend-pattern',  title: 'Tenshi Friend Pattern',  price: '$3',    category: 'patterns', kofiUrl: 'https://ko-fi.com/s/8ac9278e08' },
  { slug: 'harpy-friend-pattern',  title: 'Harpy Friend Pattern',  price: '$3',    category: 'patterns', kofiUrl: 'https://ko-fi.com/s/0be338422f' },
  { slug: 'griffon-friend-pattern',  title: 'Griffon Friend Pattern',  price: '$3',    category: 'patterns', kofiUrl: 'https://ko-fi.com/s/e12efe3394' },

];

// Variant-aware path helpers. n=1 -> "<slug>"; n>1 -> "<slug>-n". Each returns
// the raw public-relative candidate paths (both .png and .jpg) for that variant,
// so a product image can be saved as either extension — the loader (see
// src/utils/probeVariants.js) uses whichever file actually exists. The preferred
// extension is listed first (transparents favour .png, photos favour .jpg).
const withExts = (base, exts) => exts.map((ext) => `${base}.${ext}`);
const variantBase = (folder, slug, n) => `shop/${folder}/${slug}${n > 1 ? `-${n}` : ''}`;

export const productTransparent = (slug, n = 1) =>
  withExts(variantBase('product-transparents', slug, n), ['png', 'jpg']);

export const productPhoto = (slug, n = 1) =>
  withExts(variantBase('product-photos', slug, n), ['jpg', 'png']);
