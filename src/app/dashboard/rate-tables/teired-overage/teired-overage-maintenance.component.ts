import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { maxPermitDeductionDate, rateNotExisting } from '../../../shared/validators';
import { groupBy } from '../../../shared/group-by';
import { getControlName } from '../../../shared/get-control-name';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { MatDialog } from '@angular/material';
import { TieredOverageMaintenanceDialogComponent } from '../teired-overage-dialog/teired-overage-dialog.component';

@Component({
  selector: 'teired-overage-maintenance',
  templateUrl: './teired-overage-maintenance.component.html',
  styleUrls: ['./teired-overage-maintenance.component.css']
})
export class TeiredOverageComponent implements OnInit {
  allTieredOverageRates: any;
  activeTieredOverageRates: any;
  tieredOverageRateGroup: any;
  tieredOverageRateSelectedGroup: any;
  dropdowns: any;
  tieredOverageBonusRateForm: FormGroup;
  tieredOverageGroup: AbstractControl[][];
  addInd: boolean = false;
  salesTerritoryDefault: number = 1;
  financePartnerDefault: number = 1;
  purchaseMethodDefault: number = 1;
  utilityCompanyDefault: number = 1;
  p: number = 1;
  searchText: string = "";

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
    id: "TieredOveragePpw",
    value: "Installation Price (Commissionable PPW)"
  },
  {
    id: "TieredOveragePercentage",
    value: "Overage Percentage Amount"
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
    this.tieredOverageBonusRateForm = this.formBuilder.group({
      salesTerritory: [this.salesTerritoryDefault, [Validators.required]],
      financePartner: [this.financePartnerDefault, [Validators.required]],
      purchaseMethod: [this.purchaseMethodDefault, [Validators.required]],
      utilityCompany: [this.utilityCompanyDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      tieredOveragePercentage: [0, []],
      tieredOveragePpw: [0, [Validators.required]],
    });

    this.getDropdowns();
    //this.getActivePpaBonusRates();

    this.tieredOverageGroup = [[this.tieredOverageBonusRateForm.controls.tieredOveragePpw, this.tieredOverageBonusRateForm.controls.tieredOveragePercentage]];

    this.onChanges();
  }

  onChanges() {
    this.tieredOverageBonusRateForm.valueChanges.subscribe(val => {
      // console.log(this.ppaBonusRateForm.errors);
    });
  }

  onSubmit() {
    if (!this.tieredOverageBonusRateForm.invalid) {
      var groupArr = [];
      this.tieredOverageGroup.forEach(x => {
        groupArr.push(
          {
            "tieredOveragePpw": x[0].value,
            "tieredOveragePercentage": x[1].value
          }
        );
      });

      // console.log(groupArr);

      var body = {
        salesTerritoryId: this.tieredOverageBonusRateForm.controls.salesTerritory.value,
        financePartnerId: this.tieredOverageBonusRateForm.controls.financePartner.value,
        purchaseMethodId: this.tieredOverageBonusRateForm.controls.purchaseMethod.value,
        utilityCompanyId: this.tieredOverageBonusRateForm.controls.utilityCompany.value,
        effectiveStartDate: this.tieredOverageBonusRateForm.controls.effectiveStartDate.value,
        tieredOverageGroups: groupArr
      }

      this.apiService.post('PpaBonusRateMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Permit Deduction Successfully Added');
          this.getAllTeiredOverage();
          this.getActiveTeiredOverage();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllTeiredOverage() {
    this.apiService.get('TeiredOverageMaintenanceV2/retrieveall')
      .subscribe(data => {
        this.allTieredOverageRates = data;

        console.log('all', data);
        if (this.tieredOverageBonusRateForm.controls.ppaRate) this.tieredOverageBonusRateForm.controls.ppaRate.setValidators([Validators.required, rateNotExisting(this.allTieredOverageRates)]);

        if (this.tieredOverageGroup) {
          this.getTieredOverageRateGroup(this.tieredOverageGroup[0][0]);
          this.tieredOverageRateSelectedGroup = this.tieredOverageGroup;
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActiveTeiredOverage() {
    this.apiService.get('TeiredOverageMaintenanceV2/retrieveactive')
      .subscribe(data => {
          console.log(data);
        this.activeTieredOverageRates = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('TeiredOverageMaintenanceV2/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllTeiredOverage();
        this.getActiveTeiredOverage();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getTieredOverageRateGroup(tieredOverageRate: any) {
    var tieredOverageRates = this.allTieredOverageRates.filter(x => x.financePartnerId === tieredOverageRate.financePartnerId && x.purchaseMethodId === tieredOverageRate.purchaseMethodId && x.salesTerritoryId === tieredOverageRate.salesTerritoryId && x.utilityCompanyId === tieredOverageRate.utilityCompanyId);

    tieredOverageRates = Object.values(groupBy(tieredOverageRates, 'effectiveStartDate'));

    // console.log(ppaBonusRates);

    this.tieredOverageRateGroup = tieredOverageRates;
    this.tieredOverageRateSelectedGroup = null;
  }

  get tieredOveragePpw() { return this.tieredOverageBonusRateForm.get('tieredOveragePpw'); }

  get tieredOveragePercentage() { return this.tieredOverageBonusRateForm.get('tieredOveragePercentage'); }

  rowClick(tieredRate: any) {
    console.log('rowClick', tieredRate.financePartnerId, this.allTieredOverageRates)
    let tieredOverageBonusRate = this.allTieredOverageRates.filter(x => x.tieredOverageMappingId === tieredRate.TieredOverageMappingId);

    console.log('filtered', tieredOverageBonusRate);
    tieredOverageBonusRate = Object.values(groupBy(tieredOverageBonusRate, 'effectiveStartDate'));
    const dialogRef = this.dialog.open(TieredOverageMaintenanceDialogComponent, {
      width: '80%', data: { tieredOverageBonusRate }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  groupClick(group: any) {
    this.tieredOverageRateSelectedGroup = group;
  }

  addFormRow() {
    this.tieredOverageBonusRateForm.addControl(`ppaRate${this.tieredOverageGroup.length}`, new FormControl(0, []));
    this.tieredOverageBonusRateForm.addControl(`pricePerKw${this.tieredOverageGroup.length}`, new FormControl(0, []));
    var c1 = this.tieredOverageBonusRateForm.get(`ppaRate${this.tieredOverageGroup.length}`);
    var c2 = this.tieredOverageBonusRateForm.get(`pricePerKw${this.tieredOverageGroup.length}`);
    c1.setValidators([Validators.required, rateNotExisting(this.allTieredOverageRates)]);
    c2.setValidators([Validators.required]);
    this.tieredOverageGroup.push([c1, c2]);
  }

  removeFormRow(index: number) {
    if (this.tieredOverageGroup.length == 1) return;

    this.tieredOverageGroup[index].slice(0).forEach(x => {
      this.tieredOverageBonusRateForm.removeControl(getControlName(x));
    });

    this.tieredOverageGroup.splice(index, 1);
  }

  getControlName(control: AbstractControl) {
    return getControlName(control);
  }

  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activeTieredOverageRates.length - 1; i++) {
      let currentRow = this.activeTieredOverageRates[i];
      tableArr.push({
        effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate), effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate),
        financePartner: currentRow.financePartner, financePartnerId: currentRow.financePartnerId,
        TieredOveragePercentage: currentRow.tieredOveragePercentage, TieredOveragePercentageId: currentRow.tieredOveragePercentageId,
        TieredOverageMappingId: currentRow.tieredOverageMappingId, salesTerritory: currentRow.salesTerritory, salesTerritoryId: currentRow.salesTerritoryId,
        utilityCompany: currentRow.utilityCompany, utilityCompanyId: currentRow.utilityCompanyId, TieredOveragePpw: currentRow.tieredOveragePpw, purchaseMethod: currentRow.purchaseMethod,
        purchaseMethodId: currentRow.purchaseMethodId
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
  effectiveEndDate: string,
  effectiveStartDate: string,
  financePartner: string,
  financePartnerId: string,
  TieredOveragePercentage: number,
  TieredOveragePpw: number,
  TieredOveragePercentageId: number,
  TieredOverageMappingId: number,
  salesTerritory: string,
  salesTerritoryId: string,
  utilityCompany: string,
  utilityCompanyId: string,
  purchaseMethod: string,
  purchaseMethodId: number
}
