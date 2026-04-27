import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegStatus } from './reg-status';

describe('RegStatus', () => {
  let component: RegStatus;
  let fixture: ComponentFixture<RegStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(RegStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
