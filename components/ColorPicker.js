import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

import checkerboard from "../assets/checkerboard.svg";
import { get, getThemeProps, styled } from "../style";
import { round } from "../utils/helpers";
import { handleKeyboardEvents, keys } from "../utils/keys";
import { Color } from "../utils/color";
import {
  useColorMode,
  useColorModes,
  useSetColorMode,
} from "../context/editor";

import DefaultFormField from "./FormField";

const defaultProps = {
  value: "#000000",
  variant: "default",
  themeKey: "forms.colorPicker",
};

const Container = styled(
  "div",
  forwardRef
)({
  display: "grid",
  gridTemplateColumns: "minmax(0px, max-content) minmax(0px, min-content)",
  gridTemplateAreas:
    "'sv-selector sv-selector' 'h-selector swatch' 'a-selector swatch' 'inputs inputs'",
  gridGap: "sm",
  justifyContent: "stretch",
  maxWidth: "formControl",
  padding: "sm",
  backgroundColor: "background",
  borderWidth: "1px",
  borderRadius: "sm",
});

const SVContainer = styled("div")({
  padding: "sm",
  margin: "-sm",
  overflow: "hidden",
  gridArea: "sv-selector",
});

const SVBox = styled("div")({
  position: "relative",
  width: "100%",
  height: "xs",
  background: "hsl(var(--h), 100%, 50%)",
  "&::before, &::after": {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    content: "''",
  },
  "&::before": {
    backgroundImage: "linear-gradient(to right, #ffffffff, #ffffff00)",
  },
  "&::after": {
    backgroundImage: "linear-gradient(to top, #000000ff, #00000000)",
  },
});

const SVReticle = styled("span")(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: "block",
  zIndex: 1,
  pointerEvents: "none",
  transform: `translate3d(var(--x), var(--y), 0)`,
  "&::after": {
    position: "absolute",
    top: "0",
    left: "0",
    width: `${get(theme, "space.sm")}px`,
    height: `${get(theme, "space.sm")}px`,
    transform: "translate(-50%, -50%)",
    border: "1px solid white",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px black",
    content: "''",
  },
}));

function getHueSelectorGradient() {
  const steps = 24;
  const interval = round(360 / steps);
  const stops = Array.from({ length: steps + 1 }, (v, i) => {
    return `hsl(${i * interval}, 100%, 50%) ${round((i / steps) * 100, 4)}%`;
  });
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

const RangeInput = styled("input")(({ theme }) => ({
  display: "block",
  height: `${get(theme, "space.md")}px`,
  WebkitAppearance: "none",
  "&::-webkit-slider-thumb": {
    WebkitAppearance: "none",
  },
  "&::-ms-track": {
    width: "100%",
    cursor: "pointer",
    background: "none",
    border: "none",
    color: "inherit",
  },
}));

const HRangeInput = styled(RangeInput)({
  gridArea: "h-selector",
  background: getHueSelectorGradient(),
});

const ARangeInput = styled(RangeInput)({
  gridArea: "a-selector",
  backgroundColor: "#fff",
  // prettier-ignore
  backgroundImage: `linear-gradient(to right, hsla(var(--h), var(--s), var(--l), 0), hsla(var(--h), var(--s), var(--l), 1)), url(${checkerboard})`,
});

const Swatch = styled("div")({
  position: "relative",
  width: "3em",
  height: "100%",
  gridArea: "swatch",
  backgroundImage: `url(${checkerboard})`,
  "&::after": {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "hsla(var(--h), var(--s), var(--l), var(--a))",
    content: "''",
  },
});

const InputsContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0px, 1fr))",
  gap: "inherit",
  gridArea: "inputs",
  maxWidth: "100%",
});

const FormField = styled(DefaultFormField)({
  display: "flex",
  flexFlow: "column-reverse nowrap",
  fontSize: "sm",
  textAlign: "center",
  "&[data-name='hex']": {
    gridColumn: "span 4",
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "normal",
  },
  "button, input": {
    paddingY: "xs",
    paddingX: "sm",
    textAlign: "inherit",
  },
});

const ColorPicker = forwardRef(
  ({ onChange, value: controlledValue, variant, themeKey, ...props }, ref) => {
    const [color, setColor] = useState(
      controlledValue instanceof Color
        ? controlledValue
        : new Color(controlledValue)
    );
    const value = useRef(controlledValue.toString());
    const [, update] = useState();
    const mode = useColorMode();
    const themeProps = getThemeProps({ themeKey, variant });

    useEffect(() => {
      if (value.current !== controlledValue.toString()) {
        value.current = controlledValue.toString();
        setColor(new Color(controlledValue));
      }
    }, [controlledValue]);

    const handleChange = useCallback(() => {
      const colorString = color.toString(mode);
      if (value.current !== colorString) {
        value.current = colorString;
        update(value.current);
        if (typeof onChange === "function") {
          onChange(value.current);
        }
      }
    }, [onChange, mode, color]);

    return (
      <Container
        ref={ref}
        style={{
          "--h": color.hsl.h,
          "--s": `${color.hsl.s}%`,
          "--l": `${color.hsl.l}%`,
          "--a": color.a,
        }}
        {...themeProps()}
        {...props}
      >
        <SaturationValueSelector color={color} onChange={handleChange} />
        <HueSelector color={color} onChange={handleChange} />
        <AlphaSelector color={color} onChange={handleChange} />
        <Swatch {...themeProps("swatch")} />
        <InputControls color={color} themeProps={themeProps} />
      </Container>
    );
  }
);

ColorPicker.defaultProps = defaultProps;

export default ColorPicker;

function SaturationValueSelector({ color, onChange }) {
  const raf = useRef();
  const [listeners] = useState(new Map());

  const handleMouseDown = useCallback(
    (event) => {
      const target = event.target;
      const { x, y } = getNormalizedCoordinates(event, target);
      color.set("hsv", { s: x, v: 100 - y });
      onChange();

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      listeners.set("mousemove", handleMouseMove);
      listeners.set("mouseup", handleMouseUp);

      function handleMouseMove(event) {
        if (raf.current) {
          cancelAnimationFrame(raf.current);
        }

        raf.current = requestAnimationFrame(() => {
          raf.current = undefined;
          const { x, y } = getNormalizedCoordinates(event, target);
          color.set("hsv", { s: x, v: 100 - y });
          onChange();
        });
      }

      function handleMouseUp() {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        listeners.delete("mousemove");
        listeners.delete("mouseup");
      }

      function getNormalizedCoordinates(event, target) {
        const rect = target.getBoundingClientRect();
        const x = Math.min(rect.right, Math.max(rect.left, event.clientX));
        const y = Math.min(rect.bottom, Math.max(rect.top, event.clientY));
        return {
          x: round(((x - rect.x) / rect.width) * 100, 2),
          y: round(((y - rect.y) / rect.height) * 100, 2),
        };
      }
    },
    [color, onChange]
  );

  const handleKeyDown = useCallback(
    handleKeyboardEvents({
      [keys.UP]: () => {
        color.set("hsv", { v: Math.min(100, color.hsv.v + 1) });
        onChange();
      },
      [keys.DOWN]: () => {
        color.set("hsv", { v: Math.max(0, color.hsv.v - 1) });
        onChange();
      },
      [keys.RIGHT]: () => {
        color.set("hsv", { s: Math.min(100, color.hsv.s + 1) });
        onChange();
      },
      [keys.LEFT]: () => {
        color.set("hsv", { s: Math.max(0, color.hsv.s - 1) });
        onChange();
      },
    }),
    [color]
  );

  useEffect(() => {
    return () => {
      listeners.forEach((listener, event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, [listeners]);

  function getReticleStyle() {
    return {
      style: {
        transform: `translate3d(${color.hsv.s}%, ${100 - color.hsv.v}%, 0)`,
      },
    };
  }

  return (
    <SVContainer>
      <SVBox
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        tabIndex="0"
      >
        <SVReticle {...getReticleStyle()} />
      </SVBox>
    </SVContainer>
  );
}

function HueSelector({ color, onChange }) {
  const raf = useRef();

  const handleChange = useCallback(
    ({ target }) => {
      const value = Number(target.value);

      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }

      raf.current = requestAnimationFrame(() => {
        raf.current = undefined;
        color.set("hsl", { h: value });
        onChange();
      });
    },
    [color, onChange]
  );

  return (
    <HRangeInput
      max="360"
      min="0"
      onChange={handleChange}
      step="1"
      type="range"
      value={color.hsl.h}
    />
  );
}

function AlphaSelector({ color, onChange, ...props }) {
  const raf = useRef();

  const handleChange = useCallback(
    ({ target }) => {
      const value = Number(target.value);

      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }

      raf.current = requestAnimationFrame(() => {
        raf.current = undefined;
        color.set("a", value);
        onChange();
      });
    },
    [color, onChange]
  );

  return (
    <ARangeInput
      max="1"
      min="0"
      onChange={handleChange}
      step="0.01"
      type="range"
      value={color.a}
      {...props}
    />
  );
}

function InputControls({ color, themeProps }) {
  const mode = useColorMode();
  const modes = useColorModes();
  const setMode = useSetColorMode();

  const handleModeChange = useCallback(
    ({ value }) => {
      console.log("InputControls.handleModeChange", { value });
      setMode(value);
    },
    [setMode]
  );

  const handleInputChange = useCallback(
    (next) => {
      let value = Number(next.value);
      if (mode === "hex") {
        value = next.value.replace(/^#+/, "");
      }

      color.set(mode, { [next.name]: value });
    },
    [mode]
  );

  function getFields(mode) {
    switch (mode) {
      case "rgb": {
        return [
          {
            name: "r",
            type: "number",
            min: 0,
            max: 255,
            step: 1,
            value: color.rgb.r,
          },
          {
            name: "g",
            type: "number",
            min: 0,
            max: 255,
            step: 1,
            value: color.rgb.g,
          },
          {
            name: "b",
            type: "number",
            min: 0,
            max: 255,
            step: 1,
            value: color.rgb.b,
          },
          {
            name: "a",
            type: "number",
            min: 0,
            max: 1,
            step: 0.01,
            value: color.a,
          },
        ];
      }
      case "hsl": {
        return [
          {
            name: "h",
            type: "number",
            min: 0,
            max: 360,
            step: 1,
            value: color.hsl.h,
          },
          {
            name: "s",
            type: "number",
            min: 0,
            max: 100,
            step: 1,
            value: color.hsl.s,
          },
          {
            name: "l",
            type: "number",
            min: 0,
            max: 100,
            step: 1,
            value: color.hsl.l,
          },
          {
            name: "a",
            type: "number",
            min: 0,
            max: 1,
            step: 0.01,
            value: color.a,
          },
        ];
      }
      case "hex": {
        return [{ name: "hex", type: "text", value: color.toString("hex") }];
      }
    }
  }

  return (
    <InputsContainer>
      {getFields(mode).map((field) => (
        <FormField
          data-name={field.name}
          key={field.name}
          onChange={handleInputChange}
          {...themeProps("field")}
          {...field}
        />
      ))}
      <FormField
        {...themeProps("field")}
        data-name="mode"
        name="mode"
        onChange={handleModeChange}
        options={modes}
        type="listbox"
        value={mode}
      />
    </InputsContainer>
  );
}
