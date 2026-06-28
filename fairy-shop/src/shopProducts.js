// Placeholder storefront data for the pixel-theme Shop page.
//
// This is the seam for the real product grid the owner plans to add: replace
// these entries (or load them from a CMS/JSON) with real products. Each card
// links out to its Ko-fi product page.
//
// Fields:
//   title   — product name shown on the card
//   price   — display string (e.g. "$34")
//   kofiUrl — link target for the card (defaults to the shop if omitted)
//   image   — getAssetPath-relative public path (e.g. "/pixel/...") or null for
//             a pixel "Slot" placeholder
//   tag     — optional ribbon ("new", "hot", "ltd", ...)
//   tint    — placeholder slot background (pixel palette var) when image is null

export const SHOP_URL = 'https://ko-fi.com/kirametki/shop';

export const shopProducts = [
  { title: 'holo pegasus', price: '$34', tag: 'new', tint: 'var(--d-pink)', image: null, kofiUrl: SHOP_URL },
  { title: 'lilac pony plush', price: '$28', tag: '', tint: 'var(--d-lilac)', image: null, kofiUrl: SHOP_URL },
  { title: 'rose bunny', price: '$26', tag: 'hot', tint: 'var(--d-pink-2)', image: null, kofiUrl: SHOP_URL },
  { title: 'butter duck', price: '$22', tag: '', tint: 'var(--b-yellow)', image: null, kofiUrl: SHOP_URL },
  { title: 'cyber bunny', price: '$24', tag: '', tint: 'var(--d-cyan)', image: null, kofiUrl: SHOP_URL },
  { title: 'stardust charm', price: '$10', tag: 'ltd', tint: 'var(--d-cream-2)', image: null, kofiUrl: SHOP_URL },
];
