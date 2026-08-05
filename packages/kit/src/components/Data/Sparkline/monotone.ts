// cspell:words Fritsch Carlson

export interface MonotonePoint {
  x: number;
  y: number;
}

/**
 * Monotone cubic Hermite interpolation (Fritsch-Carlson) converted to cubic
 * Bezier. Zeroes tangents at local extrema and applies the alpha-beta
 * constraint so consecutive equal values do not overshoot. Aligned with
 * Vuetify's `smooth-mode="monotone"`.
 */
export function genMonotonePath(points: MonotonePoint[], smooth: number): string {
  if (points.length === 0) return "";
  const start = points[0]!;
  if (smooth <= 0 || points.length < 3) {
    return (
      `M${start.x.toFixed(2)},${start.y.toFixed(2)}` +
      points
        .slice(1)
        .map((point) => `L${point.x.toFixed(2)},${point.y.toFixed(2)}`)
        .join("")
    );
  }

  const tension = Math.min(smooth / 8, 1);
  const count = points.length;
  const delta: number[] = [];
  for (let index = 0; index < count - 1; index += 1) {
    const dx = points[index + 1]!.x - points[index]!.x;
    delta[index] = dx === 0 ? 0 : (points[index + 1]!.y - points[index]!.y) / dx;
  }

  const tangent: number[] = new Array(count);
  tangent[0] = delta[0]!;
  tangent[count - 1] = delta[count - 2]!;
  for (let index = 1; index < count - 1; index += 1) {
    const before = delta[index - 1]!;
    const after = delta[index]!;
    if (before === 0 || after === 0 || before > 0 !== after > 0) {
      tangent[index] = 0;
    } else {
      tangent[index] = (before + after) / 2;
    }
  }

  for (let index = 0; index < count - 1; index += 1) {
    const slope = delta[index]!;
    if (slope === 0) {
      tangent[index] = 0;
      tangent[index + 1] = 0;
    } else {
      const alpha = tangent[index]! / slope;
      const beta = tangent[index + 1]! / slope;
      const squaredSum = alpha * alpha + beta * beta;
      if (squaredSum > 9) {
        const tau = 3 / Math.sqrt(squaredSum);
        tangent[index] = tau * alpha * slope;
        tangent[index + 1] = tau * beta * slope;
      }
    }
  }

  let path = `M${start.x.toFixed(2)},${start.y.toFixed(2)}`;
  points.slice(1).forEach((current, index) => {
    const previous = points[index]!;
    const dx = current.x - previous.x;
    const control1X = previous.x + (dx * tension) / 3;
    const control1Y = previous.y + (tangent[index]! * dx * tension) / 3;
    const control2X = current.x - (dx * tension) / 3;
    const control2Y = current.y - (tangent[index + 1]! * dx * tension) / 3;
    path += ` C${control1X.toFixed(2)},${control1Y.toFixed(2)} ${control2X.toFixed(2)},${control2Y.toFixed(2)} ${current.x.toFixed(2)},${current.y.toFixed(2)}`;
  });
  return path;
}
