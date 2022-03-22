import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FinancePartnerDeductionMaintenanceComponent } from './finance-partner-deduction-maintenance.component';

describe('FinancePartnerDeductionMaintenanceComponent', () => {
  let component: FinancePartnerDeductionMaintenanceComponent;
  let fixture: ComponentFixture<FinancePartnerDeductionMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancePartnerDeductionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancePartnerDeductionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
