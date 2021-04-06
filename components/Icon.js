import { forwardRef } from "react";
import { styled } from "../style";
import loadable from "@loadable/component";
import { keyframes } from "goober";

const pulse = keyframes({
  from: { opacity: 0 },
  to: { opacity: 0.075 },
});

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
    animation: `1s linear infinite alternate ${pulse}`,
    backgroundColor: "currentColor",
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
