import { Injectable, signal } from '@angular/core';

export interface DialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'info' | 'warning' | 'danger';
}

export interface DialogState {
  isOpen: boolean;
  config: DialogConfig | null;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly state = signal<DialogState>({ isOpen: false, config: null });

  private resolveRef?: (value: boolean) => void;

  confirm(config: DialogConfig): Promise<boolean> {
    this.state.set({ isOpen: true, config });
    return new Promise<boolean>(resolve => {
      this.resolveRef = resolve;
    });
  }

  close(result: boolean): void {
    this.state.set({ isOpen: false, config: null });
    this.resolveRef?.(result);
    this.resolveRef = undefined;
  }
}
