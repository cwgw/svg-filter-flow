export const feConvolveMatrix = {
  name: "feConvolveMatrix",
  attributes: [
    {
      name: "in",
    },
    {
      name: "order",
      type: "kernalMatrixOrder",
    },
    {
      name: "kernelMatrix",
      type: "kernalMatrix",
    },
    {
      name: "divisor",
      type: "number",
    },
    {
      name: "bias",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "targetX",
      type: "number",
      step: 1,
    },
    {
      name: "targetY",
      type: "number",
      step: 1,
    },
    {
      name: "edgeMode",
      type: "text",
      options: ["duplicate", "wrap", "none"],
      defaultValue: "duplicate",
    },
    // deprecated
    // {
    //   name: "kernelUnitLength",
    // },
    {
      name: "preserveAlpha",
      type: "boolean",
      defaultValue: false,
    },
  ],
};
