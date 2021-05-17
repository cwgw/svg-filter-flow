export const feTurbulence = {
  name: "feTurbulence",
  attributes: [
    {
      name: "baseFrequency",
      type: "number-optional-number",
      defaultValue: 0,
    },
    {
      name: "numOctaves",
      type: "integer",
      defaultValue: 1,
    },
    {
      name: "seed",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "stitchTiles",
      type: "text",
      options: ["noStitch", "stitch"],
      defaultValue: "noStitch",
    },
    {
      name: "type",
      type: "text",
      options: ["fractalNoise", "turbulence"],
      defaultValue: "turbulence",
    },
  ],
};
