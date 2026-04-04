"use client";

import { useEffect } from "react";
import { DEFAULT_COLOR_THEME, DEFAULT_UI_THEME, readStoredTheme } from "@/lib/utils/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { colorTheme, uiTheme } = readStoredTheme();
    document.documentElement.setAttribute("data-color-theme", colorTheme || DEFAULT_COLOR_THEME);
    document.documentElement.setAttribute("data-theme", uiTheme || DEFAULT_UI_THEME);
  }, []);

  return <>{children}</>;
}
