import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { StatCardComponent } from '../../../../shared/components/ui/stat-card/stat-card.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'tc-member-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BadgeComponent,
    CardComponent,
    IconComponent,
    SpinnerComponent,
    StatCardComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  templateUrl: './member-dashboard.component.html',
  styleUrl: './member-dashboard.component.scss',
})
export class MemberDashboardComponent {
  private readonly memberService = inject(MemberService);

  readonly summaryResource = resource({
    loader: () => this.memberService.getSummary(),
  });

  readonly summary = computed(() => this.summaryResource.value());
}
