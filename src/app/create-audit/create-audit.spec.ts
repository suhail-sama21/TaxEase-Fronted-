import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAudit } from './create-audit';

describe('CreateAudit', () => {
  let component: CreateAudit;
  let fixture: ComponentFixture<CreateAudit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAudit],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAudit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
