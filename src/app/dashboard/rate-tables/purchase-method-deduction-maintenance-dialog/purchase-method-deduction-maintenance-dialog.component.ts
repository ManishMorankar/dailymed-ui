import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase-method-deduction-maintenance-dialog',
  templateUrl: './purchase-method-deduction-maintenance-dialog.component.html',
  styleUrls: ['./purchase-method-deduction-maintenance-dialog.component.css']
})
export class PurchaseMethodDeductionMaintenanceDialogComponent implements OnInit {
  purchaseMethodDeductionGroup: any;
  constructor(public dialogRef: MatDialogRef<PurchaseMethodDeductionMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.purchaseMethodDeductionGroup = this.data.filteredPurchaseMethodDeduction;
  }

}


