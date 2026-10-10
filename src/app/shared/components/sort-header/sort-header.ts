import { Component, input, output } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';

@Component({
  imports: [],
  selector: 'app-sort-header',
  styleUrl: './sort-header.scss',
  templateUrl: './sort-header.html',
})
export class SortHeader {
  label = input<string>('');

  direction = input<SortDirection>('');
  iconStyle = input<'default' | 'dashboard'>('default');

  sortChange = output<SortDirection>();

  onSort(): void {
    const currentDirection = this.direction();
    console.log('Current Direction:', currentDirection);
    let newDirection: SortDirection;

    if (currentDirection === '') {
      newDirection = 'asc';
    } else if (currentDirection === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = '';
    }

    this.sortChange.emit(newDirection);
  }
}
