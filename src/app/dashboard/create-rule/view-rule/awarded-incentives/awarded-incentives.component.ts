import { Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IOnDemandJson, IOnDemandJsonMetadata } from 'src/app/model/on-demand-json.model';
import { ToastrService } from 'ngx-toastr';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { IncentiveComponent } from './incentive/incentive.component';
import { IStep } from 'src/app/model/step.model';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-awarded-incentives',
  templateUrl: './awarded-incentives.component.html',
  styleUrls: ['./awarded-incentives.component.css']
})
export class AwardedIncentivesComponent implements OnInit, OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('awardedPaginator') paginator: MatPaginator;
  @Input() ruleId: number;
  @Input() steps: IStep[];
  awardedIncentivesData: MatTableDataSource<IOnDemandJson> = new MatTableDataSource([]);
  displayColumns: string[] = ["contactId", "ruleName", "contactName", "stepName", "actionValue"];
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  // pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10];  // dilip
  pageSize: number = 5;
  pageEvent: PageEvent;

  constructor(private apiService: ApiService, private toastMsg: ToastrService, public dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    // this.getAwardIncentives(this.ruleId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ruleId) {
      this.getAwardIncentives(changes.ruleId.currentValue);
    }
  }

  /**
   * Get Award Incentive Info
   * @param ruleId
   */
  getAwardIncentives(ruleId: number): void {
    // console.log("Rule Id & Contact Id", this.viewRuleId)
    if (ruleId) {
      this.apiService.get('OnDemandJson/' + ruleId)
        .subscribe(data => {
          // console.log('Award Incentives', data)
          if (data["statusCode"] === "201" && data.result) {
            var incentives = data.result.map(x => {return <IOnDemandJson>x});

            this.awardedIncentivesData = new MatTableDataSource(incentives);
            this.awardedIncentivesData.paginator = this.paginator;
            this.awardedIncentivesData.sort = this.sort;
            // console.log("this.awardIncentiveData",this.awardIncentiveData);
          }
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!')
        });
    }
  }

  onClick(row: IOnDemandJson): void {
    var steps = this.steps.filter(s => s.stepId == row.stepId);

    if (steps.length > 0) {
      var step = steps[0];
    } else {
      this.toastMsg.error("There was an error retrieving the awarded step.", "Error");
      return;
    }

    var metaDatas: MatTableDataSource<IOnDemandJsonMetadata> = new MatTableDataSource(row.metaDatas);

    const dialogRef = this.dialog.open(IncentiveComponent, {
      width: '85%',
      height: '85%',
      data: {step: step, metaDatas: metaDatas}
    });
  }

  pageChange(pageEvent: PageEvent) {
    console.log(pageEvent);
  }
}
