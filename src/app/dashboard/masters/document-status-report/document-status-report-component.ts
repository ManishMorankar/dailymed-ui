import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';

import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../services/api.response';
import { environment } from '../../../../environments/environment';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-document-status-report',
  templateUrl: './document-status-report-component.html',
  styleUrls: ['./document-status-report-component.css']
})
export class DocumentStatusReportComponent implements OnInit {
  DocumentStatusReportForm: FormGroup;
  projectDropdowns: any;
  documentTypesDropdowns: any;
  pageSizeOptions: number[] = [10, 20, 50];
  exportButton: boolean = false;

  resultDataSource: any = new MatTableDataSource([]);
  resultCols: string[] = ["projectType", "projectName", "projectOwner", "documentType", "department", "documentTitle", "documentId", "documentStartDate", "documentDueDate", "status", "revisionNumber", "createdOn", "createdBy", "modifiedOn", "modifiedBy", "fileLink"];
  filter: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe, private http: HttpClient,
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private dialog: MatDialog) {
  }
  @Input() loginUser: any = {}
  ngOnInit() {
    if (!this.apiService.checkPermission('Reports') && !this.apiService.checkPermission('Admin')) {
      this.apiService.goBack();
      this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    }

    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }

    this.DocumentStatusReportForm = this.formBuilder.group({
      projectType: [''],
      projectNameId: [0],
      documentTypeId: [0],
      documentStatus: [''],
      documentId: [''],
    });
  }

  getProjectDropdowns() {
    var projectType = this.DocumentStatusReportForm.controls.projectType.value;

    let params = new HttpParams();

    params = params.append('projectType', projectType + "");
    this.http.get<ApiResponse>(`${environment.apiBaseUrl}document/ProjectDropdowns`, { params: params })
      .subscribe(data => {
        this.projectDropdowns = data[0];
      }, err => {
        this.toastMsg.error(err, "Error!");
      })
  }

  getAssignedToDropdownsAndProjectDetails() {

    var projectNameId = this.DocumentStatusReportForm.controls.projectNameId.value;
    let params = new HttpParams();

    params = params.append('projectId', projectNameId + "");
    this.http.get<ApiResponse>(`${environment.apiBaseUrl}document/AssignedToDropdowns`, { params: params })
      .subscribe(data => {
        this.documentTypesDropdowns = data[2];
      }, err => {
        this.toastMsg.error(err, "Error!");
      })
  }
  resetClick() {
    this.DocumentStatusReportForm.reset();
    this.DocumentStatusReportForm.controls.projectType.setValue("");
    this.DocumentStatusReportForm.controls.projectNameId.setValue("0");
    this.DocumentStatusReportForm.controls.documentTypeId.setValue("0");
    this.DocumentStatusReportForm.controls.documentStatus.setValue("");
    this.DocumentStatusReportForm.controls.documentId.setValue("");
  }
  returnUrl(fileLink: String) {
    return fileLink;
  }
  downloadOption(fileLink: String) {
    if (fileLink == "") {
      return false;
    }
    return true;
  }

  getResult() {
    this.exportButton = false;
    let params = new HttpParams();

    params = params.append('projectType', this.DocumentStatusReportForm.controls.projectType.value + "");
    params = params.append('projectId', this.DocumentStatusReportForm.controls.projectNameId.value + "");
    params = params.append('documentTypeId', this.DocumentStatusReportForm.controls.documentTypeId.value + "");
    params = params.append('documentStatus', this.DocumentStatusReportForm.controls.documentStatus.value + "");
    params = params.append('documentId', this.DocumentStatusReportForm.controls.documentId.value + "");
    params = params.append('userId', this.loginUser.empId + "");

    this.http.get<ApiResponse>(`${environment.apiBaseUrl}document/FilterDocumentStatusReport`, { params: params })
      .subscribe((response: any) => {
        let data = response.result
        this.resultDataSource.data = data;
        this.resultDataSource.paginator = this.paginator;
        this.exportButton = true;
      }, err => {
        this.toastMsg.error(err, "Error!");
      })
  }

  exportResult() {

    let params = new HttpParams();

    params = params.append('projectType', this.DocumentStatusReportForm.controls.projectType.value + "");
    params = params.append('projectId', this.DocumentStatusReportForm.controls.projectNameId.value + "");
    params = params.append('documentTypeId', this.DocumentStatusReportForm.controls.documentTypeId.value + "");
    params = params.append('documentStatus', this.DocumentStatusReportForm.controls.documentStatus.value + "");
    params = params.append('documentId', this.DocumentStatusReportForm.controls.documentId.value + "");
    params = params.append('userId', this.loginUser.empId + "");

    this.http.get(`${environment.apiBaseUrl}document/ExportDocumentStatusReport?${params}`, { responseType: 'blob' })
      .subscribe(data => {
        this.downLoadFile(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8");
      }, err => {
        this.toastMsg.error(err, "Error!");
      });
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let date: Date = new Date();

    FileSaver.saveAs(blob, `Document_Status_Report.xlsx`);
  }
}

