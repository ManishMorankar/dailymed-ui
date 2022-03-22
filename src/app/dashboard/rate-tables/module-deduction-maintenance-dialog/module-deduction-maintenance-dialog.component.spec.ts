import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleDeductionMaintenanceDialogComponent } from './module-deduction-maintenance-dialog.component';

describe('ModuleDeductionMaintenanceDialogComponent', () => {
  let component: ModuleDeductionMaintenanceDialogComponent;
  let fixture: ComponentFixture<ModuleDeductionMaintenanceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleDeductionMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDeductionMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
