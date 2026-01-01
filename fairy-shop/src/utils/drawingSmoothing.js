/**
 * Smooths drawing points using a simplified version of Excalidraw's approach
 * Reduces jitter and creates smoother curves
 */

/**
 * Simplifies points by removing unnecessary intermediate points
 * Uses Ramer-Douglas-Peucker algorithm
 */
export function simplifyPoints(points, tolerance = 2) {
  if (points.length <= 4) return points; // Need at least 2 points (4 values)

  const coords = [];
  for (let i = 0; i < points.length; i += 2) {
    coords.push({ x: points[i], y: points[i + 1] });
  }

  const simplified = rdpSimplify(coords, tolerance);

  const result = [];
  simplified.forEach(p => {
    result.push(p.x, p.y);
  });

  return result;
}

/**
 * Ramer-Douglas-Peucker algorithm for line simplification
 */
function rdpSimplify(points, tolerance) {
  if (points.length <= 2) return points;

  let maxDistance = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const distance = perpendicularDistance(points[i], points[0], points[end]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  if (maxDistance > tolerance) {
    const left = rdpSimplify(points.slice(0, index + 1), tolerance);
    const right = rdpSimplify(points.slice(index), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  return [points[0], points[end]];
}

/**
 * Calculate perpendicular distance from point to line
 */
function perpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  if (dx === 0 && dy === 0) {
    return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2)
    );
  }

  const numerator = Math.abs(
    dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x
  );
  const denominator = Math.sqrt(dx * dx + dy * dy);

  return numerator / denominator;
}

/**
 * Smooths points using Catmull-Rom spline interpolation
 * Creates smooth curves between points
 */
export function smoothPoints(points, tension = 0.5) {
  if (points.length < 6) return points; // Need at least 3 points (6 values)

  const coords = [];
  for (let i = 0; i < points.length; i += 2) {
    coords.push({ x: points[i], y: points[i + 1] });
  }

  const smoothed = [coords[0]];

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];

    const segments = 8; // Number of interpolation points between each pair
    for (let t = 0; t < segments; t++) {
      const u = t / segments;
      const point = catmullRomPoint(p0, p1, p2, p3, u, tension);
      smoothed.push(point);
    }
  }

  smoothed.push(coords[coords.length - 1]);

  const result = [];
  smoothed.forEach(p => {
    result.push(p.x, p.y);
  });

  return result;
}

/**
 * Calculate a point on a Catmull-Rom spline
 */
function catmullRomPoint(p0, p1, p2, p3, t, tension) {
  const t2 = t * t;
  const t3 = t2 * t;

  const v0 = (p2.x - p0.x) * tension;
  const v1 = (p3.x - p1.x) * tension;

  const c0 = p1.x;
  const c1 = v0;
  const c2 = 3 * (p2.x - p1.x) - 2 * v0 - v1;
  const c3 = 2 * (p1.x - p2.x) + v0 + v1;

  const x = c0 + c1 * t + c2 * t2 + c3 * t3;

  const w0 = (p2.y - p0.y) * tension;
  const w1 = (p3.y - p1.y) * tension;

  const d0 = p1.y;
  const d1 = w0;
  const d2 = 3 * (p2.y - p1.y) - 2 * w0 - w1;
  const d3 = 2 * (p1.y - p2.y) + w0 + w1;

  const y = d0 + d1 * t + d2 * t2 + d3 * t3;

  return { x, y };
}

/**
 * Main smoothing function that combines simplification and smoothing
 * Use this when a drawing stroke is completed
 */
export function smoothDrawingStroke(points) {
  if (points.length < 6) return points;

  // First simplify to remove unnecessary points
  const simplified = simplifyPoints(points, 1.5);

  // Then smooth the remaining points
  const smoothed = smoothPoints(simplified, 0.5);

  return smoothed;
}
