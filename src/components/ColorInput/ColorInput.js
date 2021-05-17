import { forwardRef, useCallback, useRef, useState } from "react";

import { Color, formatColorString, parseColorString } from "utils/color";
import { handleKeyboardEvents, keys } from "utils/keys";
import { styled } from "style";
import { useColorMode, useToggleColorMode } from "state/editor";

import DefaultColorPicker from "components/ColorPicker/ColorPicker";
import DefaultButton from "components/Button";
import DefaultInput from "components/Input";

const defaultProps = {
  value: "#000000",
};

const Wrapper = styled("div")({
  position: "relative",
  display: "block",
  width: "formControl",
  maxWidth: "100%",
});

const Container = styled("div")({
  display: "flex",
  alignItems: "stretch",
  width: "100%",
  borderRadius: "sm",
  "&:focus-within": {
    boxShadow: "0 0 0 3px lightgray",
  },
});

const Button = styled(DefaultButton)({
  position: "relative",
  width: "4em",
  padding: "inherit",
  borderRightRadius: 0,
  "&:active": {
    transform: "none",
  },
  "&:focus": {
    zIndex: 1,
  },
});

const Input = styled(DefaultInput)({
  position: "relative",
  width: "100%",
  marginLeft: "-1px",
  borderLeftRadius: 0,
  "&:focus": {
    zIndex: 1,
  },
});

const ColorPicker = styled(
  DefaultColorPicker,
  forwardRef
)({
  position: "absolute",
  top: "100%",
  left: 0,
  marginTop: "xs",
  zIndex: "popup",
  "&[aria-hidden]": {
    display: "none",
  },
});

export default function ColorInput({
  id,
  name,
  onChange,
  value: controlledValue,
}) {
  const mode = useColorMode();
  const toggleColorMode = useToggleColorMode();
  const [isExpanded, setExpanded] = useState(false);
  const [color] = useState(new Color(controlledValue));
  const [value, setValue] = useState(formatColorString(controlledValue, mode));
  const colorPickerRef = useRef();

  const handleClick = useCallback(
    (event) => {
      if (event.shiftKey) {
        const mode = toggleColorMode();
        setValue(color.toString(mode));
      } else {
        setExpanded((prev) => !prev);
      }
    },
    [color, setExpanded, setValue, toggleColorMode]
  );

  const handleChange = useCallback(
    (value) => {
      setValue(value);
      if (typeof onChange === "function") {
        onChange(value);
      }
    },
    [onChange, setValue]
  );

  const handleInput = useCallback(
    ({ target }) => {
      setValue(target.value);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    ({ target }) => {
      const value = parseColorString(target.value);
      if (value) {
        const formattedColor = formatColorString(value, mode);
        setValue(formattedColor);
        handleChange(formattedColor);
      } else {
        setValue(color.toString(mode));
      }
    },
    [color, handleChange, mode, setValue]
  );

  const handleKeyDown = useCallback(
    (event) => {
      handleKeyboardEvents({
        [keys.ENTER]: ({ target }) => {
          const value = parseColorString(target.value);
          if (value) {
            const formattedColor = formatColorString(value, mode);
            handleChange(formattedColor);
          }
        },
        [keys.ESCAPE]: ({ target }) => {
          if (target.value) {
            setValue("");
          } else {
            target.blur();
            setValue(color.toString(mode));
          }
        },
      })(event);
    },
    [color, handleChange, mode, setValue]
  );

  const handleFocus = useCallback(({ target }) => {
    target.setSelectionRange(0, target.value.length);
  }, []);

  return (
    <Wrapper>
      <Container>
        <Button
          aria-expanded={isExpanded}
          aria-haspopup={true}
          onClick={handleClick}
          style={{ backgroundColor: color.toString("rgb") }}
        />
        <Input
          id={id}
          name={name}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          value={value}
        />
      </Container>
      <ColorPicker
        aria-hidden={isExpanded || undefined}
        onChange={handleChange}
        ref={colorPickerRef}
        value={color}
      />
    </Wrapper>
  );
}

ColorInput.defaultProps = defaultProps;
