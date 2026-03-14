import { computed, inject, Injectable, signal } from '@angular/core';
import { Member, Tontine } from '../../shared/models/entities';
import { TontineApiService } from '../../core/api/services/tontine-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TontineStore {
  private readonly tontineApi = inject(TontineApiService);

  private readonly _tontines = signal<Tontine[]>([]);
  private readonly _currentTontine = signal<Tontine | null>(null);
  private readonly _currentMember = signal<Member | null>(null);
  private readonly _members = signal<Member[]>([]);
  private readonly _isLoading = signal(false);

  readonly tontines = this._tontines.asReadonly();
  readonly currentTontine = this._currentTontine.asReadonly();
  readonly currentMember = this._currentMember.asReadonly();
  readonly members = this._members.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly currentMemberRole = computed(() => this._currentMember()?.role ?? null);

  setTontines(tontines: Tontine[]): void {
    this._tontines.set(tontines);
  }

  setCurrentTontine(tontine: Tontine | null): void {
    this._currentTontine.set(tontine);
  }

  setCurrentMember(member: Member | null): void {
    this._currentMember.set(member);
  }

  setMembers(members: Member[]): void {
    this._members.set(members);
  }

  async loadTontines(): Promise<void> {
    this._isLoading.set(true);
    try {
      const response = await firstValueFrom(this.tontineApi.getAll());
      this._tontines.set(response.data);
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadMembers(tontineId: string): Promise<void> {
    this._isLoading.set(true);
    try {
      const response = await firstValueFrom(this.tontineApi.getMembers(tontineId));
      this._members.set(response.data);
    } finally {
      this._isLoading.set(false);
    }
  }
}
