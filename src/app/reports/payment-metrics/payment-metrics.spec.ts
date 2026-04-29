import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMetrics } from './payment-metrics';

describe('PaymentMetrics', () => {
  let component: PaymentMetrics;
  let fixture: ComponentFixture<PaymentMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMetrics],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMetrics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
