import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

interface ExportResult {
  dataset: string;
  generatedAt: string;
  downloadUrlExcel: string;
  downloadUrlCsv: string;
  downloadUrlPdf: string;
  recordCount: number;
}

@Component({
  selector: 'tc-auditor-export',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, ButtonComponent, CardComponent, DateFormatPipe],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Export des données</h1>
        <p class="text-sm text-gray-500">
          Extraire les données pour analyse externe (Excel, CSV, PDF).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <tc-card title="Sélection du jeu de données">
        <div class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-700">Jeu de données</label>
            <select
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              [value]="dataset()"
              (change)="dataset.set($any($event.target).value)"
            >
              <option value="all">Tout (cotisations + dépenses + mouvements)</option>
              <option value="movements">Mouvements de caisse</option>
              <option value="contributions">Cotisations</option>
              <option value="expenses">Dépenses</option>
              <option value="loans">Prêts</option>
              <option value="distributions">Distributions</option>
              <option value="sanctions">Sanctions</option>
            </select>
          </div>

          <tc-button variant="primary" [loading]="loading()" (clicked)="onExport()">
            📥 Générer l'export
          </tc-button>
        </div>
      </tc-card>

      @if (result(); as r) {
        <tc-card title="Export prêt">
          <div class="space-y-2 text-sm">
            <p class="text-gray-700">
              <strong>{{ r.recordCount }}</strong> enregistrement(s) pour le jeu
              <strong>{{ r.dataset }}</strong>
            </p>
            <p class="text-xs text-gray-500">
              Généré le {{ r.generatedAt | tcDate: true }}
            </p>
            <div class="flex gap-2 pt-2">
              <a [href]="r.downloadUrlExcel" class="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">📊 Excel</a>
              <a [href]="r.downloadUrlCsv" class="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">📄 CSV</a>
              <a [href]="r.downloadUrlPdf" class="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">📄 PDF</a>
            </div>
          </div>
        </tc-card>
      }
    </div>
  `,
})
export class AuditorExportPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly dataset = signal('all');
  readonly loading = signal(false);
  readonly result = signal<ExportResult | null>(null);
  readonly errorMessage = signal<string | null>(null);

  async onExport(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const r = await this.service.exportData(this.dataset());
      this.result.set(r);
      this.notifications.success('Export prêt.');
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.loading.set(false);
    }
  }
}
