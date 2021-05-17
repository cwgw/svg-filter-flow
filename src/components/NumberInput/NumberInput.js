import { Fragment, useCallback, useEffect, useReducer } from "react";

import { styled } from "style";

import DefaultInput from "components/Input";
import DefaultIcon from "components/Icon";

const defaultProps = {
  step: 1,
  value: 0,
  withControls: true,
};

const Container = styled("div")({
  display: "grid",
  gridTemplateColumns: "minmax(0px, max-content) minmax(0px, min-content)",
  gridTemplateAreas: "'input increment' 'input decrement'",
  width: "formControl",
  maxWidth: "100%",
  borderWidth: "1px",
  borderRadius: "sm",
  backgroundColor: "background",
  overflow: "hidden",
  "&:focus-within": {
    boxShadow: "focus",
  },
});

const Input = styled(DefaultInput)({
  gridArea: "input",
  borderRadius: "none",
  border: "none",
  MozAppearance: "textfield",
  backgroundColor: "transparent",
  "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
  },
  "&:focus": {
    boxShadow: "none",
  },
});

const Button = styled("button")({
  display: "flex",
  justifyContent: "center",
  paddingX: "md",
  "&[name='increment']": {
    gridArea: "increment",
    alignItems: "end",
  },
  "&[name='decrement']": {
    gridArea: "decrement",
    alignItems: "start",
  },
});

const Icon = styled(DefaultIcon)({
  display: "block",
});

const actions = {
  DECREMENT: "DECREMENT",
  INCREMENT: "INCREMENT",
  INPUT: "INPUT",
  UPDATE: "UPDATE",
};

export default function NumberInput({
  id,
  max,
  min,
  name,
  onChange,
  step,
  value: controlledValue,
  withControls,
}) {
  const [{ value }, dispatch] = useReducer(reducer, {
    min,
    max,
    step,
    value: isNaN(controlledValue) ? "" : controlledValue,
  });

  useEffect(() => {
    if (typeof onChange === "function" && value !== controlledValue) {
      onChange(value);
    }
  }, [controlledValue, onChange, value]);

  useEffect(() => {
    dispatch([actions.UPDATE, controlledValue]);
  }, [controlledValue]);

  const handleInput = useCallback(({ target }) => {
    const value = Number(target.value);
    dispatch([actions.INPUT, value]);
  }, []);

  const handleIncrement = useCallback(() => {
    dispatch([actions.INCREMENT]);
  }, []);

  const handleDecrement = useCallback(() => {
    dispatch([actions.DECREMENT]);
  }, []);

  return (
    <Container>
      <Input
        id={id}
        max={max}
        min={min}
        name={name}
        onChange={handleInput}
        step={step}
        type="number"
        value={value}
      />
      {withControls && (
        <Fragment>
          <Button
            onClick={handleIncrement}
            name="increment"
            tabIndex={-1}
            type="button"
          >
            <Icon icon="chevron-up" />
          </Button>
          <Button
            onClick={handleDecrement}
            name="decrement"
            tabIndex={-1}
            type="button"
          >
            <Icon icon="chevron-down" />
          </Button>
        </Fragment>
      )}
    </Container>
  );
}

function reducer(state, [action, payload]) {
  switch (action) {
    case actions.DECREMENT: {
      if (state.value === state.min) {
        return state;
      }

      return { ...state, value: state.value - state.step };
    }
    case actions.INCREMENT: {
      if (state.value === state.max) {
        return state;
      }

      return { ...state, value: state.value + state.step };
    }
    case actions.INPUT: {
      const value = payload;
      return { ...state, value };
    }
    case actions.UPDATE: {
      const value = payload;
      if (state.value === value) {
        return state;
      }

      return { ...state, value };
    }
    default: {
      return state;
    }
  }
}

NumberInput.defaultProps = defaultProps;
