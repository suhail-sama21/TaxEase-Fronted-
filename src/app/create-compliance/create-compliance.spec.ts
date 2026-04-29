import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompliance } from './create-compliance';

describe('CreateCompliance', () => {
  let component: CreateCompliance;
  let fixture: ComponentFixture<CreateCompliance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCompliance],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCompliance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
