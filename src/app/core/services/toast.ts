import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastId = 0;
    readonly toasts = signal<Toast[]>([]);


    show(
        message: string,
        type: ToastType = 'info',
        duration = 3000
    ): void {

        const toast: Toast = {
            id: ++this.toastId,
            message,
            type,
            duration
        };

        this.toasts.update(toasts => [...toasts, toast]);

        setTimeout(() => {
            this.remove(toast.id);
        }, duration);
    }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string): void {
        this.show(message, 'error');
    }

    warning(message: string): void {
        this.show(message, 'warning');
    }

    info(message: string): void {
        this.show(message, 'info');
    }
    remove(id: number): void {
        this.toasts.update(toasts =>
            toasts.filter(toast => toast.id !== id)
        );
    }

}
