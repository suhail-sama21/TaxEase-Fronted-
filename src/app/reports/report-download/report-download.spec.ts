import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDownload } from './report-download';

describe('ReportDownload', () => {
  let component: ReportDownload;
  let fixture: ComponentFixture<ReportDownload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDownload],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDownload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
