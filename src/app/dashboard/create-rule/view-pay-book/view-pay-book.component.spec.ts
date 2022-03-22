import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewPayBookComponent } from './view-pay-book.component';

describe('ViewPayBookComponent', () => {
  let component: ViewPayBookComponent;
  let fixture: ComponentFixture<ViewPayBookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
