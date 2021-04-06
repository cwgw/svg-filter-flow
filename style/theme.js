import { createContext, useContext } from "react";
import * as variants from "./variants";
import * as tokens from "./tokens";

export const theme = {
  ...tokens,
  variants,
};

export const ThemeContext = createContext(theme);

export function useTheme() {
  const theme = useContext(ThemeContext);
  return theme;
}
