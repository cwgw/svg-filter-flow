import { forwardRef } from "react";

import { useComboboxProps } from "hooks/useComboboxProps";
import { useGetThemeProps, styled } from "style";

import Input from "components/Input";
import Icon from "components/Icon";

const defaultProps = {
  placeholder: "Select",
  variant: "default",
  themeKey: "forms.combobox",
};

const Container = styled("div")({
  position: "relative",
  display: "block",
  width: "formControl",
  maxWidth: "100%",
  "[data-icon]": {
    position: "absolute",
    top: "sm",
    right: "md",
    marginTop: "0.3em",
    pointerEvents: "none",
  },
});

const TextBox = styled(
  Input,
  forwardRef
)({
  position: "relative",
  width: "100%",
  paddingRight: "lg",
});

const ListBox = styled(
  "ul",
  forwardRef
)({
  position: "absolute",
  top: "100%",
  width: "100%",
  zIndex: "popup",
  maxHeight: "16em",
  marginTop: "xs",
  backgroundColor: "background",
  borderWidth: "1px",
  borderRadius: "sm",
  overflowX: "hidden",
  overflowY: "auto",
  "[aria-expanded='false'] &": {
    display: "none",
  },
  "&:empty": {
    paddingY: "lg",
  },
});

const Option = styled(
  "li",
  forwardRef
)({
  paddingY: "xs",
  paddingX: "md",
  userSelect: "none",
  "&[aria-selected]": {
    fontWeight: "bolder",
  },
  "&[data-focused]": {
    backgroundColor: "primary",
    color: "background",
  },
});

export default function Combobox({
  name,
  id,
  onChange,
  onInput,
  options,
  placeholder,
  themeKey,
  variant,
}) {
  const {
    getContainerProps,
    getTextboxProps,
    getListboxProps,
    getOptionProps,
    items,
    isExpanded,
  } = useComboboxProps({ id, onInput, onChange, options: options || [] });

  const getThemeProps = useGetThemeProps({ themeKey, variant });

  return (
    <Container {...getContainerProps()} {...getThemeProps()}>
      <TextBox
        {...getTextboxProps({ name, placeholder })}
        {...getThemeProps("textbox")}
      />
      <Icon icon={isExpanded ? "chevron-up" : "chevron-down"} />
      <ListBox {...getListboxProps()} {...getThemeProps("listbox")}>
        {items.map((option) => (
          <Option
            key={option}
            {...getOptionProps({ option })}
            {...getThemeProps("option")}
          >
            {option}
          </Option>
        ))}
      </ListBox>
    </Container>
  );
}

Combobox.defaultProps = defaultProps;
