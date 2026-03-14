import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <span>© {{ year }} NdahConnect — Gestion de tontines</span>
    </footer>
  `,
  styles: `@reference "tailwindcss"; .footer { @apply text-center text-xs text-slate-400 py-4 border-t border-slate-100; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
