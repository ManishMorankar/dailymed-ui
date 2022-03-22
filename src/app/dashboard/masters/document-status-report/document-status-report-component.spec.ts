import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentStatusReportComponent } from './document-status-report-component';

describe('UsersComponent', () => {
  let component: DocumentStatusReportComponent;
  let fixture: ComponentFixture<DocumentStatusReportComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [DocumentStatusReportComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DocumentStatusReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
