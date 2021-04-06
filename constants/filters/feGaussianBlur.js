export const feGaussianBlur = {
  name: "feGaussianBlur",
  attributes: [
    {
      name: "in",
      type: "node",
    },
    {
      name: "stdDeviation",
      type: "number-optional-number",
      defaultValue: 0,
    },
    {
      name: "edgeMode",
      type: "text",
      options: ["duplicate", "wrap", "none"],
    },
  ],
};
