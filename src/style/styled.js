import { styled as _styled } from "goober";
import merge from "deepmerge";

import { css } from "./css";
import { get } from "./utils";

export function styled(element, options) {
  return (...args) => _styled(element, options)(compose(args));
}

function compose(arr) {
  return (props) => {
    const styles = arr
      .concat(themeProps)
      .flatMap(getStyle(props))
      .filter(Boolean);

    return css(merge.all(styles))(props.theme);
  };
}

function themeProps({ theme, themeKey, variant }) {
  return (Array.isArray(variant) ? variant : [variant]).map((v) => {
    return get(
      theme,
      `variants.${themeKey}.${variant}`,
      get(theme, `variants.${variant}`, {})
    );
  });
}

function getStyle(props) {
  return (style) => {
    if (typeof style === "function") {
      return style(props);
    }

    if (Array.isArray(style)) {
      return style.map(getStyle(props));
    }

    return style;
  };
}
