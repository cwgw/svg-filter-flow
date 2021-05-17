import { forwardRef } from "react";
import loadable from "@loadable/component";

import { styled } from "style";

const StyledIcon = styled(
  "span",
  forwardRef
)({
  display: "inline-block",
  height: "1em",
  width: "1em",
  verticalAlign: "-0.15em",
  fontSize: "inherit",
  color: "inherit",
  "& *": {
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke",
  },
  "&:not([data-icon])": {
    backgroundColor: "currentColor",
    borderRadius: "0.5em",
    opacity: 0.075,
  },
});

const AsyncIcon = loadable(
  (props) => import(`react-feather/dist/icons/${props["data-icon"]}`),
  {
    cacheKey: (props) => props["data-icon"],
    fallback: <StyledIcon />,
  }
);

export default function Icon({ icon, className }) {
  return (
    <StyledIcon
      className={className}
      aria-hidden={true}
      data-icon={icon}
      as={AsyncIcon}
    />
  );
}
