import { forwardRef } from "react";

import { styled } from "style";

const defaultProps = {
  variant: "default",
  themeKey: "forms.input",
  type: "text",
};

const Input = styled(
  "input",
  forwardRef
)({
  display: "block",
  width: "formControl",
  maxWidth: "100%",
  backgroundColor: "background",
  borderWidth: "1px",
  borderRadius: "sm",
});

Input.defaultProps = defaultProps;

export default Input;
