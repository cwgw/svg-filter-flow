export const feSpecularLighting = {
  name: "feSpecularLighting",
  attributes: [
    {
      name: "in",
      type: "node",
    },
    {
      name: "surfaceScale",
      type: "number",
      defaultValue: 1,
    },
    {
      name: "specularConstant",
      type: "number",
      defaultValue: 1,
    },
    {
      name: "specularExponent",
      type: "number",
      defaultValue: 1,
    },
    // deprecated
    // {
    //   name: "kernelUnitLength",
    // },
  ],
};
