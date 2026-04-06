import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Haeder } from './haeder';

describe('Haeder', () => {
  let component: Haeder;
  let fixture: ComponentFixture<Haeder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Haeder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Haeder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
