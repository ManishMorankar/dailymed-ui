import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstallationTypeDeductionMaintenanceDialogComponent } from './installation-type-deduction-maintenance-dialog.component';

describe('InstallationTypeDeductionMaintenanceDialogComponent', () => {
  let component: InstallationTypeDeductionMaintenanceDialogComponent;
  let fixture: ComponentFixture<InstallationTypeDeductionMaintenanceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationTypeDeductionMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationTypeDeductionMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
