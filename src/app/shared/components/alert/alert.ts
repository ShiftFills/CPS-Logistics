import { Component, input, output } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  imports: [],
  selector: 'app-alert',
  styleUrl: './alert.scss',
  templateUrl: './alert.html',
})
export class Alert {
    type = input<AlertType>('info');

  message = input<string>('');

  dismissible = input<boolean>(false);

  closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }
}
