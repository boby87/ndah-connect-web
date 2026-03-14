import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { OtpInputComponent } from '../../../../shared/components/forms/otp-input/otp-input.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [OtpInputComponent, ButtonComponent],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyOtpComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);

  protected isLoading = false;
  protected phone = '';
  protected timer = signal(60);
  protected canResend = signal(false);
  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.phone = this.route.snapshot.queryParams['phone'] ?? '';
    this.startTimer();
  }

  async onOtpComplete(code: string): Promise<void> {
    this.isLoading = true;
    try {
      await this.authService.verifyOtp({ phoneNumber: this.phone, code });
      this.notification.success('Compte vérifié avec succès !');
      this.router.navigate(['/auth/login']);
    } catch {
      this.notification.error('Code invalide. Veuillez réessayer.');
    } finally {
      this.isLoading = false;
    }
  }

  async resendOtp(): Promise<void> {
    try {
      await this.authService.resendOtp(this.phone);
      this.notification.success('Code renvoyé avec succès.');
      this.canResend.set(false);
      this.timer.set(60);
      this.startTimer();
    } catch {
      this.notification.error('Erreur lors du renvoi du code.');
    }
  }

  private startTimer(): void {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      const current = this.timer();
      if (current <= 1) {
        this.timer.set(0);
        this.canResend.set(true);
        if (this.interval) clearInterval(this.interval);
      } else {
        this.timer.set(current - 1);
      }
    }, 1000);
  }
}
