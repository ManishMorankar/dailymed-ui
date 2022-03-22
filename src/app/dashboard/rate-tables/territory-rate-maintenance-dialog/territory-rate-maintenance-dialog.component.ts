import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-territory-rate-maintenance-dialog',
  templateUrl: './territory-rate-maintenance-dialog.component.html',
  styleUrls: ['./territory-rate-maintenance-dialog.component.css']
})
export class TerritoryRateMaintenanceDialogComponent implements OnInit {
  territoryRateGroup:any;

  constructor(public dialogRef: MatDialogRef<TerritoryRateMaintenanceDialogComponent>,
    private apiService: ApiService, private toastMsg: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.territoryRateGroup = this.data.territoryRate;
  }

}