import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'taskflow-theme';
  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  // Temporary in-memory storage
  private tempStorage: Record<string, string> = {};
  private useMockStorage = true; // true to use mock (in-memory), false for real localStorage

  constructor() {
    const initialTheme = this.loadTheme();
    this.themeSubject = new BehaviorSubject<Theme>(initialTheme);
    this.theme$ = this.themeSubject.asObservable();

    this.applyTheme(initialTheme);
  }

  enableMockStorage(enable: boolean) {
    this.useMockStorage = enable;
  }

  private getItem(key: string): string | null {
    // Only use localStorage if in browser and not using mock storage
    if (!this.useMockStorage && typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return this.tempStorage[key] || null;
  }

  private setItem(key: string, value: string): void {
    if (!this.useMockStorage && typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    } else {
      this.tempStorage[key] = value;
    }
  }

  private loadTheme(): Theme {
    // Read from storage (mock or browser)
    const savedTheme = this.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

    // Browser check for system theme
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    this.setItem(this.THEME_KEY, theme);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return; // skip on server

    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }

  initSystemThemeListener(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme: Theme = e.matches ? 'dark' : 'light';

      // Only apply if user hasn't set a preference in localStorage
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.setTheme(systemTheme);
      }
    };

    darkModeQuery.addEventListener('change', handleChange);
  }
}
