import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignUserLicenseComponent } from './assign-user-license-component';

describe('UsersComponent', () => {
  let component: AssignUserLicenseComponent;
  let fixture: ComponentFixture<AssignUserLicenseComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [AssignUserLicenseComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AssignUserLicenseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
