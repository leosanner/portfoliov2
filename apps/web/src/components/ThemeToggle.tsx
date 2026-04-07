import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      className={`group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-outline-variant/60 bg-surface-container-low text-on-surface-variant transition-all duration-300 hover:border-primary/60 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-500 ${
          isDark
            ? "translate-y-6 rotate-90 opacity-0"
            : "translate-y-0 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-500 ${
          isDark
            ? "translate-y-0 rotate-0 opacity-100"
            : "-translate-y-6 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
