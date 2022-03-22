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
import { PpaBonusRateMaintenanceDialogComponent } from '../ppa-bonus-rate-maintenance-dialog/ppa-bonus-rate-maintenance-dialog.component';

@Component({
  selector: 'app-ppa-bonus-rate-maintenance',
  templateUrl: './ppa-bonus-rate-maintenance.component.html',
  styleUrls: ['./ppa-bonus-rate-maintenance.component.css']
})
export class PpaBonusRateMaintenanceComponent implements OnInit {
  allPpaBonusRates: any;
  activePpaBonusRates: any;
  ppaBonusRateGroup: any;
  ppaBonusRateSelectedGroup: any;
  dropdowns: any;
  ppaBonusRateForm: FormGroup;
  ppaPpkwGroup: AbstractControl[][];
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
    this.ppaBonusRateForm = this.formBuilder.group({
      salesTerritory: [this.salesTerritoryDefault, [Validators.required]],
      financePartner: [this.financePartnerDefault, [Validators.required]],
      purchaseMethod: [this.purchaseMethodDefault, [Validators.required]],
      utilityCompany: [this.utilityCompanyDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      ppaRate: [0, []],
      pricePerKw: [0, [Validators.required]],
    });

    this.getDropdowns();

    this.ppaPpkwGroup = [[this.ppaBonusRateForm.controls.ppaRate, this.ppaBonusRateForm.controls.pricePerKw]];

    this.onChanges();
  }

  onChanges() {
    this.ppaBonusRateForm.valueChanges.subscribe(val => {
      // console.log(this.ppaBonusRateForm.errors);
    });
  }

  onSubmit() {
    if (!this.ppaBonusRateForm.invalid) {
      var groupArr = [];
      this.ppaPpkwGroup.forEach(x => {
        groupArr.push(
          {
            "PpaRate": x[0].value,
            "PricePerKw": x[1].value
          }
        );
      });

      // console.log(groupArr);

      var body = {
        salesTerritoryId: this.ppaBonusRateForm.controls.salesTerritory.value,
        financePartnerId: this.ppaBonusRateForm.controls.financePartner.value,
        purchaseMethodId: this.ppaBonusRateForm.controls.purchaseMethod.value,
        utilityCompanyId: this.ppaBonusRateForm.controls.utilityCompany.value,
        effectiveStartDate: this.ppaBonusRateForm.controls.effectiveStartDate.value,
        ppaPpwGroups: groupArr
      }

      this.apiService.post('PpaBonusRateMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Permit Deduction Successfully Added');
          this.getAllPpaBonusRates();
          this.getActivePpaBonusRates();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllPpaBonusRates() {
    this.apiService.get('PpaBonusRateMaintenance/retrieveall')
      .subscribe(data => {
        this.allPpaBonusRates = data;

        if (this.ppaBonusRateForm.controls.ppaRate) this.ppaBonusRateForm.controls.ppaRate.setValidators([Validators.required, rateNotExisting(this.allPpaBonusRates)]);

        if (this.ppaBonusRateGroup) {
          this.getPpaBonusRateGroup(this.ppaBonusRateGroup[0][0]);
          this.ppaBonusRateSelectedGroup = this.ppaBonusRateGroup;
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActivePpaBonusRates() {
    this.apiService.get('PpaBonusRateMaintenance/retrieveactive')
      .subscribe(data => {
        console.log('ppa', data);
        this.activePpaBonusRates = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();

      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('PpaBonusRateMaintenance/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllPpaBonusRates();
        this.getActivePpaBonusRates();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getPpaBonusRateGroup(ppaBonusRate: any) {
    var ppaBonusRates = this.allPpaBonusRates.filter(x => x.financePartnerId === ppaBonusRate.financePartnerId && x.purchaseMethodId === ppaBonusRate.purchaseMethodId && x.salesTerritoryId === ppaBonusRate.salesTerritoryId && x.utilityCompanyId === ppaBonusRate.utilityCompanyId);

    ppaBonusRates = Object.values(groupBy(ppaBonusRates, 'effectiveStartDate'));

    // console.log(ppaBonusRates);

    this.ppaBonusRateGroup = ppaBonusRates;
    this.ppaBonusRateSelectedGroup = null;
  }

  get ppaRate() { return this.ppaBonusRateForm.get('ppaRate'); }

  get pricePerKw() { return this.ppaBonusRateForm.get('pricePerKw'); }

  rowClick(ppaBonusRate: any) {
    var ppaBonusRate = this.allPpaBonusRates.filter(x => x.financePartnerId === ppaBonusRate.financePartnerId && x.purchaseMethodId === ppaBonusRate.purchaseMethodId && x.salesTerritoryId === ppaBonusRate.salesTerritoryId && x.utilityCompanyId === ppaBonusRate.utilityCompanyId);
    ppaBonusRate = Object.values(groupBy(ppaBonusRate, 'effectiveStartDate'));
    const dialogRef = this.dialog.open(PpaBonusRateMaintenanceDialogComponent, {
      width: '80%', data: { ppaBonusRate }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  groupClick(group: any) {
    this.ppaBonusRateSelectedGroup = group;
  }

  addFormRow() {
    this.ppaBonusRateForm.addControl(`ppaRate${this.ppaPpkwGroup.length}`, new FormControl(0, []));
    this.ppaBonusRateForm.addControl(`pricePerKw${this.ppaPpkwGroup.length}`, new FormControl(0, []));
    var c1 = this.ppaBonusRateForm.get(`ppaRate${this.ppaPpkwGroup.length}`);
    var c2 = this.ppaBonusRateForm.get(`pricePerKw${this.ppaPpkwGroup.length}`);
    c1.setValidators([Validators.required, rateNotExisting(this.allPpaBonusRates)]);
    c2.setValidators([Validators.required]);
    this.ppaPpkwGroup.push([c1, c2]);
  }

  removeFormRow(index: number) {
    if (this.ppaPpkwGroup.length == 1) return;

    this.ppaPpkwGroup[index].slice(0).forEach(x => {
      this.ppaBonusRateForm.removeControl(getControlName(x));
    });

    this.ppaPpkwGroup.splice(index, 1);
  }

  getControlName(control: AbstractControl) {
    return getControlName(control);
  }

  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activePpaBonusRates.length - 1; i++) {
      let currentRow = this.activePpaBonusRates[i];
      tableArr.push({
        effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate), effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate),
        financePartner: currentRow.financePartner, financePartnerId: currentRow.financePartnerId, ppaRate: this.currencyPipe.transform(currentRow.ppaRate),
        pricePerKw: this.currencyPipe.transform(currentRow.pricePerKw), purchaseMethod: currentRow.purchaseMethod, purchaseMethodId: currentRow.purchaseMethodId,
        purchaseMethodPpaBonusMappingId: currentRow.purchaseMethodPpaBonusMappingId, salesTerritory: currentRow.salesTerritory, salesTerritoryId: currentRow.salesTerritoryId,
        utilityCompany: currentRow.utilityCompany, utilityCompanyId: currentRow.utilityCompanyId, ppwBonusPricePerKw: currentRow.ppwBonusPricePerKw, ppwBonusMetric: currentRow.ppwBonusMetric
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
  financePartnerId: number,
  ppaRate: string,
  pricePerKw: string,
  purchaseMethod: string,
  purchaseMethodId: number,
  purchaseMethodPpaBonusMappingId: number,
  salesTerritory: string,
  salesTerritoryId: number,
  utilityCompany: string,
  utilityCompanyId: number,
  ppwBonusPricePerKw: number,
  ppwBonusMetric: number
}
