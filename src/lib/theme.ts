/**
 * Dark & Light Theme Engineering Standard Helper (`theme-mode-standard`)
 * - 3-State Theme Mode ('auto' | 'light' | 'dark') with 'auto' as Default
 * - Dual DOM Sync (<html> + <body>) with class (.dark/.light) and data-theme
 * - Single Source of Truth from DOM classList
 * - Mobile Auto-Dark Prevention (color-scheme: only light)
 * - Ecosystem key synchronization ('theme', 'stock_theme', 'alpha_theme')
 */

export type ThemeMode = 'auto' | 'light' | 'dark';
export type ResolvedTheme = 'dark' | 'light';

export const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = localStorage.getItem('theme') || localStorage.getItem('stock_theme') || localStorage.getItem('alpha_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved as ThemeMode;
    return 'auto';
  } catch {
    return 'auto';
  }
};

export const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (mode === 'auto') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }
  return mode;
};

export const applyThemeToDom = (mode: ThemeMode, persist = true) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  const resolved = resolveTheme(mode);
  const isDark = resolved === 'dark';

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
    root.setAttribute('data-theme', 'dark');
    if (body) {
      body.classList.add('dark');
      body.classList.remove('light');
      body.setAttribute('data-theme', 'dark');
    }
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'only light';
    root.setAttribute('data-theme', 'light');
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
      body.setAttribute('data-theme', 'light');
    }
  }

  // Mobile address bar theme color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', isDark ? '#09090b' : '#f4f5f7');
  }

  if (persist && typeof window !== 'undefined') {
    try {
      localStorage.setItem('theme', mode);
      localStorage.setItem('stock_theme', mode);
      localStorage.setItem('alpha_theme', mode);
    } catch {
      // Ignore storage quota exceptions
    }
  }
};

/**
 * Toggle theme using DOM classList as the Single Source of Truth
 */
export const toggleTheme = (): ResolvedTheme => {
  if (typeof document === 'undefined') return 'dark';
  const isDomDark = document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark';

  const nextTheme: ResolvedTheme = isDomDark ? 'light' : 'dark';
  applyThemeToDom(nextTheme, true);
  return nextTheme;
};
