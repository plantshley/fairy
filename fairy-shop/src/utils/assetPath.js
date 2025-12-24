// Helper function to get the correct asset path for GitHub Pages deployment
export const getAssetPath = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // In production (GitHub Pages), prepend the base URL
  // In development, use the path as-is
  return import.meta.env.BASE_URL + cleanPath;
};
