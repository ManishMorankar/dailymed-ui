import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RateTablesComponent } from './rate-tables.component';

describe('RateTablesComponent', () => {
  let component: RateTablesComponent;
  let fixture: ComponentFixture<RateTablesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RateTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
