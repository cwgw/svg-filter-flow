function createUniqueId() {
  let id = 0;
  return (prefix) => `${prefix || "UID"}${++id}`;
}

export const uniqueId = createUniqueId();

// Filter the provided props by arbitrary conditions
// It's kind of like the popular lib classNames, but for props.
// Useful for only rendering data and aria props when you want to.
export function maybeProps(obj) {
  const props = {};
  for (const prop in obj) {
    if (obj[prop]) {
      props[prop] = obj[prop];
    }
  }

  return props;
}

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
