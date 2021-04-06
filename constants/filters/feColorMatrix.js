export const feColorMatrix = {
  name: "feColorMatrix",
  attributes: [
    {
      name: "in",
      type: "node",
    },
    {
      name: "type",
      type: "text",
      options: ["matrix", "saturate", "hueRotate", "luminanceToAlpha"],
      defaultValue: "matrix",
    },
    {
      name: "values",
      type: [
        {
          value: "matrix",
          when: {
            type: "matrix",
          },
        },
        {
          value: "number",
          min: 0,
          max: 1,
          when: {
            type: "saturate",
          },
        },
        {
          value: "degree",
          when: {
            type: "hueRotate",
          },
        },
      ],
      defaultValue: [
        {
          value: 1,
          when: {
            type: "saturate",
          },
        },
        {
          value: 0,
          when: {
            type: "hueRotate",
          },
        },
      ],
    },
  ],
};
