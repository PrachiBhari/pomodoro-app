// src/lib/chartTheme.js
export function chartTheme() {
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const text = isDark ? "#e5e7eb" : "#374151";   // tailwind gray-200 vs gray-700
  const grid = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  return { text, grid };
}
