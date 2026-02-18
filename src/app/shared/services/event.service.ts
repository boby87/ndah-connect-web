import { Injectable } from '@angular/core';
import { signal, computed, Signal } from '@angular/core';
import { SolidityEvent } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSignal = signal<SolidityEvent[]>([
    {
      id: '1',
      eventType: 'birth',
      memberId: '1',
      memberName: 'Jean Tagne',
      eventDate: new Date('2024-03-15'),
      location: 'Yaoundé',
      description: 'Naissance d\'un enfant',
      estimatedBenefit: 75000,
      totalBenefit: 75000,
      contributions: [
        {
          memberId: '2',
          memberName: 'Marie Kamga',
          amount: 25000,
          date: new Date('2024-03-16')
        }
      ],
      status: 'completed',
      createdDate: new Date('2024-03-15')
    }
  ]);

  private selectedEventSignal = signal<SolidityEvent | null>(null);

  public events: Signal<SolidityEvent[]> = this.eventsSignal.asReadonly();
  public totalEvents = computed(() => this.eventsSignal().length);
  public pendingEvents = computed(() =>
    this.eventsSignal().filter(e => e.status === 'pending').length
  );
  public selectedEvent = this.selectedEventSignal.asReadonly();

  constructor() {}

  getEventById(id: string): Signal<SolidityEvent | null> {
    return computed(() =>
      this.eventsSignal().find(e => e.id === id) || null
    );
  }

  selectEvent(event: SolidityEvent) {
    this.selectedEventSignal.set(event);
  }

  addEvent(event: Omit<SolidityEvent, 'id'>) {
    const newEvent: SolidityEvent = {
      ...event,
      id: String(Math.max(...this.eventsSignal().map(e => parseInt(e.id)), 0) + 1)
    };
    this.eventsSignal.update(events => [...events, newEvent]);
  }

  updateEvent(id: string, updates: Partial<SolidityEvent>) {
    this.eventsSignal.update(events =>
      events.map(e => e.id === id ? { ...e, ...updates } : e)
    );
  }

  approveEvent(id: string) {
    this.updateEvent(id, { status: 'approved' });
  }

  completeEvent(id: string) {
    this.updateEvent(id, { status: 'completed' });
  }
}

