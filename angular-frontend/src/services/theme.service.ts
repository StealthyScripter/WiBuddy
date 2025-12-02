import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'taskflow-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());

  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  /**
   * Load theme from localStorage or system preference
   */
  private loadTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }

  /**
   * Listen for system theme changes
   */
  initSystemThemeListener(): void {
    if (!window.matchMedia) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';

      // Only apply if user hasn't set a preference
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.setTheme(systemTheme);
      }
    };

    darkModeQuery.addEventListener('change', handleChange);
  }
}
