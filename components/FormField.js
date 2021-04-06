import loadable from "@loadable/component";
import { useCallback, useRef } from "react";

import { styled, separateLayoutProps, getThemeProps } from "../style";
import { uniqueId } from "../utils/helpers";

import Label from "./Label";

const defaultProps = {
  themeKey: "forms.field",
  variant: "default",
};

const Container = styled("div")({});

const controls = {
  color: "ColorInput",
  combobox: "Combobox",
  listbox: "Listbox",
  number: "NumberInput",
  text: "Input",
  default: "Input",
};

const AsyncFormControl = loadable((props) => import(`./${props.component}`), {
  cacheKey: (props) => props.component,
});

export default function FormField({
  name,
  label,
  onChange,
  type,
  variant,
  themeKey,
  ...props
}) {
  const themeProps = getThemeProps({ themeKey, variant });
  const control = controls[type] || controls.default;
  const { layout, rest } = separateLayoutProps(props);
  const controlId = useRef(uniqueId("FIELD"));
  const labelId = useRef(uniqueId("FIELD"));

  const handleChange = useCallback(
    (value) => {
      console.log("FormField:handleChange", { name, value });
      if (typeof onChange === "function") {
        onChange({ name, value });
      }
    },
    [name, onChange]
  );

  function getLabelProps() {
    if (type === "listbox") {
      return {
        as: "span",
        id: labelId.current,
      };
    }

    return {
      htmlFor: controlId.current,
      id: labelId.current,
    };
  }

  return (
    <Container {...themeProps()} {...layout}>
      <Label {...themeProps("label")} {...getLabelProps()}>
        {label || name}
      </Label>
      <AsyncFormControl
        component={control}
        id={controlId.current}
        labelId={labelId.current}
        name={name}
        onChange={handleChange}
        type={type}
        {...themeProps(type)}
        {...rest}
      />
    </Container>
  );
}

FormField.defaultProps = defaultProps;
