import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permit-deduction-maintenance-dialog',
  templateUrl: './permit-deduction-maintenance-dialog.component.html',
  styleUrls: ['./permit-deduction-maintenance-dialog.component.css']
})
export class PermitDeductionMaintenanceDialogComponent implements OnInit {
  permitDeductionGroup: any;

  constructor(public dialogRef: MatDialogRef<PermitDeductionMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
  
  this.permitDeductionGroup = this.data.permitDeductions;
  
  }

}

