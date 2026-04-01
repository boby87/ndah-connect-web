import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTontine } from './new-tontine';

describe('NewTontine', () => {
  let component: NewTontine;
  let fixture: ComponentFixture<NewTontine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTontine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTontine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
