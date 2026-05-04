import { TestBed } from '@angular/core/testing';

import { TaxpayerService } from './taxpayer-service';

describe('TaxpayerService', () => {
  let service: TaxpayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxpayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
