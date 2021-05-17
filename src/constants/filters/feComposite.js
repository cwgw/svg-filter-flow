export const feComposite = {
  name: "feComposite",
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
      name: "operator",
      type: "text",
      options: ["over", "in", "out", "atop", "xor", "lighter", "arithmetic"],
    },
    {
      name: "k1",
      type: [
        {
          value: "number",
          when: {
            operator: "arithmetic",
          },
        },
      ],
      defaultValue: [
        {
          value: 0,
          when: {
            operator: "arithmetic",
          },
        },
      ],
    },
    {
      name: "k2",
      type: [
        {
          value: "number",
          when: {
            operator: "arithmetic",
          },
        },
      ],
      defaultValue: [
        {
          value: 0,
          when: {
            operator: "arithmetic",
          },
        },
      ],
    },
    {
      name: "k3",
      type: [
        {
          value: "number",
          when: {
            operator: "arithmetic",
          },
        },
      ],
      defaultValue: [
        {
          value: 0,
          when: {
            operator: "arithmetic",
          },
        },
      ],
    },
    {
      name: "k4",
      type: [
        {
          value: "number",
          when: {
            operator: "arithmetic",
          },
        },
      ],
      defaultValue: [
        {
          value: 0,
          when: {
            operator: "arithmetic",
          },
        },
      ],
    },
  ],
};
