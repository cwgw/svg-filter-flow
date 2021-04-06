export const forms = {
  input: {
    default: {
      paddingY: "sm",
      paddingX: "md",
    },
  },
  combobox: {
    default: {
      textbox: {
        paddingY: "sm",
        paddingX: "md",
      },
    },
  },
  field: {
    default: {
      display: "flex",
      flexFlow: "column nowrap",
      alignItems: "start",
      label: {
        marginBottom: "md",
      },
      input: {
        paddingY: "sm",
        paddingX: "md",
      },
    },
    details: {
      display: "grid",
      gridTemplateColumns: "minmax(0px, 8rem) minmax(0px, 100%)",
      alignItems: "center",
      marginBottom: "sm",
      fontSize: "xs",
    },
  },
};
