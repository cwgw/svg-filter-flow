/**
 * Adapted from @theme-ui/css
 */
export function get(obj, path, fallback, p, undef) {
  const pathArray = path && typeof path === "string" ? path.split(".") : [path];
  for (p = 0; p < pathArray.length; p++) {
    obj = obj ? obj[pathArray[p]] : undef;
  }

  if (obj === undef) {
    return fallback;
  }

  return obj;
}

export function getThemeProps(options) {
  const { themeKey, variant } = options || {};
  return (component, props) => {
    const { variant: _variant } = props || {};
    const v = _variant || variant;
    const variants = Array.isArray(v) ? v : [v];
    return {
      themeKey,
      variant: variants.map((v) => (component ? `${v}.${component}` : v)),
    };
  };
}

export function separateLayoutProps(props) {
  const layout = {};
  const rest = {};
  for (const prop in props) {
    if (prop === "className" || prop.startsWith("data-")) {
      layout[prop] = props[prop];
    } else {
      rest[prop] = props[prop];
    }
  }

  return { layout, rest };
}

// export function createThemeCustomProperties(theme) {
//   const vars = Object.entries(theme).reduce((acc, [key, value]) => {}, {});

//   return vars;
// }

/**
 * theme: {
 *   colors: {
 *     primary: "blue"
 *   }
 * }
 *
 * --theme-colors-primary: "blue"
 * var(--theme-colors-primary)
 */
