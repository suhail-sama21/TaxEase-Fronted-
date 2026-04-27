import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFilings } from './my-filings';

describe('MyFilings', () => {
  let component: MyFilings;
  let fixture: ComponentFixture<MyFilings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFilings],
    }).compileComponents();

    fixture = TestBed.createComponent(MyFilings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
