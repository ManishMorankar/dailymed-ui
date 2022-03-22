import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxTerritoryRateDate } from '../../../shared/validators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { OutReachConfigurationMaintenanceDialogComponent } from '../out-reach-configuration-maintenance-dialog/out-reach-configuration-maintenance-dialog.component';

@Component({
  selector: 'app-out-reach-configuration',
  templateUrl: './out-reach-configuration-maintenance.component.html',
  styleUrls: ['./out-reach-configuration-maintenance.component.css']
})
export class OutReachConfigurationComponent implements OnInit {
  allOutreachPayConfigurationType: any;
  activeOutreachPayConfigurationType: any;
  OutreachPayConfigurationTypeGroup: any;
  dropdowns: any;

  outReachConfigForm: FormGroup;
  addInd: boolean = false;
  outreachPayConfigurationTypeNameDefault: number = 1;
  payAfterThresholdIndDefault: number = 1;

  p: number = 1;
  searchText: string = "";

  originalDataSource;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columnNames = [{
    id: "outreachPayConfigurationTypeName",
    value: "Configuration Name"

  },/* {
    id: "outreachPayConfigurationId",
    value: "Outreach Pay ConfigurationId"
  },
  {
    id: "outreachPayConfigurationTypeId",
    value: "Outreach Pay Configuration TypeId"
  },*/
  {
    id: "payAfterThresholdInd",
    value: "Pay Before or After Threshold is Reached"
  },
  {
    id: "payBasedOn",
    value: "Pay Based On"
  },
  // {
  //   id: "activeInd",
  //   value: "ActiveInd"
  // },
  {
    id: "configurationAmount",
    value: "Awarded Amount"
  },
  {
    id: "configurationThreshold",
    value: "Threshold to Reach"
  },
  {
    id: "effectiveStartDate",
    value: "Effective Start Date"
  }
    ,
  {
    id: "effectiveEndDate",
    value: "Effective End Date"
  }
  ];

  constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe,
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private dialog: MatDialog) {

  }

  ngOnInit() {
    if (!this.apiService.checkPermission('ViewRateTables')) {
      // this.router.navigate(['/ui/dashboard'])
      this.apiService.goBack();
      this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    }
    this.getDropdowns();

    this.outReachConfigForm = this.formBuilder.group({
      outreachPayConfigurationTypeName: [this.outreachPayConfigurationTypeNameDefault, [Validators.required]],
      //outreachPayConfigurationId: [0, [Validators.required]],
      //outreachPayConfigurationTypeId: [0, [Validators.required]],
      payAfterThresholdInd: [false, [Validators.required]],
      payBasedOn: ['DEMO', [Validators.required]],
      // activeInd: ['false', [Validators.required]],
      configurationAmount: [0, [Validators.required]],
      configurationThreshold: [0, [Validators.required]],
      effectiveEndDate: ['', [Validators.required]],
      effectiveStartDate: ['', [Validators.required]]
    });

    this.onChanges();
  }

  onChanges() {
    this.outReachConfigForm.valueChanges.subscribe(val => {
      // console.log(this.territoryRateForm.errors);
    });
  }



  onSubmit() {
    if (!this.outReachConfigForm.invalid) {
      var values = {
        outreachPayConfigurationTypeId: parseInt(this.outReachConfigForm.controls.outreachPayConfigurationTypeName.value),
        //outreachPayConfigurationId: this.outReachConfigForm.controls.outreachPayConfigurationId.value,
        //outreachPayConfigurationTypeId: this.outReachConfigForm.controls.outreachPayConfigurationTypeId.value,
        payAfterThresholdInd: this.outReachConfigForm.controls.payAfterThresholdInd.value,
        payBasedOn: this.outReachConfigForm.controls.payBasedOn.value,
        // activeInd: this.outReachConfigForm.controls.activeInd.value,
        configurationAmount: this.outReachConfigForm.controls.configurationAmount.value,
        configurationThreshold: this.outReachConfigForm.controls.configurationThreshold.value,
        effectiveEndDate: this.outReachConfigForm.controls.effectiveEndDate.value,
        effectiveStartDate: this.outReachConfigForm.controls.effectiveStartDate.value
        
      }
      console.log(values);
      console.log("submit data");
      console.log(values);
      this.apiService.post('OutReachConfiguration', values)
      .subscribe(data => {
        this.toastMsg.success('OutReach Configuration Successfully Added');
        this.getAllOutReachConfiguration();
        this.getActiveOutReachConfiguration();
        this.addInd = !this.addInd;
      }, (err: any) => {
          debugger;
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllOutReachConfiguration() {
    this.apiService.get('OutReachConfiguration/RetrieveAll')
      .subscribe(data => {
        this.allOutreachPayConfigurationType = data;
        this.outReachConfigForm.setValidators([maxTerritoryRateDate(this.allOutreachPayConfigurationType)]);

        if (this.OutreachPayConfigurationTypeGroup) this.getOutreachPayConfigurationTypeGroup(this.OutreachPayConfigurationTypeGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActiveOutReachConfiguration() {
    this.apiService.get('OutReachConfiguration/RetrieveActive')
      .subscribe(data => {
        this.activeOutreachPayConfigurationType = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();

      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('OutReachConfiguration/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        //console.log(this.dropdowns);
        this.getAllOutReachConfiguration();
        this.getActiveOutReachConfiguration();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }



  getOutreachPayConfigurationTypeGroup(outreachPayConfigurationType: any) {
    //console.log(outreachPayConfigurationType);
    var outreachPayConfigurationTypes = this.allOutreachPayConfigurationType.filter(x => x.outreachPayConfigurationTypeId === outreachPayConfigurationType.outreachPayConfigurationTypeId);

    this.OutreachPayConfigurationTypeGroup = outreachPayConfigurationTypes;
  }

  get configurationAmount() { return this.outReachConfigForm.get('configurationAmount'); }
  get payAfterThresholdInd() { return this.outReachConfigForm.get('payAfterThresholdInd'); }

  rowClick(outreachPayConfigurationType: any) {
    var outreachPayConfigurationType = this.allOutreachPayConfigurationType.filter(x => x.outreachPayConfigurationTypeId === outreachPayConfigurationType.outreachPayConfigurationTypeId);
    const dialogRef = this.dialog.open(OutReachConfigurationMaintenanceDialogComponent, {
      width: '80%', data: { outreachPayConfigurationType }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }

  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activeOutreachPayConfigurationType.length - 1; i++) {
      let currentRow = this.activeOutreachPayConfigurationType[i];
      tableArr.push({
        outreachPayConfigurationTypeName: currentRow.outreachPayConfigurationTypeName,
        outreachPayConfigurationId: currentRow.outreachPayConfigurationId,
        outreachPayConfigurationTypeId: currentRow.outreachPayConfigurationTypeId,
        payAfterThresholdInd: currentRow.payAfterThresholdInd ? "After" : "Before",//currentRow.payAfterThresholdInd,
        payBasedOn: currentRow.payBasedOn,
        configurationAmount: this.currencyPipe.transform(currentRow.configurationAmount, "USD", true, "1.2-2"),
        //  configurationAmount: currentRow.configurationAmount,
        configurationThreshold: currentRow.configurationThreshold,
        effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate),
        effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate)
      });
    }
    this.dataSource = new MatTableDataSource(tableArr);
    this.originalDataSource = tableArr;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  searchForItem(): void {
    let filteredResults: Element[] = [];
    if (this.searchText == '') {
      this.dataSource = new MatTableDataSource(this.originalDataSource);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      // filteredResults = this.originalDataSource.filter(option => option.salesTerritory.toLowerCase().includes(this.searchText));
      filteredResults = this.pipe.transform(this.originalDataSource, this.searchText);
      this.dataSource = new MatTableDataSource(filteredResults);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
}


export interface Element {
  outreachPayConfigurationTypeName: string,
  outreachPayConfigurationId: number,
  outreachPayConfigurationTypeId: number,
  payAfterThresholdInd: string;
  payBasedOn: string,
  // activeInd: string,
  configurationAmount: string,
  configurationThreshold: number,
  effectiveEndDate: string,
  effectiveStartDate: string
}

