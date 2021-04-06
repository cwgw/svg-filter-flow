import { createGlobalStyles } from "goober/global";

import { globalStyles, insertThemeValues } from "../style";

export default createGlobalStyles(({ theme }) =>
  insertThemeValues(theme, globalStyles)
);
