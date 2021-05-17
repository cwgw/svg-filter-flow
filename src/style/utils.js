import { useMemo } from "react";

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

export function useGetThemeProps({ themeKey, variant }) {
  return (key) => {
    return {
      themeKey,
      variant: key ? `${variant}.${key}` : variant,
    };
  };
}

export function useGetParentProps(props) {
  return useMemo(() => {
    const re = new RegExp(/^(?:aria-.+|data-.+|className|style)$/);
    return Object.keys(props).reduce(
      (acc, prop) => {
        return re.test(prop)
          ? { ...acc, parentProps: { ...acc.parentProps, [prop]: props[prop] } }
          : { ...acc, [prop]: props[prop] };
      },
      { parentProps: {} }
    );
  }, [props]);
}
