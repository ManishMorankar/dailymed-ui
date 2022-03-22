import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewBaseFormulaComponent } from './view-base-formula.component';

describe('ViewBaseFormulaComponent', () => {
  let component: ViewBaseFormulaComponent;
  let fixture: ComponentFixture<ViewBaseFormulaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBaseFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBaseFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
