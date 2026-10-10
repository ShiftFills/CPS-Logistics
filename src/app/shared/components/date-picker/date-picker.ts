import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-date-picker',
  styleUrl: './date-picker.scss',
  templateUrl: './date-picker.html',
})
export class DatePicker {
   label = input<string>('');
  error = input<string>('');
  value = input<string>('');

  min = input<string>('');

  max = input<string>('');

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  valueChange = output<string>();

  onChange(event: Event): void {
    const dateInput = event.target as HTMLInputElement;

    this.valueChange.emit(dateInput.value);
  }
}
