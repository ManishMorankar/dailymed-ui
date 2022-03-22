import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InverterDeductionMaintenanceComponent } from './inverter-deduction-maintenance.component';

describe('InverterDeductionMaintenanceComponent', () => {
  let component: InverterDeductionMaintenanceComponent;
  let fixture: ComponentFixture<InverterDeductionMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InverterDeductionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InverterDeductionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
