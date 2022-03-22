import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ApiService } from "../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';

import { TableFilterPipe } from '../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../services/api.response';
import { environment } from '../../../environments/environment';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-options',
  templateUrl: './options-component.html',
  styleUrls: ['./options-component.css']
})
export class OptionsComponent implements OnInit {
  selectedFile: File = null;
  importSalesDataForm: FormGroup;
  replaceCompanyForm: FormGroup;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe, private http: HttpClient,
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private dialog: MatDialog) {
  }
  @Input() loginUser: any = {}
  ngOnInit() {
    
    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }

    this.importSalesDataForm = new FormGroup({
      uploadDocument: new FormControl(this.selectedFile, [Validators.required]),
    });

    this.replaceCompanyForm = new FormGroup({
      oldCompanyName: new FormControl('', [Validators.required]),
      newCompanyName: new FormControl('', [Validators.required]),
    });

  }

  onSelectFile(fileInput: any) {
    this.selectedFile = <File>fileInput.target.files[0];
  }

  importSalesData() {
    if (!this.importSalesDataForm.invalid) {
      const formData = new FormData();

      formData.append('InputFile', this.selectedFile);

      this.http.post(`${environment.apiBaseUrl}home/salesDataUpload`, formData)
        .subscribe(data => {
          this.toastMsg.success(data['message']);
          this.importSalesDataForm.reset();
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  replaceCompany() {
    if (!this.replaceCompanyForm.invalid) {
      const Payload = {
        oldCompanyName: this.replaceCompanyForm.controls.oldCompanyName.value,
        newCompanyName: this.replaceCompanyForm.controls.newCompanyName.value,
      }
    
      this.http.post(`${environment.apiBaseUrl}home/replaceCompanyName`, Payload)
        .subscribe(data => {
          this.toastMsg.success(data['message']);
          this.importSalesDataForm.reset();
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }
}


