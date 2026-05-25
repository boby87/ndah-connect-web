import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  kind: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  durationMs: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastsSignal = signal<Toast[]>([]);
  private nextId = 1;

  readonly toasts = this.toastsSignal.asReadonly();

  success(message: string, title?: string, durationMs = 4000): void {
    this.push({ kind: 'success', message, title, durationMs });
  }

  error(message: string, title?: string, durationMs = 6000): void {
    this.push({ kind: 'error', message, title, durationMs });
  }

  warning(message: string, title?: string, durationMs = 5000): void {
    this.push({ kind: 'warning', message, title, durationMs });
  }

  info(message: string, title?: string, durationMs = 4000): void {
    this.push({ kind: 'info', message, title, durationMs });
  }

  dismiss(id: number): void {
    this.toastsSignal.update((items) => items.filter((t) => t.id !== id));
  }

  private push(partial: Omit<Toast, 'id'>): void {
    const id = this.nextId++;
    const toast: Toast = { id, ...partial };
    this.toastsSignal.update((items) => [...items, toast]);
    if (typeof window !== 'undefined' && toast.durationMs > 0) {
      window.setTimeout(() => this.dismiss(id), toast.durationMs);
    }
  }
}
