import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleDeductionMaintenanceComponent } from './module-deduction-maintenance.component';

describe('ModuleDeductionMaintenanceComponent', () => {
  let component: ModuleDeductionMaintenanceComponent;
  let fixture: ComponentFixture<ModuleDeductionMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleDeductionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDeductionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
