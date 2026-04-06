import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTontine } from './join-tontine';

describe('JoinTontine', () => {
  let component: JoinTontine;
  let fixture: ComponentFixture<JoinTontine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinTontine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinTontine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
