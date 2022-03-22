import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewPlanComponent } from './view-plan.component';

describe('ViewPlanComponent', () => {
  let component: ViewPlanComponent;
  let fixture: ComponentFixture<ViewPlanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
