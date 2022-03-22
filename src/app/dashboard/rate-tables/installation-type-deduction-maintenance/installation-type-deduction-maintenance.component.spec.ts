import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstallationTypeDeductionMaintenanceComponent } from './installation-type-deduction-maintenance.component';

describe('InstallationTypeDeductionMaintenanceComponent', () => {
  let component: InstallationTypeDeductionMaintenanceComponent;
  let fixture: ComponentFixture<InstallationTypeDeductionMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationTypeDeductionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationTypeDeductionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
