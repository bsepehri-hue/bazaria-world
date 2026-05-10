import { useTheme } from "./useTheme";

export function useThemeToggle() {
  const { isDark, setIsDark } = useTheme();

  function toggleTheme() {
    setIsDark(!isDark);
  }

  return {
    isDark,
    toggleTheme,
  };
}