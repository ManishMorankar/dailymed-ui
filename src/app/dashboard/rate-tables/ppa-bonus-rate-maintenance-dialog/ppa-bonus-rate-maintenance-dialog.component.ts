import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ppa-bonus-rate-maintenance-dialog',
  templateUrl: './ppa-bonus-rate-maintenance-dialog.component.html',
  styleUrls: ['./ppa-bonus-rate-maintenance-dialog.component.css']
})
export class PpaBonusRateMaintenanceDialogComponent implements OnInit {
  ppaBonusRateGroup: any;
  ppaBonusRateSelectedGroup: any;
  
  constructor(public dialogRef: MatDialogRef<PpaBonusRateMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.ppaBonusRateGroup = this.data.ppaBonusRate; 
  }

  groupClick(group: any) {
    this.ppaBonusRateSelectedGroup = group;
  }

}

