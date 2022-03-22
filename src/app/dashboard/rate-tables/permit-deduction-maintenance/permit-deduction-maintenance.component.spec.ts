import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PermitDeductionMaintenanceComponent } from './permit-deduction-maintenance.component';

describe('PermitDeductionMaintenanceComponent', () => {
  let component: PermitDeductionMaintenanceComponent;
  let fixture: ComponentFixture<PermitDeductionMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PermitDeductionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermitDeductionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
