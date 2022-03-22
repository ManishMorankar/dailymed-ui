import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VersionDialogComponent } from './version-dialog.component';

describe('VersionDialogComponent', () => {
  let component: VersionDialogComponent;
  let fixture: ComponentFixture<VersionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
