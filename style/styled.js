import { styled as _styled } from "goober";
import merge from "deepmerge";
import { get } from "./utils";

const PROPERTY_ALIASES = {
  marginX: ["marginRight", "marginLeft"],
  marginY: ["marginTop", "marginBottom"],
  paddingX: ["paddingRight", "paddingLeft"],
  paddingY: ["paddingTop", "paddingBottom"],
  borderBottomRadius: ["borderBottomLeftRadius", "borderBottomRightRadius"],
  borderTopRadius: ["borderTopLeftRadius", "borderTopRightRadius"],
  borderRightRadius: ["borderTopRightRadius", "borderBottomRightRadius"],
  borderLeftRadius: ["borderTopLeftRadius", "borderBottomLeftRadius"],
};

const PROPERTY_SCALE_MAP = {
  // colors
  color: "colors",
  backgroundColor: "colors",
  borderColor: "colors",
  // space
  margin: "space",
  marginBottom: "space",
  marginLeft: "space",
  marginRight: "space",
  marginTop: "space",
  padding: "space",
  paddingBottom: "space",
  paddingLeft: "space",
  paddingRight: "space",
  paddingTop: "space",
  bottom: "space",
  left: "space",
  right: "space",
  top: "space",
  gap: "space",
  gridGap: "space",
  // sizes
  width: "sizes",
  height: "sizes",
  minWidth: "sizes",
  maxWidth: "sizes",
  minHeight: "sizes",
  maxHeight: "sizes",
  // shadows
  boxShadow: "shadows",
  textShadow: "shadows",
  // radii
  borderRadius: "radii",
  borderBottomLeftRadius: "radii",
  borderBottomRightRadius: "radii",
  borderTopLeftRadius: "radii",
  borderTopRightRadius: "radii",
  // zIndices
  zIndex: "zIndices",
  // fontSizes
  fontSize: "fontSizes",
};

const SCALES_WITH_NEGATIVE_KEYS = {
  space: true,
  sizes: true,
  radii: true,
};

export function styled(element, ...rest) {
  return (...args) => _styled(element, ...rest)(compose(args));
}

function compose(args) {
  return (props) => {
    const styles = args.concat(variants).flatMap((el) => {
      return typeof el === "function" ? el(props) : el;
    });

    return insertThemeValues(props.theme, merge.all(styles));
  };
}

function variants(props) {
  const { theme, themeKey, variant } = props;
  return (Array.isArray(variant) ? variant : [variant]).map((v) =>
    getVariantStyle(theme, themeKey, v)
  );
}

function getVariantStyle(theme, themeKey, variant) {
  return get(
    theme,
    `variants.${themeKey}.${variant}`,
    get(theme, `variants.${variant}`, {})
  );
}

export function insertThemeValues(theme, obj) {
  const style = Object.assign({}, obj);
  for (const prop in style) {
    if (typeof style[prop] === "object") {
      style[prop] = insertThemeValues(theme, style[prop]);
      continue;
    }

    if (!PROPERTY_ALIASES[prop] && !PROPERTY_SCALE_MAP[prop]) {
      continue;
    }

    let value = style[prop];
    let props = [prop];

    if (PROPERTY_ALIASES[prop]) {
      delete style[prop];
      props = PROPERTY_ALIASES[prop];
    }

    for (const prop of props) {
      if (PROPERTY_SCALE_MAP[prop]) {
        const scale = PROPERTY_SCALE_MAP[prop];
        const absValue = isNaN(value)
          ? value.replace(/^-/, "")
          : Math.abs(value);
        let themeValue;

        if (SCALES_WITH_NEGATIVE_KEYS[scale] && absValue !== value) {
          themeValue = get(theme, `${scale}.${absValue}`);
          if (themeValue) {
            themeValue = isNaN(themeValue) ? `-${themeValue}` : 0 - themeValue;
          }
        } else {
          themeValue = get(theme, `${scale}.${value}`);
        }

        if (typeof themeValue !== "undefined") {
          value =
            isNaN(themeValue) || prop === "zIndex"
              ? themeValue
              : `${themeValue}px`;
        }
      }

      style[prop] = value;
    }
  }

  return style;
}
