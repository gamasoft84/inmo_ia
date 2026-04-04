export const DEFAULT_COLOR_THEME = "amber";
export const DEFAULT_UI_THEME = "light";

export function applyTheme(theme: string) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-color-theme", theme || DEFAULT_COLOR_THEME);
  window.localStorage.setItem("inmoia-color-theme", theme || DEFAULT_COLOR_THEME);
}

export function applyDarkMode(dark: boolean) {
  if (typeof document === "undefined") return;
  const resolved = dark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", resolved);
  window.localStorage.setItem("inmoia-dark-mode", String(dark));
}

export function readStoredTheme() {
  if (typeof window === "undefined") {
    return {
      colorTheme: DEFAULT_COLOR_THEME,
      uiTheme: DEFAULT_UI_THEME,
    };
  }

  const colorTheme = window.localStorage.getItem("inmoia-color-theme") || DEFAULT_COLOR_THEME;
  const darkModeRaw = window.localStorage.getItem("inmoia-dark-mode");
  const uiTheme = darkModeRaw === "true" ? "dark" : DEFAULT_UI_THEME;

  return { colorTheme, uiTheme };
}
