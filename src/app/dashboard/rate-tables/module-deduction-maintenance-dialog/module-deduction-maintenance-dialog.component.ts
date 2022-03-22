import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-module-deduction-maintenance-dialog',
  templateUrl: './module-deduction-maintenance-dialog.component.html',
  styleUrls: ['./module-deduction-maintenance-dialog.component.css']
})
export class ModuleDeductionMaintenanceDialogComponent implements OnInit {
  moduleDeductionGroup: any;
  constructor(public dialogRef: MatDialogRef<ModuleDeductionMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.moduleDeductionGroup = this.data.moduleDeduction;
  }

}


