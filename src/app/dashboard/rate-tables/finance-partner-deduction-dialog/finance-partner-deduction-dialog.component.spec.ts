import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FinancePartnerDeductionDialogComponent } from './finance-partner-deduction-dialog.component';

describe('FinancePartnerDeductionDialogComponent', () => {
  let component: FinancePartnerDeductionDialogComponent;
  let fixture: ComponentFixture<FinancePartnerDeductionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancePartnerDeductionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancePartnerDeductionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
