import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SearchBox } from '../search-box/search-box';

@Component({
  imports: [CommonModule,SearchBox],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();

  isDarkMode = false;

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
 onSearchChange(value: string): void {
    console.log('Header search:', value);

    // Later you can emit this to the parent
    // or connect it to your global search service.
  }
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}
