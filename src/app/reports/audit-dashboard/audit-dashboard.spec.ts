import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditDashboard } from './audit-dashboard';

describe('AuditDashboard', () => {
  let component: AuditDashboard;
  let fixture: ComponentFixture<AuditDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
