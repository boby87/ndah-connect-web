import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationTontine } from './invitation-tontine';

describe('InvitationTontine', () => {
  let component: InvitationTontine;
  let fixture: ComponentFixture<InvitationTontine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationTontine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationTontine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
