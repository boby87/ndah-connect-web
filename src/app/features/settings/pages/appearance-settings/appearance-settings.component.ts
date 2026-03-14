import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ThemeService, Theme } from '../../../../core/services/theme.service';
import { LanguageService } from '../../../../core/services/language.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface ThemeOption {
  value: Theme;
  label: string;
  description: string;
  icon: string;
}

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent],
  templateUrl: './appearance-settings.component.html',
  styleUrl: './appearance-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceSettingsComponent {
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly notification = inject(NotificationService);

  readonly currentTheme = this.themeService.theme;
  readonly currentLang = this.languageService.currentLang;

  readonly themeOptions: ThemeOption[] = [
    { value: 'light', label: 'Clair', description: 'Thème lumineux par défaut', icon: '☀️' },
    { value: 'dark', label: 'Sombre', description: 'Idéal pour la nuit', icon: '🌙' },
    { value: 'system', label: 'Système', description: 'Suit les préférences de votre appareil', icon: '💻' },
  ];

  readonly languageOptions: LanguageOption[] = [
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
  ];

  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.notification.success('Thème mis à jour.');
  }

  async selectLanguage(lang: string): Promise<void> {
    await this.languageService.setLanguage(lang);
    this.notification.success('Langue mise à jour.');
  }
}
