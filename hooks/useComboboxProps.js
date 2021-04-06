import { createRef, useEffect, useMemo, useRef, useReducer } from "react";

import { handleKeyboardEvents, keys } from "../utils/keys";
import { composeEventHandlers } from "../utils/composeEventHandlers";
import { maybeProps, uniqueId } from "../utils/helpers";

const actions = {
  CLEAR: "CLEAR",
  DECREMENT: "DECREMENT",
  FOCUS: "FOCUS",
  BLUR: "BLUR",
  MOUSE_OVER: "MOUSE_OVER",
  INCREMENT: "INCREMENT",
  INPUT: "INPUT",
  SELECT: "SELECT",
};

export function useComboboxProps({
  filterOptions,
  id,
  onChange,
  options,
  selectedItem: controlledValue,
}) {
  const textboxRef = useRef();
  const textboxId = id;
  const fallbackTextboxId = useMemo(() => uniqueId("TEXTBOX"), []);

  const listboxRef = useRef();
  const listboxId = useMemo(() => uniqueId("LIST"), []);

  const optionRefs = useMemo(() => {
    return (options || []).map(() => createRef());
  }, [options]);

  const optionIds = useMemo(() => {
    return (options || []).map(() => uniqueId("OPTION"));
  }, [options]);

  const [state, dispatch] = useReducer(
    reducer,
    getInitialState({ controlledValue, options })
  );
  const {
    focusedItem,
    isExpanded,
    items,
    selectedIndex,
    selectedItem,
    value,
  } = state;

  const isClicking = useRef(false);
  const isMouseActive = useRef(false);

  function handleChange(option) {
    dispatch([actions.SELECT, { option }]);
    textboxRef.current.blur();
    if (typeof onChange === "function") {
      onChange(option);
    }
  }

  const filterItems = filterOptions || defaultFilterItems;

  function getContainerProps(props) {
    const { onMouseMove, ...rest } = props || {};

    const handleMouseMove = composeEventHandlers(
      onMouseMove,
      () => (isMouseActive.current = true)
    );

    return {
      ...rest,
      "aria-haspopup": "listbox",
      "aria-expanded": isExpanded,
      "aria-owns": listboxId,
      onMouseMove: handleMouseMove,
      role: "combobox",
    };
  }

  function getLabelProps(props) {
    return {
      ...(props || {}),
      htmlFor: textboxId || fallbackTextboxId,
    };
  }

  function getTextboxProps(props) {
    const { onBlur, onFocus, onInput, onKeyDown, ...rest } = props || {};

    const handleBlur = composeEventHandlers(onBlur, () => {
      if (!isClicking.current) {
        listboxRef.current.scrollTo(0, 0);
        dispatch([actions.BLUR]);
      }
    });

    const handleFocus = composeEventHandlers(onFocus, () => {
      dispatch([actions.FOCUS]);
    });

    const handleInput = composeEventHandlers(onInput, (event) => {
      const payload = {
        items: filterItems({ options, value: event.target.value }),
        value: event.target.value,
      };
      dispatch([actions.INPUT, payload]);
    });

    const handleKeyDown = composeEventHandlers(
      onKeyDown,
      () => (isMouseActive.current = false),
      handleKeyboardEvents({
        [keys.ESCAPE]: () => {
          if (value) {
            dispatch([actions.CLEAR, { items: options }]);
          } else {
            textboxRef.current.blur();
          }
        },
        [keys.ENTER]: () => handleChange(selectedItem),
        [keys.DOWN]: () => dispatch([actions.INCREMENT]),
        [keys.UP]: () => dispatch([actions.DECREMENT]),
      })
    );

    return {
      ...rest,
      ...maybeProps({
        "aria-activedescendant": optionIds[selectedIndex],
      }),
      "aria-autocomplete": "list",
      "aria-controls": listboxId,
      id: textboxId || fallbackTextboxId,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onInput: handleInput,
      onKeyDown: handleKeyDown,
      ref: textboxRef,
      value,
    };
  }

  function getListboxProps(props) {
    return {
      ...(props || {}),
      id: listboxId,
      role: "listbox",
      ref: listboxRef,
      tabIndex: -1,
    };
  }

  function getOptionProps(props) {
    const { option, onClick, onMouseDown, onMouseEnter, ...rest } = props || {};

    const handleClick = composeEventHandlers(onClick, () => {
      isClicking.current = false;
      handleChange(option);
    });

    const handleMouseDown = composeEventHandlers(onMouseDown, () => {
      isClicking.current = true;
    });

    const handleMouseEnter = composeEventHandlers(onMouseEnter, () => {
      if (isMouseActive.current) {
        dispatch([actions.MOUSE_OVER, { option }]);
      }
    });

    const index = items.indexOf(option);

    return {
      ...rest,
      ...maybeProps({
        "aria-selected": option === selectedItem,
        "data-focused": option === focusedItem,
      }),
      id: optionIds[index],
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      onMouseEnter: handleMouseEnter,
      ref: optionRefs[index],
      role: "option",
    };
  }

  useEffect(() => {
    const option = optionRefs[selectedIndex];
    if (option && option.current) {
      scrollIntoView(listboxRef.current, option.current);
    }
  }, [selectedIndex]);

  return {
    getContainerProps,
    getLabelProps,
    getListboxProps,
    getOptionProps,
    getTextboxProps,
    isExpanded,
    items,
    selectedIndex,
    selectedItem,
    value,
  };
}

function getInitialState({ controlledValue, options }) {
  return {
    autoComplete: undefined,
    selectedIndex: (options || []).indexOf(controlledValue),
    selectedItem: (options || []).includes(controlledValue)
      ? controlledValue
      : undefined,
    items: options || [],
    isExpanded: false,
    value: "",
  };
}

function reducer(state, [action, payload]) {
  switch (action) {
    case actions.CLEAR: {
      const { items } = payload;
      return { ...state, autoComplete: undefined, items, value: "" };
    }
    case actions.DECREMENT: {
      let index = state.selectedIndex - 1;
      if (index < 0) {
        index = state.items.length - 1;
      }

      return {
        ...state,
        autoComplete: undefined,
        focusedIndex: index,
        focusedItem: state.items[index],
        selectedIndex: index,
        selectedItem: state.items[index],
        value: state.items[index],
      };
    }
    case actions.FOCUS: {
      return {
        ...state,
        focusedIndex: state.selectedIndex,
        focusedItem: state.selectedItem,
        isExpanded: true,
      };
    }
    case actions.BLUR: {
      return {
        ...state,
        isExpanded: false,
        focusedIndex: -1,
        focusedItem: undefined,
      };
    }
    case actions.MOUSE_OVER: {
      const { option } = payload;
      return {
        ...state,
        focusedIndex: state.items.indexOf(option),
        focusedItem: option,
      };
    }
    case actions.INCREMENT: {
      let index = state.selectedIndex + 1;
      if (index > state.items.length - 1) {
        index = 0;
      }

      return {
        ...state,
        autoComplete: undefined,
        focusedIndex: index,
        focusedItem: state.items[index],
        selectedIndex: index,
        selectedItem: state.items[index],
        value: state.items[index],
      };
    }
    case actions.INPUT: {
      const { value, items } = payload;
      const autoComplete =
        value.length > state.value.length ? items[0] : undefined;

      return {
        ...state,
        autoComplete,
        focusedIndex: autoComplete ? 0 : -1,
        focusedItem: autoComplete,
        items,
        selectedIndex: autoComplete ? 0 : -1,
        selectedItem: autoComplete,
        value,
      };
    }
    case actions.SELECT: {
      const { option } = payload;
      const value = state.items.includes(option) ? option : undefined;
      const index = state.items.indexOf(option);
      return {
        ...state,
        autoComplete: undefined,
        focusedIndex: -1,
        focusedItem: undefined,
        isExpanded: false,
        selectedIndex: index >= 0 ? index : state.selectedIndex,
        selectedItem: value || state.selectedItem,
        value: value || state.selectedItem,
      };
    }
    default: {
      return state;
    }
  }
}

function defaultFilterItems({ options, value }) {
  if (!Array.isArray(options)) {
    return [];
  }

  const re = new RegExp(escapeRegex(value), "i");
  return options.filter((el) => re.test(el));
}

function escapeRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function scrollIntoView(parent, el) {
  const top = el.offsetTop;
  const height = el.offsetHeight;
  const scrollTop = parent.scrollTop;
  const parentHeight = parent.offsetHeight;
  let scrollTo;
  if (top < scrollTop) {
    scrollTo = top;
  } else if (top + height - scrollTop > parentHeight) {
    scrollTo = top + height - parentHeight;
  }

  if (!isNaN(scrollTo) && scrollTo >= 0) {
    requestAnimationFrame(() => {
      parent && parent.scrollTo(0, scrollTo);
    });
  }
}
