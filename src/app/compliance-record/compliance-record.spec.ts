import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRecord } from './compliance-record';

describe('ComplianceRecord', () => {
  let component: ComplianceRecord;
  let fixture: ComponentFixture<ComplianceRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceRecord],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceRecord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
