import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewBasePayStructureComponent } from './view-base-pay-structure.component';

describe('ViewBasePayStructureComponent', () => {
  let component: ViewBasePayStructureComponent;
  let fixture: ComponentFixture<ViewBasePayStructureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBasePayStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBasePayStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
