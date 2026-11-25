import { useState } from 'react';

export const THEME_COOKIE = 'theme';
export const DARK_THEME = 'business';
export const LIGHT_THEME = 'corporate';
export type Theme = typeof DARK_THEME | typeof LIGHT_THEME;

export const parseTheme = (value?: string | null): Theme =>
  value === LIGHT_THEME ? LIGHT_THEME : DARK_THEME;

export default function ThemeToggle({
  initialTheme,
}: {
  initialTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const isDark = theme === DARK_THEME;

  const toggle = () => {
    const next = isDark ? LIGHT_THEME : DARK_THEME;
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    // persist for a year so the server renders the right theme on load
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <button
      type="button"
      className="btn btn-ghost btn-square"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
    >
      {isDark ? (
        // sun
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // moon
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
