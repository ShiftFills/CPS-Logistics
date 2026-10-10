import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-radio',
  styleUrl: './radio.scss',
  templateUrl: './radio.html',
})
export class Radio {
   name = input.required<string>();

  label = input<string>('');

  value = input<string>('');

  selected = input<string>('');

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  selectedChange = output<string>();

  onChange(event: Event): void {
    const radio = event.target as HTMLInputElement;

    if (radio.checked) {
      this.selectedChange.emit(this.value());
    }
  }
}
