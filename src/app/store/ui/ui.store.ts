import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStore {
  private readonly sidebarOpenSignal = signal(true);
  private readonly mobileNavOpenSignal = signal(false);

  readonly sidebarOpen = this.sidebarOpenSignal.asReadonly();
  readonly mobileNavOpen = this.mobileNavOpenSignal.asReadonly();

  toggleSidebar(): void {
    this.sidebarOpenSignal.update((open) => !open);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpenSignal.set(open);
  }

  toggleMobileNav(): void {
    this.mobileNavOpenSignal.update((open) => !open);
  }

  closeMobileNav(): void {
    this.mobileNavOpenSignal.set(false);
  }
}
