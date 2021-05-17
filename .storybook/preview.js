import { createElement, Fragment } from "react";
import { setup } from "goober";
import { prefix } from "goober/prefixer";
import { shouldForwardProp } from "goober/should-forward-prop";
import { ThemeProvider } from "@storybook/theming";

import { useTheme } from "../src/style";
import GlobalStyles from "../src/components/GlobalStyles";

import dummy from "../src/stories/dummy-content";

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
    <ThemeProvider
      theme={(theme) => {
        console.log({ theme });
        return theme;
      }}
    >
      <Fragment>
        <GlobalStyles />
        <Story />
      </Fragment>
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  dummy,
};
