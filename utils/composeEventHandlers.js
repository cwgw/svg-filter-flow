export function composeEventHandlers(...fns) {
  return (event, ...args) => {
    return fns.some((fn) => {
      if (fn) {
        fn(event, ...args);
      }

      return event && event.defaultPrevented;
    });
  };
}
