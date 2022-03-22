import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxModuleDeductionDate } from '../../../shared/validators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ModuleDeductionMaintenanceDialogComponent } from '../module-deduction-maintenance-dialog/module-deduction-maintenance-dialog.component';

@Component({
  selector: 'app-module-deduction-maintenance',
  templateUrl: './module-deduction-maintenance.component.html',
  styleUrls: ['./module-deduction-maintenance.component.css']
})
export class ModuleDeductionMaintenanceComponent implements OnInit {
  allModuleDeductions: any;
  activeModuleDeductions: any;
  moduleDeductionGroup: any;
  dropdowns: any;
  moduleDeductionForm: FormGroup;
  addInd: boolean = false;
  salesTerritoryDefault: number = 1;
  moduleTypeDefault: number = 1;
  form: any;
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
    id: "moduleType",
    value: "Module Type"
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
    id: "moduleDeductionRate",
    value: "Module Deduction Rate"
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

    this.moduleDeductionForm = this.formBuilder.group({
      salesTerritory: [this.salesTerritoryDefault, [Validators.required]],
      moduleType: [this.moduleTypeDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      moduleDeductionRate: [0, [Validators.required, Validators.max(20)]],
    });

    this.onChanges();
  }

  onChanges() {
    this.moduleDeductionForm.valueChanges.subscribe(val => {
      // console.log(this.moduleDeductionForm.errors);
    });
  }

  onSubmit() {
    if (!this.moduleDeductionForm.invalid) {
      var values = {
        salesTerritoryId: this.moduleDeductionForm.controls.salesTerritory.value,
        moduleTypeId: this.moduleDeductionForm.controls.moduleType.value,
        effectiveStartDate: this.moduleDeductionForm.controls.effectiveStartDate.value,
        moduleDeductionRate: this.moduleDeductionForm.controls.moduleDeductionRate.value,
      }

      var body = {
        newModuleDeduction: values
      }

      this.apiService.post('ModuleDeductionMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Module Deduction Successfully Added');
          this.getAllModuleDeductions();
          this.getActiveModuleDeductions();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllModuleDeductions() {
    this.apiService.get('ModuleDeductionMaintenance/retrieveall')
      .subscribe(data => {
        this.allModuleDeductions = data;

        this.moduleDeductionForm.setValidators([maxModuleDeductionDate(this.allModuleDeductions)]);

        if (this.moduleDeductionGroup) this.getModuleDeductionGroup(this.moduleDeductionGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActiveModuleDeductions() {
    this.apiService.get('ModuleDeductionMaintenance/retrieveactive')
      .subscribe(data => {
        this.activeModuleDeductions = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('ModuleDeductionMaintenance/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllModuleDeductions();
        this.getActiveModuleDeductions();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getModuleDeductionGroup(moduleDeduction: any) {
    // var moduleDeductions = this.allModuleDeductions.filter(x => x.salesTerritoryId === moduleDeduction.salesTerritoryId && x.utilityCompanyId === moduleDeduction.utilityCompanyId && x.financePartnerId === moduleDeduction.financePartnerId && x.purchaseMethod === moduleDeduction.purchaseMethod);
    var moduleDeductions = this.allModuleDeductions.filter(x => x.salesTerritoryId === moduleDeduction.salesTerritoryId && x.moduleTypeId === moduleDeduction.moduleTypeId);
    this.moduleDeductionGroup = moduleDeductions;
  }

  get moduleDeductionRate() { return this.moduleDeductionForm.get('moduleDeductionRate'); }

  rowClick(moduleDeduction: any) {
    var moduleDeduction = this.allModuleDeductions.filter(x => x.salesTerritoryId === moduleDeduction.salesTerritoryId && x.moduleTypeId === moduleDeduction.moduleTypeId);
    const dialogRef = this.dialog.open(ModuleDeductionMaintenanceDialogComponent, {
      width: '80%', data: { moduleDeduction }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }

  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activeModuleDeductions.length - 1; i++) {
      let currentRow = this.activeModuleDeductions[i];
      tableArr.push({
        activeInd: currentRow.activeInd, effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate), effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate),
        moduleDeductionId: currentRow.moduleDeductionId, moduleType: currentRow.moduleType, moduleTypeId: currentRow.moduleTypeId, salesTerritory: currentRow.salesTerritory,
        // salesTerritoryId: currentRow.salesTerritoryId, moduleDeductionRate: this.currencyPipe.transform(currentRow.moduleDeductionRate)});
        // Dilip Rate table changes
        salesTerritoryId: currentRow.salesTerritoryId, moduleDeductionRate: this.currencyPipe.transform(currentRow.moduleDeductionRate, "USD", true, "1.3-3")
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
  moduleType: string,
  effectiveStartDate: string,
  effectiveEndDate: string,
  moduleTypeId: number,
  activeInd: boolean,
  moduleDeductionRate: string,
  moduleDeductionId: number,
  salesTerritory: string,
  salesTerritoryId: number
}
