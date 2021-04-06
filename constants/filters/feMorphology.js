export const feMorphology = {
  name: "feMorphology",
  attributes: [
    {
      name: "in",
      type: "node",
    },
    {
      name: "operator",
      type: "text",
      options: ["erode", "dilate"],
      defaultValue: "erode",
    },
    {
      name: "radius",
      type: "number-optional-number",
      defaultValue: 0,
    },
  ],
};
