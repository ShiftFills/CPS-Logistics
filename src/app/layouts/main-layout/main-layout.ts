import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Toast } from '../../shared/components/toast/toast';
import { Dialog } from '../../shared/components/dialog/dialog';

@Component({
  imports: [CommonModule,RouterOutlet, Sidebar, Header,Toast,Dialog],
  selector: 'app-main-layout',
  styleUrl: './main-layout.scss',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
