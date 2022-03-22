import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PayStreamItemComponent } from './pay-stream-item.component';

describe('PayStreamItemComponent', () => {
  let component: PayStreamItemComponent;
  let fixture: ComponentFixture<PayStreamItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PayStreamItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayStreamItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
