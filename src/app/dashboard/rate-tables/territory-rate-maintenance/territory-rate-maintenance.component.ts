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
import { TerritoryRateMaintenanceDialogComponent } from '../territory-rate-maintenance-dialog/territory-rate-maintenance-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-territory-rate-maintenance',
  templateUrl: './territory-rate-maintenance.component.html',
  styleUrls: ['./territory-rate-maintenance.component.css']
})
export class TerritoryRateMaintenanceComponent implements OnInit {
  allTerritoryRates: any;
  activeTerritoryRates: any;
  territoryRateGroup: any;
  dropdowns: any;
  territoryRateForm: FormGroup;
  addInd: boolean = false;
  salesTerritoryDefault: number = 1;
  utilityCompanyDefault: number = 1;
  financePartnerDefault: number = 1;
  purchaseMethodDefault: number = 1;
  p: number = 1;
  searchText: string = "";
  selfGenShareIndicatorVal: boolean = false;
  commissionOnFloorIndicatorVal: boolean = false;
  originalDataSource;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columnNames = [{
    id: "salesTerritory",
    value: "Sales Territory"

  }, {
    id: "utilityCompany",
    value: "Utility Company"
  },
  {
    id: "financePartner",
    value: "Finance Partner"
  },
  {
    id: "purchaseMethod",
    value: "Purchase Method"
  },
  {
    id: "effectiveStartDate",
    value: "Effective Start Date"
  },
  {
    id: "effectiveEndDate",
    value: "Effective End Date"
  },
  {
    id: "baseRate",
    value: "Base Rate"
  },
  {
    id: "basePercent",
    value: "Base %"
  },
  {
    id: "selfGenBonusPercent",
    value: "Self Gen Bonus %"
  },
  {
    id: "overagePercent",
    value: "Overage %"
  },
  {
    id: "referralPercent",
    value: "Referral %"
  },
  {
    id: "leadFee",
    value: "Lead Fee"
  },
  {
    id: "minimumCommission",
    value: "Minimum Commission"
  },
  {
    id: "selfGenOveragePercentage",
    value: "Self Gen Overage %"
  },
  {
    id: "floorRate",
    value: "Floor Rate"
  },
  {
    id: "selfGenShareIndicator",
    value: "Self Gen Share Indicator"
  },
  {
    id: "commissionOnFloorIndicator",
    value: "Use Floor for Base Rate Indicator"
  }];

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

    this.territoryRateForm = this.formBuilder.group({
      salesTerritory: [this.salesTerritoryDefault, [Validators.required]],
      utilityCompany: [this.utilityCompanyDefault, [Validators.required]],
      financePartner: [this.financePartnerDefault, [Validators.required]],
      purchaseMethod: [this.purchaseMethodDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      baseRate: [0, [Validators.required, Validators.max(20)]],
      basePerc: [0, [Validators.required, Validators.max(100)]],
      selfGenBonusPerc: [0, [Validators.required, Validators.max(100)]],
      overagePerc: [0, [Validators.required, Validators.max(100)]],
      referralPerc: [0, [Validators.required, Validators.max(100)]],
      leadFee: [0, [Validators.required]],
      minimumCommission: [0, [Validators.required]],
      selfGenOveragePercentage: [0, [Validators.max(100)]],
      floorRate: [0, [Validators.required]],
      selfGenShareIndicator: [0],
      commissionOnFloorIndicator: [0]
    });

    this.onChanges();
  }

  selfChecked(event: any) {
    this.selfGenShareIndicatorVal = event.srcElement.checked;
  }

  commChecked(event: any) {
    this.commissionOnFloorIndicatorVal = event.srcElement.checked;
  }
  onChanges() {
    this.territoryRateForm.valueChanges.subscribe(val => {
      // console.log(this.territoryRateForm.errors);
    });
  }



  onSubmit() {

    //if (document.getElementsByName("commissionOnFloorIndicator1")[0].value == "on") {
      //this.commissionOnFloorIndicator = true;
    //}

//    if (document.getElementsByName("selfGenShareIndicator1")[0].value == "on") {
  //    this.selfGenShareIndicator = true;
  //  } 
//
    if (!this.territoryRateForm.invalid) {
      var values = {
        salesTerritoryId: this.territoryRateForm.controls.salesTerritory.value,
        utilityCompanyId: this.territoryRateForm.controls.utilityCompany.value,
        financePartnerId: this.territoryRateForm.controls.financePartner.value,
        purchaseMethodId: this.territoryRateForm.controls.purchaseMethod.value,
        effectiveStartDate: this.territoryRateForm.controls.effectiveStartDate.value,
        baseRate: this.territoryRateForm.controls.baseRate.value,
        basePercentage: this.territoryRateForm.controls.basePerc.value / 100,
        selfGenBonusPercentage: this.territoryRateForm.controls.selfGenBonusPerc.value / 100,
        overagePercentage: this.territoryRateForm.controls.overagePerc.value / 100,
        referralPercentage: this.territoryRateForm.controls.referralPerc.value / 100,
        leadFee: this.territoryRateForm.controls.leadFee.value,
        minimumCommission: this.territoryRateForm.controls.minimumCommission.value,
        floorRate: this.territoryRateForm.controls.floorRate.value,
        selfGenOveragePercentage: this.territoryRateForm.controls.selfGenOveragePercentage.value / 100,
        commissionOnFloorIndicator: this.commissionOnFloorIndicatorVal,
        selfGenShareIndicator: this.selfGenShareIndicatorVal,
      }

      var body = {
        newTerritoryRate: values
      }
    
      this.apiService.post('TerritoryRateMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Territory Rate Successfully Added');
          this.getAllTerritoryRates();
          this.getActiveTerritoryRates();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllTerritoryRates() {
    this.apiService.get('TerritoryRateMaintenance/retrieveall')
      .subscribe(data => {
        this.allTerritoryRates = data;

        this.territoryRateForm.setValidators([maxTerritoryRateDate(this.allTerritoryRates)]);

        if (this.territoryRateGroup) this.getTerritoryRateGroup(this.territoryRateGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActiveTerritoryRates() {
    this.apiService.get('TerritoryRateMaintenance/retrieveactive')
      .subscribe(data => {
        this.activeTerritoryRates = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();

      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('TerritoryRateMaintenance/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllTerritoryRates();
        this.getActiveTerritoryRates();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getTerritoryRateGroup(territoryRate: any) {
    var territoryRates = this.allTerritoryRates.filter(x => x.salesTerritoryId === territoryRate.salesTerritoryId && x.utilityCompanyId === territoryRate.utilityCompanyId && x.financePartnerId === territoryRate.financePartnerId && x.purchaseMethod === territoryRate.purchaseMethod);

    this.territoryRateGroup = territoryRates;
  }

  get baseRate() { return this.territoryRateForm.get('baseRate'); }

  get floorRate() { return this.territoryRateForm.get('floorRate'); }

  get basePerc() { return this.territoryRateForm.get('basePerc'); }

  get selfGenBonusPerc() { return this.territoryRateForm.get('selfGenBonusPerc'); }

  get overagePerc() { return this.territoryRateForm.get('overagePerc'); }

  get referralPerc() { return this.territoryRateForm.get('referralPerc'); }

  get leadFee() { return this.territoryRateForm.get('leadFee'); }

  get selfGenOveragePercentage() { return this.territoryRateForm.get('selfGenOveragePercentage'); }

  rowClick(territoryRate: any) {
    var territoryRate = this.allTerritoryRates.filter(x => x.salesTerritoryId === territoryRate.salesTerritoryId && x.utilityCompanyId === territoryRate.utilityCompanyId && x.financePartnerId === territoryRate.financePartnerId && x.purchaseMethod === territoryRate.purchaseMethod);

    const dialogRef = this.dialog.open(TerritoryRateMaintenanceDialogComponent, {
      width: '80%', data: { territoryRate }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }




  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activeTerritoryRates.length - 1; i++) {
      let currentRow = this.activeTerritoryRates[i];
      tableArr.push({
        salesTerritory: currentRow.salesTerritory, utilityCompany: currentRow.utilityCompany, financePartner: currentRow.financePartner, purchaseMethod: currentRow.purchaseMethod,
        effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate), effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate), baseRate: this.currencyPipe.transform(currentRow.baseRate), basePercent: this.percentPipe.transform(currentRow.basePercentage),
        selfGenBonusPercent: this.percentPipe.transform(currentRow.selfGenBonusPercentage), overagePercent: this.percentPipe.transform(currentRow.overagePercentage), referralPercent: this.percentPipe.transform(currentRow.referralPercentage), leadFee: this.currencyPipe.transform(currentRow.leadFee),
        minimumCommission: this.currencyPipe.transform(currentRow.minimumCommission), financePartnerId: currentRow.financePartnerId, purchaseMethodId: currentRow.purchaseMethodId, salesTerritoryId: currentRow.salesTerritoryId,
        territoryRateId: currentRow.territoryRateId, utilityCompanyId: currentRow.utilityCompanyId, floorRate: this.currencyPipe.transform(currentRow.floorRate), selfGenShareIndicator: currentRow.selfGenShareIndicator, commissionOnFloorIndicator: currentRow.commissionOnFloorIndicator, selfGenOveragePercentage: this.percentPipe.transform(currentRow.selfGenOveragePercentage)
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
      filteredResults = this.pipe.transform(this.originalDataSource, this.searchText);
      this.dataSource = new MatTableDataSource(filteredResults);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
}


export interface Element {
  salesTerritory: string,
  utilityCompany: string,
  financePartner: string,
  purchaseMethod: string;
  effectiveStartDate: string,
  effectiveEndDate: string,
  baseRate: string,
  basePercent: string,
  selfGenBonusPercent: string,
  overagePercent: string,
  referralPercent: string,
  leadFee: string,
  minimumCommission: string,
  financePartnerId: number,
  purchaseMethodId: number,
  salesTerritoryId: number,
  territoryRateId: number,
  utilityCompanyId: number,
  floorRate: string,
  selfGenShareIndicator: boolean,
  commissionOnFloorIndicator: boolean,
  selfGenOveragePercentage: string
}

