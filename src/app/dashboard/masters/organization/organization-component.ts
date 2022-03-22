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
import { IOrganization } from '../../../model/Organization';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-organization',
    templateUrl: './organization-component.html',
    styleUrls: ['./organization-component.css']
})
export class OrganizationComponent implements OnInit {
    OrganizationForm: FormGroup;
    addInd: boolean = false;
    updateInd: boolean = false;
    add: boolean = true;
  update: boolean = false;
  addbtn: boolean = true;
  cancelbtn: boolean = false;
    pageSizeOptions: number[] = [10, 20, 50];
    selectedRowId: number;
    pageSize: number = 10;
    allSelected: boolean = false;
    OrganizationCode: string = null;
    OrganizationName: string = null;
    selectedOrganizationName: string = "";
    searchText: string = "";
    originalDataSource: any;
    dataSource: any;
    OrganizationDataSource: MatTableDataSource<IOrganization> = new MatTableDataSource([]);
    OrganizationCols: string[] = ["selected", "OrganizationCode", "OrganizationName"];
    filter: boolean;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe, private http: HttpClient,
        private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.getOrganizationCodes();
      if (!this.apiService.checkPermission('Master') && !this.apiService.checkPermission('Admin')) {
            this.apiService.goBack();
            this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
        }
        this.OrganizationForm = this.formBuilder.group({
            OrganizationCode: [this.OrganizationCode, [Validators.required]],
            OrganizationName: [this.OrganizationName, [Validators.required]]
        });
    }

    onChangeFilter() {
        this.getOrganizationCodes();
    }


    rowClick(row: any) {
        this.updateInd = true;
        this.addInd = false;
        this.update = true;
      this.add = false;
      this.addbtn = false;
      this.cancelbtn = true;
        this.OrganizationForm.controls.OrganizationCode.setValue(row.organizationCode);
        this.OrganizationForm.controls.OrganizationName.setValue(row.organizationName);
        this.selectedRowId = row.organizationId;

    }

    checkSelected() {
        return this.OrganizationDataSource && this.OrganizationDataSource.data.filter(record => record.selected).length > 0;
    }

    getNumberSelected(): number {
        if (this.OrganizationDataSource) return this.OrganizationDataSource.data.filter(record => record.selected).length;
    }

    onSelectionChange() {
      let balances = this.OrganizationDataSource.filteredData.filter(bal => bal.selected);
      this.addInd = false;
      this.updateInd = false;
      this.addbtn = true;
      this.cancelbtn = false;
        if (balances.length == this.OrganizationDataSource.filteredData.length) {
            this.allSelected = true;
        } else {
            this.allSelected = false;
        }
    }

    onBulkSelectionChange() {
        this.OrganizationDataSource.filteredData.map(bal => bal.selected = this.allSelected);
    }

    deleteSelected() {
        let OrganizationDataSource = this.OrganizationDataSource.data.filter(record => record.selected);
        var ids = new Array();
        for (var i = 0; i < OrganizationDataSource.length; i++) {
            ids.push(OrganizationDataSource[i].organizationId)
        }
        this.apiService.post('Organization/deleteRows', ids)
            .subscribe(data => {
                this.toastMsg.success("Deleted selected Records successfully.");
              this.getOrganizationCodes();
              
                this.applyFilter(this.searchText);
            }, err => {
                this.toastMsg.error(err, "Error!");
            })
    }


    getOrganizationCodes() {
        let params = new HttpParams();

        params = params.append('OrganizationName', this.selectedOrganizationName + "");
        this.http.get<ApiResponse>(`${environment.apiBaseUrl}Organization/RetrieveAll`, { params: params })
            .subscribe(data => {
                if (data && data.result) {
                    var OrganizationDataSource = data.result.map((rows: IOrganization) => { return rows });
                    this.OrganizationDataSource = new MatTableDataSource<IOrganization>(OrganizationDataSource);
                    this.OrganizationDataSource.paginator = this.paginator;
                    this.OrganizationDataSource.sort = this.sort;
                    this.applyFilter(this.searchText);
                }
            }, err => {
                this.toastMsg.error(err, "Error!");
            })
    }

    getOrganizationCodesWorksheet() {
        let params = new HttpParams();
        params = params.append('OrganizationName', this.selectedOrganizationName + "");
        this.http.get(`${environment.apiBaseUrl}Organization/export?OrganizationName=${this.selectedOrganizationName}`, { responseType: 'blob' })
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
        this.OrganizationDataSource.filter = filterValue.trim().toLowerCase();
    }
  addClick() {
    this.addInd = true;
    this.addbtn = false;
    this.cancelbtn = true;
    this.add = true;
    this.update = false;
  }
  cancelClick() {
    this.addInd = false;
    this.updateInd = false;
    this.OrganizationForm.reset();
    this.addbtn = true;
    this.cancelbtn = false;
  }

    onSubmit() {
        if (!this.OrganizationForm.invalid) {
            if (this.addInd) {
            var body = {
                    OrganizationCode: this.OrganizationForm.controls.OrganizationCode.value,
                    OrganizationName: this.OrganizationForm.controls.OrganizationName.value,
                }


                this.apiService.post('Organization', body)
                    .subscribe(data => {
                        this.toastMsg.success('Organization master added successfully');
                        this.getOrganizationCodes()
                        this.addInd = false;
                      this.updateInd = false;
                      this.addbtn = true;
                      this.cancelbtn = false;
                      this.selectedRowId = 0;
                      this.OrganizationForm.reset();
                    }, (err: any) => {
                        this.toastMsg.error(err, 'Server Error!');
                    });
            }

            if (this.updateInd) {

                var bodyPost = {
                    OrganizationId: this.selectedRowId,
                    OrganizationCode: this.OrganizationForm.controls.OrganizationCode.value,
                    OrganizationName: this.OrganizationForm.controls.OrganizationName.value,
                }


                this.apiService.put('Organization', bodyPost)
                    .subscribe(data => {
                        this.toastMsg.success('Organization master updated successfully');
                        this.getOrganizationCodes()
                        this.addInd = false;
                        this.updateInd=false;
                        this.selectedRowId = 0;
                      this.update = false;
                      this.addbtn = true;
                      this.cancelbtn = false;
                      this.add = true;
                      this.OrganizationForm.reset();
                    }, (err: any) => {
                        this.toastMsg.error(err, 'Server Error!');
                    });
            }
        }
    }
    searchForItem(): void {
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
    organizationCode: string;
    organizationName: string;
    organizationId: number;
}

