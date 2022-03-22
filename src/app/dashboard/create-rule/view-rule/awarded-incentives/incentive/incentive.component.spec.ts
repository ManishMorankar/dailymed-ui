import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IncentiveComponent } from './incentive.component';

describe('IncentiveComponent', () => {
  let component: IncentiveComponent;
  let fixture: ComponentFixture<IncentiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
