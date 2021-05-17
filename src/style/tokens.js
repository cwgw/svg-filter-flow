function assignAliases(scale, aliases) {
  return Object.entries(aliases).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, scale);
}

function addHalfSteps(scale) {
  return scale.reduce((acc, el, i, arr) => {
    acc[i] = el;
    if (arr[i + 1]) {
      acc[`${i}.5`] = (arr[i] + arr[i + 1]) / 2;
    }

    return acc;
  }, []);
}

// Space
const spaceScale = [0, 4, 8, 16, 32, 64, 128, 256, 512];
const spaceAliases = {
  xxs: 2,
  xs: spaceScale[1],
  sm: spaceScale[2],
  md: spaceScale[3],
  lg: spaceScale[4],
  xl: spaceScale[5],
  xxl: spaceScale[6],
};

export const space = assignAliases(addHalfSteps(spaceScale), spaceAliases);

// Sizes
export const sizes = {
  xs: 192,
  sm: 384,
  md: 576,
  lg: 768,
  xl: 1152,
  xxl: 1440,

  formControl: 288,
};

// Font sizes
const fontScale = [12, 14, 16, 20, 24, 32, 48, 64, 96];
const fontAliases = {
  xs: fontScale[0],
  sm: fontScale[1],
  md: fontScale[2],
};

export const fontSizes = assignAliases(addHalfSteps(fontScale), fontAliases);

// Font weights
export const fontWeights = {
  bold: 700,
};

// Colors
const gray = {
  50: "#F9FAFA",
  100: "#E8EBEC",
  200: "#D0D5D8",
  300: "#AAB4B9",
  400: "#829198",
  500: "#5A6D77",
  600: "#374F5B",
  700: "#283B44",
  800: "#1D2B32",
  900: "#121C21",
};

export const colors = {
  background: "#fff",
  text: gray["700"],
  primary: "royalblue",
  gray,
};

// Shadows
export const shadows = {
  focus: `0 0 0 3px ${colors.primary}`,
};

// Radii
export const radii = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 24,
};

// zIndices
export const zIndices = {
  popup: 1100,
};
