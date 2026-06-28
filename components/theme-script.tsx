import { themeStorageKey } from "@/lib/theme";

export function ThemeScript() {
  const script = `
    (function () {
      try {
        var key = ${JSON.stringify(themeStorageKey)};
        var theme = localStorage.getItem(key);
        var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var resolved = theme === "dark" || (theme !== "light" && systemDark) ? "dark" : "light";
        document.documentElement.classList.toggle("dark", resolved === "dark");
        document.documentElement.style.colorScheme = resolved;
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
