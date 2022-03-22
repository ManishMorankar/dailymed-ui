import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InverterDeductionDialogComponent } from './inverter-deduction-dialog.component';

describe('InverterDeductionDialogComponent', () => {
  let component: InverterDeductionDialogComponent;
  let fixture: ComponentFixture<InverterDeductionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InverterDeductionDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InverterDeductionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
