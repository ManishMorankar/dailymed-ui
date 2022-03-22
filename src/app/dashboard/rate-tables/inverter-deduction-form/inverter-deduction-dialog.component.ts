import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxInverterDeductionDate } from '../../../shared/validators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Element } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-inverter-deduction-dialog',
  templateUrl: './inverter-deduction-dialog.component.html',
  styleUrls: ['./inverter-deduction-dialog.component.css']
})

export class InverterDeductionDialogComponent implements OnInit {
  inverterDeductionGroup: any;

  constructor(public dialogRef: MatDialogRef<InverterDeductionDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.inverterDeductionGroup = this.data.inverterDeductions;
  }
}