import * as filterSchema from "../constants/filters";
import FormField from "../components/FormField/FormField";

export const filterPrimitiveTypes = Object.values(filterSchema).map(
  (el) => el.name
);

export function getDefaultAttributes(type) {
  const schema = filterSchema[type];
  if (!schema) {
    return [];
  }

  const attributes = schema.attributes.map((el) => {
    return {
      name: el.name,
      value: typeof el.default !== "object" ? el.default : undefined,
    };
  });

  return attributes;
}

export function renderFormControls(node, rest) {
  // console.groupCollapsed("renderFormControls")

  const schema = filterSchema[node.type];
  if (!schema) {
    // console.groupEnd();
    return null;
  }

  const values = node.attributes.reduce((acc, el) => {
    return { ...acc, [el.name]: el.value };
  }, {});

  const controls = schema.attributes.map((el) => {
    // console.log({ attribute: el })

    // don't render
    if (el.name === "in" || el.name === "in2" || el.name === "result") {
      return null;
    }

    const props = {
      ...rest,
      label: el.name,
      name: el.name,
      options: el.options,
      type: el.type,
      value: values[el.name] || el.defaultValue,
      variant: "details",
    };

    if (el.type === "number-optional-number") {
      props.type = "number";
    }

    if (el.type === "integer") {
      props.type = "number";
      props.step = 1;
    }

    if (props.type === "number") {
      props.max = props.max || el.max;
      props.min = props.min || el.min;
      props.step = props.step || el.step;
    }

    if (el.type === "text" && el.options) {
      props.type = "listbox";
      props.options = el.options;
    }

    return <FormField key={el.name} {...props} />;
  });

  // console.groupEnd();

  return controls;
}
