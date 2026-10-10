import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-textarea',
  styleUrl: './textarea.scss',
  templateUrl: './textarea.html',
})
export class Textarea {
  label = input<string>('');

  placeholder = input<string>('');

  value = input<string>('');

  rows = input<number>(4);

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  readonly = input<boolean>(false);

  valueChange = output<string>();

  onInput(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement;

    this.valueChange.emit(textareaElement.value);
  }
}
