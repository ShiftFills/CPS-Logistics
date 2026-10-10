import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-time-picker',
  styleUrl: './time-picker.scss',
  templateUrl: './time-picker.html',
})
export class TimePicker {
    label = input<string>('');

  value = input<string>('');

  min = input<string>('');

  max = input<string>('');

  step = input<number>(60);

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  valueChange = output<string>();

  onChange(event: Event): void {
    const timeInput = event.target as HTMLInputElement;

    this.valueChange.emit(timeInput.value);
  }
}
