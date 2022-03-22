import { Component, OnInit, ViewChild } from '@angular/core';
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
import { IUsers } from '../../../model/users';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-users',
  templateUrl: './users-component.html',
  styleUrls: ['./users-component.css']
})
export class UsersComponent implements OnInit {
  dropdowns: any;
  UsersForm: FormGroup;
  addInd: boolean = false;
  updateInd: boolean = false;
  add: boolean = true;
  update: boolean = false;
  pageSizeOptions: number[] = [10, 20, 50];
  selectedRowId: number;
  pageSize: number = 10;
  allSelected: boolean = false;
  EmployeeCode: string = null;
  UserName: string = null;
  UserType: string = null;
  OrganizationId: number = null;
  DepartmentId: number = null;
  DesignationCodeId: number = null;
  GradeCodeId: number = null;
  DisciplineCodeId: number = null;
  LocationId: number = null;
  RoleCodeId: number = null;
  Gender: string = null;
  EmailId: string = null;
  UserId: string = null;
  Password: string = null;
  JoiningDate: Date = null;
  LeavingDate: Date = null;
  StartDate: Date = null;
  selectedUserName: string = "";
  searchText: string = "";
  originalDataSource: any;
  dataSource: any;
  UsersDataSource: MatTableDataSource<IUsers> = new MatTableDataSource([]);
  UsersCols: string[] = ["selected", "userName", "employeeCode", "userType"];
  filter: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe, private http: HttpClient,
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private dialog: MatDialog) {
  }
  ngOnInit() {
    this.getDropdowns();
    this.getEmployeeCodes();
    if (!this.apiService.checkPermission('Users') && !this.apiService.checkPermission('Admin')) {
      this.apiService.goBack();
      this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    }
    this.UsersForm = this.formBuilder.group({
      EmployeeCode: [this.EmployeeCode, [Validators.required]],
      UserName: [this.UserName, [Validators.required]],
      UserType: [this.UserType, [Validators.required]],
      OrganizationId: [this.OrganizationId, [Validators.required]],
      DepartmentId: [this.DepartmentId, [Validators.required]],
      DesignationCodeId: [this.DesignationCodeId, [Validators.required]],
      GradeCodeId: [this.GradeCodeId, [Validators.required]],
      DisciplineCodeId: [this.DisciplineCodeId, [Validators.required]],
      LocationId: [this.LocationId, [Validators.required]],
      RoleCodeId: [this.RoleCodeId, [Validators.required]],
      Gender: [this.Gender, [Validators.required]],
      EmailId: [this.EmailId, [Validators.required]],
      UserId: [this.UserId, [Validators.required]],
      Password: [this.Password, [Validators.required]],
      JoiningDate: [this.JoiningDate,[Validators.required]],
      LeavingDate: [this.LeavingDate],
      StartDate: [this.StartDate, [Validators.required]],
    });
  }

  getDropdowns() {
    this.apiService.get('Users/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  onChangeFilter() {
    this.getEmployeeCodes();
  }


  rowClick(row: any) {
    this.updateInd = true;
    this.addInd = false;
    this.update = true;
    this.add = false;
    this.UsersForm.controls.EmployeeCode.setValue(row.employeeCode);
    this.UsersForm.controls.UserName.setValue(row.userName);
    this.UsersForm.controls.UserType.setValue(row.userType);
    this.UsersForm.controls.OrganizationId.setValue(row.organizationId);
    this.UsersForm.controls.DepartmentId.setValue(row.departmentId);
    this.UsersForm.controls.DesignationCodeId.setValue(row.designationCodeId);
    this.UsersForm.controls.GradeCodeId.setValue(row.gradeCodeId);
    this.UsersForm.controls.DisciplineCodeId.setValue(row.disciplineCodeId);
    this.UsersForm.controls.LocationId.setValue(row.locationId);
    this.UsersForm.controls.RoleCodeId.setValue(row.roleCodeId);
    this.UsersForm.controls.Gender.setValue(row.gender);
    this.UsersForm.controls.EmailId.setValue(row.emailId);
    this.UsersForm.controls.UserId.setValue(row.userId);
    this.UsersForm.controls.Password.setValue(row.password);
    this.UsersForm.controls.JoiningDate.setValue(this.datePipe.transform(row.joiningDate, 'yyyy-MM-dd'));
    this.UsersForm.controls.LeavingDate.setValue(this.datePipe.transform(row.leavingDate, 'yyyy-MM-dd'));
    this.UsersForm.controls.StartDate.setValue(this.datePipe.transform(row.startDate, 'yyyy-MM-dd'));
    this.selectedRowId = row.id;

  }

  checkSelected() {
    return this.UsersDataSource && this.UsersDataSource.data.filter(record => record.selected).length > 0;
  }

  getNumberSelected(): number {
    if (this.UsersDataSource) return this.UsersDataSource.data.filter(record => record.selected).length;
  }

  onSelectionChange() {
    let balances = this.UsersDataSource.filteredData.filter(bal => bal.selected);
    if (balances.length == this.UsersDataSource.filteredData.length) {
      this.allSelected = true;
    } else {
      this.allSelected = false;
    }
  }

  onBulkSelectionChange() {
    this.UsersDataSource.filteredData.map(bal => bal.selected = this.allSelected);
  }

  deleteSelected() {
    let UsersDataSource = this.UsersDataSource.data.filter(record => record.selected);
    var ids = new Array();
    for (var i = 0; i < UsersDataSource.length; i++) {
      ids.push(UsersDataSource[i].id)
    }
    this.apiService.post('Users/deleteRows', ids)
      .subscribe(data => {
        this.toastMsg.success("Deleted selected Records successfully.");
        this.getEmployeeCodes();
        this.applyFilter(this.searchText);
      }, err => {
        this.toastMsg.error(err, "Error!");
      })
  }


  getEmployeeCodes() {
    let params = new HttpParams();

    params = params.append('UserName', this.selectedUserName + "");
    this.http.get<ApiResponse>(`${environment.apiBaseUrl}Users/RetrieveAll`, { params: params })
      .subscribe(data => {
        if (data && data.result) {
          var UsersDataSource = data.result.map((rows: IUsers) => { return rows });
          this.UsersDataSource = new MatTableDataSource<IUsers>(UsersDataSource);
          this.UsersDataSource.paginator = this.paginator;
          this.UsersDataSource.sort = this.sort;
          this.applyFilter(this.searchText);
        }
      }, err => {
        this.toastMsg.error(err, "Error!");
      })
  }

  getEmployeeCodesWorksheet() {
    let params = new HttpParams();
    params = params.append('UserName', this.selectedUserName + "");
    this.http.get(`${environment.apiBaseUrl}Users/export?UserName=${this.selectedUserName}`, { responseType: 'blob' })
      .subscribe(data => {
        this.downLoadFile(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8");
      }, err => {
        this.toastMsg.error(err, "Error!");
      });
  }

  /**
  * Method is use to download file.
  * @param data - Array Buffer data
  * @param type - type of the document.
  */
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let date: Date = new Date();

    FileSaver.saveAs(blob, `Lead_Sources_${date}.xlsx`);
  }

  applyFilter(input: string): void;

  applyFilter(input: Event): void;

  applyFilter(input: any): any {
    var filterValue: string;
    if (typeof input === "string") {
      filterValue = input;
    } else {
      filterValue = (input.target as HTMLInputElement).value;
    }
    this.UsersDataSource.filter = filterValue.trim().toLowerCase();
  }


  onSubmit() {
    if (!this.UsersForm.invalid) {
      if (this.addInd) {
        var body = {
          EmployeeCode: this.UsersForm.controls.EmployeeCode.value,
          UserName: this.UsersForm.controls.UserName.value,
          UserType: this.UsersForm.controls.UserType.value,
          OrganizationId: this.UsersForm.controls.OrganizationId.value,
          DepartmentId: this.UsersForm.controls.DepartmentId.value,
          DesignationCodeId: this.UsersForm.controls.DesignationCodeId.value,
          GradeCodeId: this.UsersForm.controls.GradeCodeId.value,
          DisciplineCodeId: this.UsersForm.controls.DisciplineCodeId.value,
          LocationId: this.UsersForm.controls.LocationId.value,
          RoleCodeId: this.UsersForm.controls.RoleCodeId.value,
          Gender: this.UsersForm.controls.Gender.value,
          EmailId: this.UsersForm.controls.EmailId.value,
          UserId: this.UsersForm.controls.UserId.value,
          Password: this.UsersForm.controls.Password.value,
          JoiningDate: this.UsersForm.controls.JoiningDate.value,
          LeavingDate: this.UsersForm.controls.LeavingDate.value,
          StartDate: this.UsersForm.controls.StartDate.value,
        }


        this.apiService.post('Users', body)
          .subscribe(data => {
            this.toastMsg.success('User master added successfully');
            this.getEmployeeCodes()
            this.addInd = false;
            this.updateInd = false;
            this.selectedRowId = 0;
            this.UsersForm.reset();
          }, (err: any) => {
            this.toastMsg.error(err, 'Server Error!');
          });
      }

      if (this.updateInd) {

        var bodyPost = {
          Id: this.selectedRowId,
          EmployeeCode: this.UsersForm.controls.EmployeeCode.value,
          UserName: this.UsersForm.controls.UserName.value,
          UserType: this.UsersForm.controls.UserType.value,
          OrganizationId: this.UsersForm.controls.OrganizationId.value,
          DepartmentId: this.UsersForm.controls.DepartmentId.value,
          DesignationCodeId: this.UsersForm.controls.DesignationCodeId.value,
          GradeCodeId: this.UsersForm.controls.GradeCodeId.value,
          DisciplineCodeId: this.UsersForm.controls.DisciplineCodeId.value,
          LocationId: this.UsersForm.controls.LocationId.value,
          RoleCodeId: this.UsersForm.controls.RoleCodeId.value,
          Gender: this.UsersForm.controls.Gender.value,
          EmailId: this.UsersForm.controls.EmailId.value,
          UserId: this.UsersForm.controls.UserId.value,
          Password: this.UsersForm.controls.Password.value,
          JoiningDate: this.UsersForm.controls.JoiningDate.value,
          LeavingDate: this.UsersForm.controls.LeavingDate.value,
          StartDate: this.UsersForm.controls.StartDate.value,
        }


        this.apiService.put('Users', bodyPost)
          .subscribe(data => {
            this.toastMsg.success('User master updated successfully');
            this.getEmployeeCodes()
            this.addInd = false;
            this.updateInd = false;
            this.selectedRowId = 0;
            this.update = false;
            this.add = true;
            this.UsersForm.reset();
          }, (err: any) => {
            this.toastMsg.error(err, 'Server Error!');
          });
      }
    }
  }
  searchForUsers(): void {
    let filteredResults: Element[] = [];
    if (this.searchText == '') {
      this.dataSource = new MatTableDataSource(this.originalDataSource);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      filteredResults = this.pipe.transform(this.originalDataSource, this.searchText);
      this.dataSource = new MatTableDataSource(filteredResults);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
}

export interface Element {
  employeeCode: string;
  userName: string;
  id: number;
  userType: string;
  organizationId: number;
  departmentId: number;
  designationCodeId: number;
  gradeCodeId: number;
  disciplineCodeId: number;
  locationId: number;
  roleCodeId: number;
  gender: string;
  emailId: string;
  userId: string;
  password: string;
  joiningDate: Date;
  leavingDate: Date;
  startDate: Date;
}

