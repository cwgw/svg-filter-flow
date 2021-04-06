import { createRef, useEffect, useMemo, useReducer, useRef } from "react";

import { composeEventHandlers } from "../utils/composeEventHandlers";
import { maybeProps, uniqueId } from "../utils/helpers";
import { handleKeyboardEvents, keys } from "../utils/keys";

const actions = {
  BUTTON_CLICK: "BUTTON_CLICK",
  OPTION_CLICK: "OPTION_CLICK",
  BUTTON_KEY_DOWN: "BUTTON_KEY_DOWN",
  BUTTON_KEY_UP: "BUTTON_KEY_UP",
  DECREMENT: "DECREMENT",
  ESCAPE: "ESCAPE",
  FOCUS_OUT: "FOCUS_OUT",
  INCREMENT: "INCREMENT",
  MOUSE_OVER: "MOUSE_OVER",
  SELECT: "SELECT",
};

export function useMenuButtonProps({ onChange, options }) {
  const buttonRef = useRef();
  const listRef = useRef();
  const optionRefs = useMemo(() => (options || []).map(() => createRef()), [
    options,
  ]);
  const optionIds = useMemo(
    () => (options || []).map(() => uniqueId("OPTION")),
    [options]
  );
  const isMouseActive = useRef(false);
  const isClicking = useRef(false);
  const [state, dispatch] = useReducer(reducer, getInitialState({ options }));
  const { isExpanded, items, focusedIndex, focusedItem } = state;

  function handleChange(option) {
    dispatch([actions.SELECT, { option }]);
    if (typeof onChange === "function") {
      onChange(option);
    }
  }

  function getButtonProps(props) {
    const { onClick, onMouseDown, onKeyDown, ...rest } = props || {};

    const handleMouseDown = composeEventHandlers(onMouseDown, () => {
      isClicking.current = true;
    });

    const handleClick = composeEventHandlers(onClick, () => {
      isClicking.current = false;
      dispatch([actions.BUTTON_CLICK]);
    });

    const handleKeyDown = composeEventHandlers(
      onKeyDown,
      handleKeyboardEvents({
        [keys.UP]: () => dispatch([actions.DECREMENT]),
        [keys.DOWN]: () => dispatch([actions.INCREMENT]),
      })
    );
    return {
      ...rest,
      "aria-expanded": isExpanded,
      "aria-haspopup": "listbox",
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onMouseDown: handleMouseDown,
      ref: buttonRef,
    };
  }

  function getListboxProps(props) {
    const { onBlur, onMouseMove, ...rest } = props || {};

    const handleMouseMove = composeEventHandlers(
      onMouseMove,
      () => (isMouseActive.current = true)
    );

    const handleBlur = composeEventHandlers(onBlur, ({ relatedTarget }) => {
      const list = listRef && listRef.current;
      if (!isClicking.current && list && !list.contains(relatedTarget)) {
        dispatch([actions.FOCUS_OUT]);
      }
    });

    return {
      ...rest,
      ...maybeProps({
        "aria-activedescendant": optionIds[focusedIndex],
      }),
      onBlur: handleBlur,
      onMouseMove: handleMouseMove,
      ref: listRef,
      role: "listbox",
      tabIndex: -1,
    };
  }

  function getOptionProps(props) {
    const { onClick, onKeyDown, onMouseDown, onMouseOver, option, ...rest } =
      props || {};

    const handleClick = composeEventHandlers(onClick, () => {
      isClicking.current = false;
      handleChange(option);
    });

    const handleMouseDown = composeEventHandlers(
      onMouseDown,
      () => (isClicking.current = true)
    );

    const handleMouseOver = composeEventHandlers(onMouseOver, () => {
      if (isMouseActive.current) {
        dispatch([actions.MOUSE_OVER, { option }]);
      }
    });

    const handleKeyDown = composeEventHandlers(
      onKeyDown,
      () => (isMouseActive.current = false),
      handleKeyboardEvents({
        [keys.ESCAPE]: () => {
          const button = buttonRef && buttonRef.current;
          if (button) {
            button.focus();
          }
          dispatch([actions.ESCAPE]);
        },
        [keys.ENTER]: () => handleChange(focusedItem),
        [keys.DOWN]: () => dispatch([actions.INCREMENT]),
        [keys.UP]: () => dispatch([actions.DECREMENT]),
      })
    );

    const index = items.indexOf(option);
    return {
      ...rest,
      id: optionIds[index],
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onMouseDown: handleMouseDown,
      onMouseOver: handleMouseOver,
      ref: optionRefs[index],
      role: "option",
      tabIndex: option === focusedItem ? 0 : -1,
    };
  }

  useEffect(() => {
    if (isExpanded && optionRefs[focusedIndex]) {
      optionRefs[focusedIndex].current.focus();
    }
  }, [isExpanded, optionRefs, focusedIndex]);

  return {
    getButtonProps,
    getListboxProps,
    getOptionProps,
    isExpanded,
  };
}

function getInitialState({ options }) {
  return {
    isExpanded: false,
    focusedItem: undefined,
    focusedIndex: -1,
    items: options || [],
  };
}

function reducer(state, [action, payload]) {
  switch (action) {
    case actions.BUTTON_CLICK: {
      return {
        ...state,
        isExpanded: !state.isExpanded,
        focusedIndex: 0,
        focusedItem: state.items[0],
      };
    }
    case actions.DECREMENT: {
      let index = state.focusedIndex - 1;
      if (index < 0) {
        index = state.items.length - 1;
      }

      return {
        ...state,
        isExpanded: true,
        focusedIndex: index,
        focusedItem: state.items[index],
      };
    }
    case actions.ESCAPE: {
      return { ...state, isExpanded: false };
    }
    case actions.FOCUS_OUT: {
      return { ...state, isExpanded: false };
    }
    case actions.INCREMENT: {
      let index = state.focusedIndex + 1;
      if (index > state.items.length - 1) {
        index = 0;
      }

      return {
        ...state,
        isExpanded: true,
        focusedIndex: index,
        focusedItem: state.items[index],
      };
    }
    case actions.MOUSE_OVER: {
      const { option } = payload;
      return {
        ...state,
        focusedItem: option,
        focusedIndex: state.items.indexOf(option),
      };
    }
    case actions.SELECT: {
      const { option } = payload;
      return {
        ...state,
        isExpanded: false,
        focusedIndex: -1,
        focusedItem: undefined,
      };
    }
    default: {
      return state;
    }
  }
}
