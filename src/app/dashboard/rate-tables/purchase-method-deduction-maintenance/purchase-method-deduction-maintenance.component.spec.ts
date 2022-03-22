import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseMethodDeductionMaintenanceComponent } from './purchase-method-deduction-maintenance.component';

describe('PurchaseMethodDeductionMaintenanceComponent', () => {
  let component: PurchaseMethodDeductionMaintenanceComponent;
  let fixture: ComponentFixture<PurchaseMethodDeductionMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseMethodDeductionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseMethodDeductionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
