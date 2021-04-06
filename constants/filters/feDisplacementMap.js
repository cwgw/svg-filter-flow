export const feDisplacementMap = {
  name: "feDisplacementMap",
  attributes: [
    {
      name: "scale",
      type: "number",
    },
    {
      name: "xChannelSelector",
      type: "text",
      options: ["R", "G", "B", "A"],
      defaultValue: "A",
    },
    {
      name: "yChannelSelector",
      type: "text",
      options: ["R", "G", "B", "A"],
      defaultValue: "A",
    },
  ],
};
