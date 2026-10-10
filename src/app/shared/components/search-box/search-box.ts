import { Component, input, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-search-box',
  styleUrl: './search-box.scss',
  templateUrl: './search-box.html',
})
export class SearchBox {
 placeholder = input<string>('Search leads, customers, vehic...');

  disabled = input<boolean>(false);

  width = input<string>('360px');

  height = input<string>('40px');

  searchChange = output<string>();

  value = signal('');

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.value.set(inputElement.value);

    this.searchChange.emit(inputElement.value);
  }

  clearSearch(): void {
    this.value.set('');

    this.searchChange.emit('');
  }
}
