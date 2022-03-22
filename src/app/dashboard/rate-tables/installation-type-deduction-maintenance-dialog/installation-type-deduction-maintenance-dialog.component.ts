import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-installation-type-deduction-maintenance-dialog',
  templateUrl: './installation-type-deduction-maintenance-dialog.component.html',
  styleUrls: ['./installation-type-deduction-maintenance-dialog.component.css']
})
export class InstallationTypeDeductionMaintenanceDialogComponent implements OnInit {
  installationTypeDeductionGroup: any;
  constructor(public dialogRef: MatDialogRef<InstallationTypeDeductionMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.installationTypeDeductionGroup = this.data.installationTypeDeduction;
  }

}


