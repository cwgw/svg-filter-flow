export const feDiffuseLighting = {
  name: "feDiffuseLighting",
  attributes: [
    {
      name: "in",
    },
    {
      name: "surfaceScale",
      type: "number",
      defaultValue: 1,
    },
    {
      name: "diffuseConstant",
      type: "number",
      defaultValue: 1,
    },
    // deprecated
    // {
    //   name: "kernelUnitLength",
    // },
  ],
};
