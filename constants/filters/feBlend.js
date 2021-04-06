export const feBlend = {
  name: "feBlend",
  attributes: [
    {
      name: "in",
      type: "node",
    },
    {
      name: "in2",
      type: "node",
    },
    {
      name: "mode",
      type: "text",
      options: [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      defaultValue: "normal",
    },
  ],
};
