import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatCardComponent } from '../../../../shared/components/data-display/stat-card/stat-card.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [StatCardComponent, CurrencyXafPipe],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardsComponent {
  readonly activeMembers = input(0);
  readonly totalBalance = input(0);
  readonly nextSessionDate = input('');
  readonly pendingContributions = input(0);
}
