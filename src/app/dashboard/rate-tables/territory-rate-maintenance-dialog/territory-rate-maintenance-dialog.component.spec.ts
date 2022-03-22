import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TerritoryRateMaintenanceDialogComponent } from './territory-rate-maintenance-dialog.component';

describe('TerritoryRateMaintenanceDialogComponent', () => {
  let component: TerritoryRateMaintenanceDialogComponent;
  let fixture: ComponentFixture<TerritoryRateMaintenanceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryRateMaintenanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryRateMaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
