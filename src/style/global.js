import { createGlobalStyles } from "goober/global";

import { css } from "./css";

export const globalStyles = {
  "*, *::before, *::after": {
    boxSizing: "border-box",
    borderStyle: "solid",
    borderWidth: "0px",
    borderColor: "currentColor",
  },
  "*:focus": {
    outline: "none",
    boxShadow: "focus",
  },
  html: {
    backgroundColor: "background",
    // prettier-ignore
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    lineHeight: 1.5,
    WebkitTextSizeAdjust: "100%",
  },
  body: {
    margin: 0,
    color: "text",
    fontFamily: "inherit",
    lineHeight: "inherit",
  },
  "button, input, optgroup, select, textarea": {
    margin: 0,
    padding: 0,
    fontFamily: "inherit",
    fontSize: "100%",
    lineHeight: "inherit",
    color: "inherit",
  },
  "button, select": {
    textTransform: "none",
  },
  "button, [type='button'], [type='reset'], [type='submit']": {
    WebkitAppearance: "button",
  },
  "button, [role='button']": {
    cursor: "pointer",
  },
  button: {
    backgroundColor: "transparent",
    backgroundImage: "none",
  },
  "::-moz-focus-inner": {
    borderStyle: "none",
    padding: 0,
  },
  ":-moz-ui-invalid": {
    boxShadow: "none",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontSize: "inherit",
    fontWeight: "inherit",
  },
  "blockquote, dd, dl, figure, h1, h2, h3, h4, h5, h6, hr, p, pre": {
    margin: 0,
  },
  "ol, ul": {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  a: {
    color: "inherit",
    textDecoration: "inherit",
  },
  "audio, canvas, embed, iframe, img, object, svg, video": {
    display: "block",
    verticalAlign: "middle",
  },
};

export const Global = createGlobalStyles((props) =>
  css(globalStyles, true)(props.theme)
);
