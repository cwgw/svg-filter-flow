import { forwardRef } from "react";
import { useUID } from "react-uid";

import { styled } from "style";
import { useListboxProps } from "hooks/useListboxProps";

import DefaultButton from "components/Button";
import Icon from "components/Icon";

const defaultProps = {
  variant: "default",
  placeholder: "Select",
};

const Container = styled("div")({
  position: "relative",
  display: "block",
  width: "formControl",
  maxWidth: "100%",
});

const Button = styled(
  DefaultButton,
  forwardRef
)({
  display: "inline-flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  textAlign: "left",
});

const Placeholder = styled("span")({
  opacity: 0.5,
});

const List = styled(
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
  "[aria-expanded='false'] ~ &": {
    display: "none",
  },
  "[aria-expanded='true'] ~ &": {
    display: "block",
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
  "&:focus": {
    backgroundColor: "primary",
    color: "background",
    boxShadow: "none",
  },
});

export default function Listbox({
  labelId,
  onChange,
  options,
  placeholder,
  value,
}) {
  const buttonId = useUID();
  const {
    getButtonProps,
    getListboxProps,
    getOptionProps,
    isExpanded,
    selectedOption,
  } = useListboxProps({
    onChange,
    options: options || [],
    selectedOption: value,
  });

  return (
    <Container>
      <Button
        {...getButtonProps({
          "aria-labelledby": `${labelId} ${buttonId}`,
        })}
      >
        {selectedOption || <Placeholder>{placeholder}</Placeholder>}
        &emsp;
        <Icon icon={isExpanded ? "chevron-up" : "chevron-down"} />
      </Button>
      <List {...getListboxProps()}>
        {options &&
          options.map((option) => (
            <Option
              key={option}
              {...getOptionProps({
                children: option,
                option,
              })}
            />
          ))}
      </List>
    </Container>
  );
}

Listbox.defaultProps = defaultProps;
