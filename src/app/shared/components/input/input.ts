import { Component, input, output } from '@angular/core';

import {
  Label,
  LabelPosition
} from '../label/label';

@Component({
  imports: [Label],
  selector: 'app-input',
  styleUrl: './input.scss',
  templateUrl: './input.html',
})
export class Input {

  label = input<string>('');
    error = input<string>('');
  icon = input<string>('');

  labelPosition = input<LabelPosition>('top');

  placeholder = input<string>('');

  passwordToggle = input<boolean>(false);

  type = input<'text' | 'email' | 'password' | 'number'>('text');

  value = input<string>('');

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  valueChange = output<string>();

  // Password visibility
  showPassword = false;

  onInput(event: Event): void {

    const inputElement =
      event.target as HTMLInputElement;

    this.valueChange.emit(inputElement.value);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}