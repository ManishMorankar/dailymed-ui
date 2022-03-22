import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PermitDeductionMaintenanceDialogComponent } from './permit-deduction-maintenance-dialog.component';

describe('PermitDeductionMaintenanceDialogComponent', () => {
  let component: PermitDeductionMaintenanceDialogComponent;
  let fixture: ComponentFixture<PermitDeductionMaintenanceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PermitDeductionMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermitDeductionMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
