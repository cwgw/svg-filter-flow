import { createElement, Fragment } from "react";
import { setup } from "goober";
import { prefix } from "goober/prefixer";
import { shouldForwardProp } from "goober/should-forward-prop";

import { useTheme } from "../style";
import GlobalStyles from "../components/GlobalStyles";

import dummy from "../stories/dummy-content";

setup(
  createElement,
  prefix,
  useTheme,
  shouldForwardProp(
    (prop) => prop !== "themeKey" && prop !== "variant" && prop !== "as"
  )
);

export const decorators = [
  (Story) => (
    <Fragment>
      <GlobalStyles />
      <Story />
    </Fragment>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  dummy,
};
