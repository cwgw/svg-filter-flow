import { createElement, Fragment } from "react";
import { setup } from "goober";
import { prefix } from "goober/prefixer";
import { shouldForwardProp } from "goober/should-forward-prop";

import { useTheme } from "../style";
import GlobalStyles from "../components/GlobalStyles";

const noForward = ["as", "component", "labelId", "themeKey", "variant"];

setup(
  createElement,
  prefix,
  useTheme,
  shouldForwardProp((prop) => !noForward.includes(prop))
);

export default function App({ Component, pageProps }) {
  return (
    <Fragment>
      <GlobalStyles />
      <Component {...pageProps} />
    </Fragment>
  );
}
