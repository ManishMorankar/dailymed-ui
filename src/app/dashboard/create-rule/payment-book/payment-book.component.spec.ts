import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentBookComponent } from './payment-book.component';

describe('PaymentBookComponent', () => {
  let component: PaymentBookComponent;
  let fixture: ComponentFixture<PaymentBookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
