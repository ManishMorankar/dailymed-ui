import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseMethodDeductionMaintenanceDialogComponent } from './purchase-method-deduction-maintenance-dialog.component';

describe('PurchaseMethodDeductionMaintenanceDialogComponent', () => {
  let component: PurchaseMethodDeductionMaintenanceDialogComponent;
  let fixture: ComponentFixture<PurchaseMethodDeductionMaintenanceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseMethodDeductionMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseMethodDeductionMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
