"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted/20 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/20 hover:bg-muted/40 transition-all border border-white/5 cursor-pointer text-foreground"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <LightModeIcon className="w-5 h-5" />
      ) : (
        <DarkModeIcon className="w-5 h-5" />
      )}
    </button>
  );
}
