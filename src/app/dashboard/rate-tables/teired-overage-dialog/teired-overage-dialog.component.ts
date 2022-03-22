import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teired-overage-maintenance-dialog',
  templateUrl: './teired-overage-dialog.component.html',
  styleUrls: ['./teired-overage-dialog.component.css']
})
export class TieredOverageMaintenanceDialogComponent implements OnInit {
  tieredOverageGroup: any;
  tieredOverageSelectedGroup: any;
  
  constructor(public dialogRef: MatDialogRef<TieredOverageMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.tieredOverageGroup = this.data.tieredOverageBonusRate;
  }

  groupClick(group: any) {
    this.tieredOverageSelectedGroup = group;
  }

}

