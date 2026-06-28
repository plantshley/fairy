import { getAssetPath } from '../../utils/assetPath';

// Asset helper for pixel-theme GIF/image assets (live in public/pixel/).
// Mirrors the design mockup's A() helper but routes through getAssetPath so
// paths survive the GitHub-Pages base path.
export const px = (p) => getAssetPath('/pixel/' + p);
