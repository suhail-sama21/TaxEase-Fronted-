import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCases } from './audit-cases';

describe('AuditCases', () => {
  let component: AuditCases;
  let fixture: ComponentFixture<AuditCases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCases],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditCases);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
