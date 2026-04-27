import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTaxes } from './file-taxes';

describe('FileTaxes', () => {
  let component: FileTaxes;
  let fixture: ComponentFixture<FileTaxes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileTaxes],
    }).compileComponents();

    fixture = TestBed.createComponent(FileTaxes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
