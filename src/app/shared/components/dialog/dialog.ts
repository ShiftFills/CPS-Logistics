import { Component, HostListener, inject } from '@angular/core';
import { DialogService } from '../../../core/services/dialog';

@Component({
  imports: [],
  selector: 'app-dialog',
  styleUrl: './dialog.scss',
  templateUrl: './dialog.html',
})
export class Dialog {
    readonly dialogService = inject(DialogService);

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dialogService.cancel();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.dialogService.isOpen()) {
      this.dialogService.cancel();
    }
  }
}
