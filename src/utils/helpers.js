export function round(n, precision) {
  const fac = Math.pow(10, !isNaN(precision) ? precision : 0);
  return Math.round(n * fac) / fac;
}

export function clamp(
  n,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY
) {
  return Math.min(max, Math.max(min, n));
}

export function escapeRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
