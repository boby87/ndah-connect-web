import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type IconName =
  | 'home' | 'wallet' | 'coins' | 'smartphone' | 'piggy-bank' | 'arrow-right-left'
  | 'receipt' | 'gift' | 'landmark' | 'scale' | 'pie-chart' | 'bar-chart'
  | 'clipboard' | 'list' | 'mail' | 'file-text' | 'user-plus' | 'address-book'
  | 'archive' | 'megaphone' | 'crown' | 'check-square' | 'calendar-check'
  | 'user-check' | 'banknote' | 'handshake' | 'gavel' | 'ballot' | 'users-2'
  | 'flag' | 'shield-alert' | 'shield-check' | 'shield' | 'edit' | 'clock'
  | 'lightbulb' | 'award' | 'database' | 'clipboard-check' | 'search'
  | 'file-search' | 'alert-triangle' | 'help-circle' | 'download' | 'calendar'
  | 'calculator' | 'plus-circle' | 'bell' | 'log-out' | 'menu' | 'chevron-down'
  | 'sun' | 'moon' | 'sparkles';

const PATHS: Record<IconName, string> = {
  home: '<path d="M3 11L12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  wallet: '<path d="M3 7h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 7V5a2 2 0 0 1 2-2h10"/><path d="M16 14h2"/>',
  coins: '<circle cx="9" cy="9" r="6"/><circle cx="15" cy="15" r="6"/>',
  smartphone: '<rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>',
  'piggy-bank': '<path d="M19 8a4 4 0 0 0-4-4H8a5 5 0 0 0-5 5v3a5 5 0 0 0 3 4.6V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2.4a5 5 0 0 0 3-4.6V8Z"/><circle cx="16" cy="10" r="1"/>',
  'arrow-right-left': '<path d="M8 3L4 7l4 4"/><path d="M4 7h16"/><path d="M16 13l4 4-4 4"/><path d="M20 17H4"/>',
  receipt: '<path d="M5 3v18l3-2 3 2 3-2 3 2 3-2V3Z"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M7.5 8a2.5 2.5 0 1 1 0-5C13 3 12 8 12 8s-1-5 4.5-5a2.5 2.5 0 1 1 0 5"/>',
  landmark: '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12,2 3,8 21,8"/>',
  scale: '<path d="M16 16l3-8 3 8M2 16l3-8 3 8M12 3v18M5 20h14M5 8h14"/>',
  'pie-chart': '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10Z"/>',
  'bar-chart': '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,7 12,13 21,7"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
  'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
  'address-book': '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M7 18a5 5 0 0 1 10 0"/>',
  archive: '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><line x1="10" y1="12" x2="14" y2="12"/>',
  megaphone: '<path d="M3 11v2a3 3 0 0 0 3 3l1 5h3l-1-5h2l8 4V4l-8 4H6a3 3 0 0 0-3 3Z"/>',
  crown: '<path d="M2 18 5 8l4 4 3-8 3 8 4-4 3 10z"/><line x1="2" y1="22" x2="22" y2="22"/>',
  'check-square': '<rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8,11 11,14 16,9"/>',
  'calendar-check': '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/><polyline points="9,15 11,17 15,13"/>',
  'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17,11 19,13 23,9"/>',
  banknote: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><line x1="6" y1="12" x2="6.01" y2="12"/><line x1="18" y1="12" x2="18.01" y2="12"/>',
  handshake: '<path d="M11 17 8 14a2.83 2.83 0 0 1 0-4l1.5-1.5 5 5"/><path d="M13 7l4 4a2.83 2.83 0 0 1 0 4l-3 3"/><path d="m21 11-4 4"/><path d="M3 11l4-4"/>',
  gavel: '<path d="m14 13-7 7-3-3 7-7"/><path d="m17 5 5 5-4 4-5-5z"/><line x1="9" y1="17" x2="15" y2="11"/>',
  ballot: '<rect x="4" y="6" width="16" height="14" rx="2"/><line x1="9" y1="6" x2="9" y2="3"/><line x1="15" y1="6" x2="15" y2="3"/><polyline points="9,13 11,15 15,11"/>',
  'users-2': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  flag: '<line x1="4" y1="22" x2="4" y2="4"/><path d="M4 4h13l-2 5 2 5H4"/>',
  'shield-alert': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><polyline points="9,12 11,14 15,10"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
  lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 3-2 4-3 6H8c-1-2-3-3-3-6a7 7 0 0 1 7-7Z"/>',
  award: '<circle cx="12" cy="8" r="6"/><polyline points="8,14 7,22 12,19 17,22 16,14"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/>',
  'clipboard-check': '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><polyline points="9,14 11,16 15,12"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  'file-search': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h7"/><polyline points="14,2 14,8 20,8"/><circle cx="17" cy="16" r="3"/><line x1="22" y1="21" x2="19.12" y2="18.12"/>',
  'alert-triangle': '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'help-circle': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>',
  'plus-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  'chevron-down': '<polyline points="6,9 12,15 18,9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/>',
  sparkles: '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z"/><path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6Z"/>',
};

@Component({
  selector: 'tc-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="tc-icon" [innerHTML]="svg()"></span>`,
  styles: [`
    :host { display: inline-flex; line-height: 0; }
    .tc-icon, .tc-icon svg { display: inline-block; }
  `],
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<string>();
  readonly size = input<number | string>(20);

  readonly svg = computed<SafeHtml>(() => {
    const key = this.name() as IconName;
    const inner = PATHS[key] ?? '<circle cx="12" cy="12" r="9"/>';
    const s = this.size();
    const svg = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
