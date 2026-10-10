import { Component, input, output } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  imports: [],
  selector: 'app-breadcrumb',
  styleUrl: './breadcrumb.scss',
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  items = input<BreadcrumbItem[]>([]);

  itemClicked = output<BreadcrumbItem>();

  onItemClick(item: BreadcrumbItem): void {
    this.itemClicked.emit(item);
  }
}
