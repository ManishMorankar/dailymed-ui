import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-finance-partner-deduction-dialog',
  templateUrl: './finance-partner-deduction-dialog.component.html',
  styleUrls: ['./finance-partner-deduction-dialog.component.css']
})
export class FinancePartnerDeductionDialogComponent implements OnInit {
  financePartnerDeductionGroup: any;
  constructor(public dialogRef: MatDialogRef<FinancePartnerDeductionDialogComponent>,
       private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) 
  {} 

  ngOnInit() {
    this.financePartnerDeductionGroup = this.data.financePartnerDeduction;
  }

}





