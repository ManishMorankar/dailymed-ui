import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BonusIncentivesComponent } from './bonus-incentives.component';

describe('BonusIncentivesComponent', () => {
  let component: BonusIncentivesComponent;
  let fixture: ComponentFixture<BonusIncentivesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusIncentivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
