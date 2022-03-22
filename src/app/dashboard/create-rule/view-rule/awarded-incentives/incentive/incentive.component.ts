import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { IStep } from 'src/app/model/step.model';
import { IOnDemandJsonMetadata } from 'src/app/model/on-demand-json.model';

@Component({
  selector: 'app-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css']
})
export class IncentiveComponent implements OnInit {
  displayColumns: string[] = ["displayName", "value"];
  
  constructor(public dialogRef: MatDialogRef<IncentiveComponent>, @Inject(MAT_DIALOG_DATA) public data: IIncentiveData, private apiService: ApiService, private toastMsg: ToastrService) { }

  ngOnInit() {
  }

  getValueType(data) {
    //console.log("data",data);
    if (data != "1" && data != "2") {
      return "3";
    }
  }
}

export interface IIncentiveData {
  step: IStep;
  metaDatas: MatTableDataSource<IOnDemandJsonMetadata>;
}