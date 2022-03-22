import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PpaBonusRateMaintenanceComponent } from './ppa-bonus-rate-maintenance.component';

describe('PpaBonusRateMaintenanceComponent', () => {
  let component: PpaBonusRateMaintenanceComponent;
  let fixture: ComponentFixture<PpaBonusRateMaintenanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PpaBonusRateMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpaBonusRateMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
