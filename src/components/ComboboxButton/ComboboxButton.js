import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

import { get, styled } from "style";
import { useComboboxProps } from "hooks/useComboboxProps";

import Input from "components/Input";
import Icon from "components/Icon";

const defaultProps = {
  position: "bottom right",
  variant: "default",
};

const WrapperOuter = styled(
  "div",
  forwardRef
)({
  "--transition-duration": "200ms",
  "--transition-timing-function": "cubic-bezier(0.25, 0, 0.25, 1)",
  position: "relative",
  display: "flex",
  maxWidth: "xs",
  alignItems: "stretch",
});

const WrapperInner = styled(
  "div",
  forwardRef
)({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexFlow: "column nowrap",
  width: "100%",
  height: "100%",
  backgroundColor: "background",
  borderWidth: "1px",
  borderRadius: "sm",
  transition: "var(--transition-duration) var(--transition-timing-function)",
  transitionProperty: "width, height",
  overflow: "hidden",
  "&:focus-within": {
    boxShadow: "focus",
  },
  "[data-expanded] &": {
    width: "formControl",
    height: "16em",
  },
  "[data-expanded] &, [data-transitioning] &": {
    position: "absolute",
    zIndex: "popup",
  },
  "&[data-listbox-position-y='top']": {
    bottom: 0,
    flexDirection: "column-reverse",
  },
  "&[data-listbox-position-y='bottom']": {
    top: 0,
  },
  "&[data-listbox-position-x='left']": {
    right: 0,
  },
  "&[data-listbox-position-x='right']": {
    left: 0,
  },
});

const Container = styled("div")({
  display: "contents",
});

const Label = styled("label")({
  display: "flex",
  flexFlow: "row nowrap",
  alignItems: "center",
  justifyContent: "space-between",
  paddingY: "sm",
  paddingX: "md",
  cursor: "pointer",
  userSelect: "none",
  transform: "scale3d(1, 1, 1)",
  transformOrigin: "left top",
  transition: "var(--transition-duration) var(--transition-timing-function)",
  transitionProperty: "opacity, transform",
  "[data-expanded] &": {
    transform: "scale3d(0.8, 0.8, 1)",
    opacity: 0.5,
  },
  "[data-listbox-position-y='top'] &": {
    order: 2,
  },
  "[data-icon]": {
    transition: "inherit",
    transitionDelay: "200ms",
  },
  "[data-expanded] & [data-icon]:last-of-type": {
    transition: "none",
    opacity: 0,
  },
});

const TextBox = styled(
  Input,
  forwardRef
)(({ theme }) => ({
  position: "relative",
  order: 1,
  width: "100%",
  paddingX: "md",
  backgroundColor: "transparent",
  borderWidth: 0,
  borderRadius: 0,
  transition: "var(--transition-duration) var(--transition-timing-function)",
  transitionProperty: "opacity, height",
  opacity: 0,
  height: "0px",
  "[data-expanded] &": {
    height: `calc(${get(theme, "space.sm")}px + 1.5em)`,
    bottom: "sm",
    opacity: 1,
  },
  "&:focus": {
    boxShadow: "none",
  },
}));

const ListBox = styled(
  "ul",
  forwardRef
)({
  order: 3,
  width: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  display: "none",
  opacity: 0,
  transition:
    "opacity var(--transition-duration) var(--transition-timing-function)",
  "[data-expanded] &": {
    opacity: 1,
  },
  "[data-expanded] &, [data-transitioning] &": {
    display: "block",
  },
  "[data-listbox-position-y='top'] &": {
    borderBottomWidth: "1px",
  },
  "[data-listbox-position-y='bottom'] &": {
    borderTopWidth: "1px",
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

export default function ComboboxButton({
  label,
  name,
  onChange,
  onInput,
  options,
  position,
  variant,
}) {
  const ref = useRef();
  const wrapperStyle = useRef({});
  const [isTransitioning, setTransitioning] = useState(false);

  const {
    getLabelProps,
    getContainerProps,
    getTextboxProps,
    getListboxProps,
    getOptionProps,
    items,
    isExpanded,
  } = useComboboxProps({ onInput, onChange, options });

  function style(component) {
    return {
      themeKey: `combobox.${variant}`,
      variant: component,
    };
  }

  useEffect(() => {
    if (ref.current) {
      const target = ref.current;
      target.addEventListener("transitionend", handleTransitionEnd);

      return () => {
        target.removeEventListener("transitionend", handleTransitionEnd);
      };
    }

    function handleTransitionEnd(event) {
      if (ref.current && event.target === ref.current.firstChild) {
        if (!ref.current.dataset.expanded) {
          wrapperStyle.current = {};
        }
        setTransitioning(false);
      }
    }
  }, [setTransitioning]);

  const onFocus = useCallback(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      wrapperStyle.current = {
        width: `${Math.ceil(width)}px`,
        height: `${Math.ceil(height)}px`,
      };
      setTransitioning(true);
    }
  }, [setTransitioning]);

  const onBlur = useCallback(() => {
    if (ref.current) {
      setTransitioning(true);
    }
  }, [setTransitioning]);

  return (
    <WrapperOuter
      data-expanded={isExpanded || undefined}
      data-transitioning={isTransitioning || undefined}
      style={wrapperStyle.current}
      ref={ref}
      {...style("wrapper")}
    >
      <WrapperInner {...getPosition(position)}>
        <Label {...getLabelProps()} {...style("label")}>
          {label}
          &emsp;
          <Icon icon="chevron-down" />
        </Label>
        <Container {...getContainerProps()} {...style("container")}>
          <TextBox
            {...getTextboxProps({ name, onBlur, onFocus })}
            {...style("textbox")}
            size={isExpanded ? null : label && label.length}
          />
          <ListBox {...getListboxProps()} {...style("listbox")}>
            {items.map((option) => (
              <Option
                key={option}
                {...getOptionProps({ option })}
                {...style("option")}
              >
                {option}
              </Option>
            ))}
          </ListBox>
        </Container>
      </WrapperInner>
    </WrapperOuter>
  );
}

ComboboxButton.defaultProps = defaultProps;

function getPosition(position) {
  return position
    .toLowerCase()
    .split(/\s/g)
    .reduce((acc, side) => {
      if (side === "left" || side === "right") {
        acc["data-listbox-position-x"] = side;
      }

      if (side === "top" || side === "bottom") {
        acc["data-listbox-position-y"] = side;
      }

      return acc;
    }, {});
}
