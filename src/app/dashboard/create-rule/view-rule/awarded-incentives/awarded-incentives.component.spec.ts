import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AwardedIncentivesComponent } from './awarded-incentives.component';

describe('AwardedIncentivesComponent', () => {
  let component: AwardedIncentivesComponent;
  let fixture: ComponentFixture<AwardedIncentivesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardedIncentivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardedIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
