import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasepayStructureComponent } from './basepay-structure.component';

describe('BasepayStructureComponent', () => {
  let component: BasepayStructureComponent;
  let fixture: ComponentFixture<BasepayStructureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasepayStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasepayStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
