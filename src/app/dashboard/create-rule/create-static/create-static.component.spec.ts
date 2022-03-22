import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateStaticComponent } from './create-static.component';

describe('CreateStaticComponent', () => {
  let component: CreateStaticComponent;
  let fixture: ComponentFixture<CreateStaticComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
