import { Component, input, output, OnDestroy, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
  imports: [],
  selector: 'app-toast',
  styleUrl: './toast.scss',
  templateUrl: './toast.html',
})
export class Toast {
 readonly toastService = inject(ToastService);
}
