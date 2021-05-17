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

const PROPERTY_SCALES = {
  // colors
  color: "colors",
  backgroundColor: "colors",
  borderColor: "colors",
  // space
  margin: "space",
  marginX: "space",
  marginY: "space",
  marginBottom: "space",
  marginLeft: "space",
  marginRight: "space",
  marginTop: "space",
  padding: "space",
  paddingX: "space",
  paddingY: "space",
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
  borderBottomRadius: "radii",
  borderBottomLeftRadius: "radii",
  borderBottomRightRadius: "radii",
  borderTopRadius: "radii",
  borderTopLeftRadius: "radii",
  borderTopRightRadius: "radii",
  borderLeftRadius: "radii",
  borderRightRadius: "radii",
  // zIndices
  zIndex: "zIndices",
  // fontSizes
  fontSize: "fontSizes",
};

export function css(obj) {
  return (theme) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === "function") {
        return { ...acc, [key]: value(theme) };
      }

      // if (Array.isArray(value)) {
      //   // handle responsive styles
      // }

      if (typeof value === "object") {
        return { ...acc, [key]: css(value)(theme) };
      }

      return { ...acc, ...transformStyle(theme, { key, value }) };
    }, {});
  };
}

function transformStyle(theme, { key, value }) {
  if (typeof value === "undefined" || typeof value === null) {
    return {};
  }

  if (!PROPERTY_SCALES[key]) {
    return { [key]: value };
  }

  const scale = PROPERTY_SCALES[key];
  const keys = PROPERTY_ALIASES[key] || [key];

  const abs = getAbsoluteValue(value);
  let v = get(theme, `${scale}.${abs || value}`, value);
  if (abs && allowNegativeKey(scale)) {
    v = isNaN(v) ? `-${v}` : 0 - v;
  }

  v = shouldAddUnits(scale) ? withUnits(v) : v;

  return keys.reduce((acc, k) => {
    return { ...acc, [k]: v };
  }, {});
}

function allowNegativeKey(scale) {
  return scale === "radii" || scale === "sizes" || scale === "space";
}

function getAbsoluteValue(value) {
  if (!isNaN(value) && value < 0) {
    return Math.abs(value);
  }

  if (typeof value === "string" && value.startsWith("-")) {
    return value.slice(1);
  }

  return;
}

function withUnits(value) {
  return isNaN(value) ? value : `${value}px`;
}

function shouldAddUnits(scale) {
  return (
    scale === "fontSizes" ||
    scale === "radii" ||
    scale === "sizes" ||
    scale === "space"
  );
}
