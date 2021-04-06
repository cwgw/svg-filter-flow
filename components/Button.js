import { forwardRef } from "react";

import { styled } from "../style";

const defaultProps = {
  type: "button",
};

const Button = styled(
  "button",
  forwardRef
)({
  paddingY: "sm",
  paddingX: "md",
  borderWidth: "1px",
  borderRadius: "3px",
  backgroundColor: "white",
  color: "text",
  "&:active:not([disabled])": {
    transform: "translate(0, 1px)",
  },
  "&[disabled]": {
    backgroundColor: "gray.200",
    color: "gray.500",
    cursor: "default",
  },
});

Button.defaultProps = defaultProps;

export default Button;
