import loadable from "@loadable/component";
import { useCallback } from "react";
import { useUIDSeed } from "react-uid";

import { styled, useGetParentProps, useGetThemeProps } from "style";

import Label from "components/Label";

const defaultProps = {
  themeKey: "forms.field",
  variant: "default",
};

const Container = styled("div")({});

const Skeleton = styled("span")({
  display: "block",
  width: "formControl",
  maxWidth: "100%",
  height: "1.5em",
  paddingY: "sm",
  boxSizing: "content-box",
  backgroundColor: "currentColor",
  borderColor: "currentColor",
  borderWidth: "1px",
  borderRadius: "sm",
  fontSize: "inherit",
  opacity: 0.075,
});

const controls = {
  color: "ColorInput",
  combobox: "Combobox",
  listbox: "Listbox",
  number: "NumberInput",
  text: "Input",
  default: "Input",
};

const AsyncFormControl = loadable(
  (props) => import(`components/${props.component}`),
  {
    cacheKey: (props) => props.component,
    fallback: <Skeleton />,
  }
);

export default function FormField({
  name,
  label,
  onChange,
  type,
  variant,
  themeKey,
  ...props
}) {
  const getThemeProps = useGetThemeProps({ themeKey, variant });
  const control = controls[type] || controls.default;
  const { parentProps, ...rest } = useGetParentProps(props);
  const seed = useUIDSeed();
  const controlId = seed("CONTROL");
  const labelId = seed("LABEL");

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
        id: labelId,
      };
    }

    return {
      htmlFor: controlId,
      id: labelId,
    };
  }

  return (
    <Container {...getThemeProps()} {...parentProps}>
      <Label {...getThemeProps("label")} {...getLabelProps()}>
        {label || name}
      </Label>
      <AsyncFormControl
        component={control}
        id={controlId}
        labelId={labelId}
        name={name}
        onChange={handleChange}
        type={type}
        {...getThemeProps(type)}
        {...rest}
      />
    </Container>
  );
}

FormField.defaultProps = defaultProps;
