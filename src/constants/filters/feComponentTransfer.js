const transferFunctionAttributes = [
  {
    name: "type",
    type: "text",
    options: ["identity", "table", "discrete", "linear", "gamma"],
  },
  {
    name: "tableValues",
    type: "tableValue",
  },
  {
    name: "slope",
    type: "number",
  },
  {
    name: "intercept",
    type: "number",
  },
  {
    name: "amplitude",
    type: "number",
  },
  {
    name: "exponent",
    type: "number",
  },
  {
    name: "offset",
    type: "number",
  },
];

export const feComponentTransfer = {
  name: "feComponentTransfer",
  attributes: [
    {
      name: "in",
      type: "node",
    },
  ],
  children: [
    {
      name: "feFuncR",
      attributes: transferFunctionAttributes,
    },
    {
      name: "feFuncG",
      attributes: transferFunctionAttributes,
    },
    {
      name: "feFuncB",
      attributes: transferFunctionAttributes,
    },
    {
      name: "feFuncA",
      attributes: transferFunctionAttributes,
    },
  ],
};
