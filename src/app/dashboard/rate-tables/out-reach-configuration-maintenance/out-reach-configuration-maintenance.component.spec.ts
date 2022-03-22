import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutReachConfigurationComponent } from './out-reach-configuration-maintenance.component';

describe('TerritoryRateMaintenanceComponent', () => {
  let component: OutReachConfigurationComponent;
  let fixture: ComponentFixture<OutReachConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutReachConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutReachConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
