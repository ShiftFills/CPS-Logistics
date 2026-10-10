import { Injectable, signal } from '@angular/core';

export type DialogVariant = 'danger' | 'warning' | 'info';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  isOpen = signal(false);

  config = signal<DialogConfig | null>(null);

  open(config: DialogConfig): void {
    this.config.set(config);
    this.isOpen.set(true);
  }

  confirm(): void {
    const config = this.config();

    this.isOpen.set(false);

    config?.onConfirm?.();

    this.config.set(null);
  }

  cancel(): void {
    const config = this.config();

    this.isOpen.set(false);

    config?.onCancel?.();

    this.config.set(null);
  }
}