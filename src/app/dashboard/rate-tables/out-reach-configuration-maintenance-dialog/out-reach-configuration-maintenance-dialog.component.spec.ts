import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutReachConfigurationMaintenanceDialogComponent } from './out-reach-configuration-maintenance-dialog.component';

describe('OutReachConfigurationMaintenanceDialogComponent', () => {
  let component: OutReachConfigurationMaintenanceDialogComponent;
  let fixture: ComponentFixture<OutReachConfigurationMaintenanceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutReachConfigurationMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutReachConfigurationMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
