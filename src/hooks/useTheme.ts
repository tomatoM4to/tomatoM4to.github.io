import { ThemeContext } from "@src/context/Theme";
import { useContext } from "react";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(`useTheme must be used within a ThemeProvider`);
  }

  return context;
}