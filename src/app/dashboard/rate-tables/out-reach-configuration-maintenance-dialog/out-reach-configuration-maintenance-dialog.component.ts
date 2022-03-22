import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-out-reach-configuration-maintenance-dialog',
  templateUrl: './out-reach-configuration-maintenance-dialog.component.html',
  styleUrls: ['./out-reach-configuration-maintenance-dialog.component.css']
})
export class OutReachConfigurationMaintenanceDialogComponent implements OnInit {
  OutreachPayConfigurationTypeGroup: any;
  constructor(public dialogRef: MatDialogRef<OutReachConfigurationMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.OutreachPayConfigurationTypeGroup = this.data.outreachPayConfigurationType;
  }

}
  