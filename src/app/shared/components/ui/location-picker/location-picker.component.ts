import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  model,
  signal,
} from '@angular/core';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const DEBOUNCE_MS = 350;

@Component({
  selector: 'tc-location-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location-picker.component.html',
})
export class LocationPickerComponent {
  readonly label = input<string>('Lieu');
  readonly required = input<boolean>(false);
  readonly error = input<string>('');

  readonly value = model<string>('');

  protected readonly query = signal('');
  protected readonly suggestions = signal<NominatimResult[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly open = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected onInput(raw: string): void {
    this.query.set(raw);
    this.value.set(raw);
    this.suggestions.set([]);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    if (raw.trim().length < 3) {
      this.open.set(false);
      return;
    }

    this.debounceTimer = setTimeout(() => void this.search(raw.trim()), DEBOUNCE_MS);
  }

  private async search(q: string): Promise<void> {
    this.isSearching.set(true);
    this.open.set(true);
    try {
      const params = new URLSearchParams({
        q,
        format: 'json',
        addressdetails: '1',
        limit: '6',
        'accept-language': 'fr',
      });
      const resp = await fetch(`${NOMINATIM_URL}?${params}`);
      if (resp.ok) {
        const data = (await resp.json()) as NominatimResult[];
        this.suggestions.set(data);
      }
    } catch {
      this.suggestions.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  protected selectSuggestion(item: NominatimResult): void {
    this.value.set(item.display_name);
    this.query.set(item.display_name);
    this.suggestions.set([]);
    this.open.set(false);
  }

  protected clear(): void {
    this.value.set('');
    this.query.set('');
    this.suggestions.set([]);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (!(target instanceof Element) || !target.closest('tc-location-picker')) {
      this.open.set(false);
    }
  }
}
