import { forwardRef } from "react";

import { styled } from "style";
import { useMenuButtonProps } from "hooks/useMenuButtonProps";

import Icon from "components/Icon";
import Button from "components/Button";

const Container = styled("div")({
  position: "relative",
  display: "inline-block",
});

const StyledButton = styled(Button, forwardRef)({});

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

export default function MenuButton({ children, onChange, options, value }) {
  const {
    getButtonProps,
    getListboxProps,
    getOptionProps,
    isExpanded,
  } = useMenuButtonProps({
    onChange,
    options,
    selectedOption: value,
  });
  return (
    <Container>
      <StyledButton {...getButtonProps()}>
        {children}
        &emsp;
        <Icon icon={isExpanded ? "chevron-up" : "chevron-down"} />
      </StyledButton>
      <List {...getListboxProps()}>
        {options &&
          options.map((option) => (
            <Option key={option} {...getOptionProps({ option })}>
              {option}
            </Option>
          ))}
      </List>
    </Container>
  );
}
