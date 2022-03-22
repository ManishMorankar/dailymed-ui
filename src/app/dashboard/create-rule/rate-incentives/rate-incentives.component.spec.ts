import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RateIncentivesComponent } from './rate-incentives.component';

describe('RateIncentivesComponent', () => {
  let component: RateIncentivesComponent;
  let fixture: ComponentFixture<RateIncentivesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RateIncentivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
