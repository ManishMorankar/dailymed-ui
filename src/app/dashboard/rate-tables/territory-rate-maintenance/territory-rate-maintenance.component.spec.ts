import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TerritoryRateMaintenanceComponent } from './territory-rate-maintenance.component';

describe('TerritoryRateMaintenanceComponent', () => {
  let component: TerritoryRateMaintenanceComponent;
  let fixture: ComponentFixture<TerritoryRateMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryRateMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryRateMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
