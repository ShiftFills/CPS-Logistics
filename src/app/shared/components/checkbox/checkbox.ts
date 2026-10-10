import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-checkbox',
  styleUrl: './checkbox.scss',
  templateUrl: './checkbox.html',
})
export class Checkbox {

   label = input<string>('');

  checked = input<boolean>(false);

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  checkedChange = output<boolean>();

  onChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    this.checkedChange.emit(checkbox.checked);
  }
}
