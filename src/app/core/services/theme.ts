// theme.service.ts or directly in your component
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());
    
    if (this.isDarkMode()) {
      document.body.setAttribute('data-theme', 'dark');
      // OR if using class-based theme:
      // document.body.classList.add('dark-theme');
    } else {
      document.body.removeAttribute('data-theme');
      // OR if using class-based theme:
      // document.body.classList.remove('dark-theme');
    }
  }
}