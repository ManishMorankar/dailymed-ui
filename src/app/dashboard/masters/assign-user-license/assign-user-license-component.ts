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
  selector: 'app-assign-user-license',
  templateUrl: './assign-user-license-component.html',
  styleUrls: ['./assign-user-license-component.css']
})
export class AssignUserLicenseComponent implements OnInit {
  LicenseDetailsForm: FormGroup;
  TotalAvailableLicenses: number;
  LicensesApplied: number;
  LicensesBalance: number;
  AssignUserLicenseForm: FormGroup;
  pageSizeOptions: number[] = [10, 20, 50];
  searchText: string = "";

  AssignUserLicenseDataSource: MatTableDataSource<IUsers> = new MatTableDataSource([]);
  AssignUserLicenseCols: string[] = ["name", "email", "employeeCode"];
  filter: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe, private http: HttpClient,
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private dialog: MatDialog) {
  }

  ngOnInit() {

    if (!this.apiService.checkPermission('Users') && !this.apiService.checkPermission('Admin')) {
      this.apiService.goBack();
      this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    }

    this.LicenseDetailsForm = this.formBuilder.group({
      TotalAvailableLicenses: [this.TotalAvailableLicenses],
      LicensesApplied: [this.LicensesApplied],
      LicensesBalance: [this.LicensesBalance],
    });


    this.http.get<ApiResponse>(`${environment.apiBaseUrl}UserDetails/DecryptLicense`)
      .subscribe(data => {
        this.LicenseDetailsForm.controls.TotalAvailableLicenses.setValue(data);
        this.getLicenseDetails();
      }, err => {
        this.toastMsg.error(err, "Error!");
        return;
      })

    // this.LicenseDetailsForm.controls.TotalAvailableLicenses.setValue(20);

  }


  getLicenseDetails() {

    this.http.get<ApiResponse>(`${environment.apiBaseUrl}UserDetails/LicenseDetails`)
      .subscribe(data => {
        if (data && data.result) {
          var AssignUserLicenseDataSource = data.result.map((rows: IUsers) => { return rows });
          this.AssignUserLicenseDataSource = new MatTableDataSource<IUsers>(AssignUserLicenseDataSource);
          this.AssignUserLicenseDataSource.paginator = this.paginator;
          this.AssignUserLicenseDataSource.sort = this.sort;
          this.applyFilter(this.searchText);

          this.LicenseDetailsForm.controls.LicensesApplied.setValue(data.result.length);
          this.LicenseDetailsForm.controls.LicensesBalance.setValue(this.LicenseDetailsForm.controls.TotalAvailableLicenses.value - this.LicenseDetailsForm.controls.LicensesApplied.value);
        }
      }, err => {
        this.toastMsg.error(err, "Error!");
      })
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
    this.AssignUserLicenseDataSource.filter = filterValue.trim().toLowerCase();
  }
}

