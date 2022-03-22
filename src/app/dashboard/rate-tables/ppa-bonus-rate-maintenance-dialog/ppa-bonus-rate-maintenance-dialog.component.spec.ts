import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PpaBonusRateMaintenanceDialogComponent } from './ppa-bonus-rate-maintenance-dialog.component';

describe('PpaBonusRateMaintenanceDialogComponent', () => {
  let component: PpaBonusRateMaintenanceDialogComponent;
  let fixture: ComponentFixture<PpaBonusRateMaintenanceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PpaBonusRateMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpaBonusRateMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
