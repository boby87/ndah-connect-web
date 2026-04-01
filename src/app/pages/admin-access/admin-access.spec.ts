import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccess } from './admin-access';

describe('AdminAccess', () => {
  let component: AdminAccess;
  let fixture: ComponentFixture<AdminAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
