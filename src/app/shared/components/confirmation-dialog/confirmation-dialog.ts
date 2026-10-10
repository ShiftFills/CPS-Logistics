import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-confirmation-dialog',
  styleUrl: './confirmation-dialog.scss',
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  open = input<boolean>(false);

  title = input<string>('Confirm Action');

  message = input<string>('Are you sure you want to continue?');

  confirmText = input<string>('Confirm');

  cancelText = input<string>('Cancel');

  confirmButtonClass = input<'primary' | 'danger'>('primary');

  closeOnBackdrop = input<boolean>(false);

  confirmed = output<void>();

  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.cancelled.emit();
    }
  }
}
