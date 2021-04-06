export const keys = {
  ALT: "Alt",
  BACKSPACE: "Backspace",
  CTRL: "Control",
  DELETE: "Backspace",
  DOWN: "ArrowDown",
  END: "End",
  ENTER: "Enter",
  ESCAPE: "Escape",
  HOME: "Home",
  LEFT: "ArrowLeft",
  META: "Meta",
  PAGE_DOWN: "PageDown",
  PAGE_UP: "PageUp",
  RIGHT: "ArrowRight",
  SHIFT: "Shift",
  SPACE: " ",
  TAB: "Tab",
  UP: "ArrowUp",
};

export function handleKeyboardEvents(handlers) {
  return (event) => {
    console.log({ event });
    if (event.key in handlers) {
      event.preventDefault();
      handlers[event.key](event);
    }
  };
}
