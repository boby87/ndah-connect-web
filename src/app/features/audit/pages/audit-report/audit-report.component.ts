import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-audit-report',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header title="Rapport d'audit" backLink="/audit" />
    <div class="page-placeholder"><p>Contenu à implémenter</p></div>
  `,
  styles: `@reference "tailwindcss"; .page-placeholder { @apply p-6 text-slate-500; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditReportComponent {}
