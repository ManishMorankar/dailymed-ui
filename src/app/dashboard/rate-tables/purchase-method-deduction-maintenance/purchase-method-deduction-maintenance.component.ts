import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxPurchaseMethodDeductionDate } from '../../../shared/validators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { PurchaseMethodDeductionMaintenanceDialogComponent } from '../purchase-method-deduction-maintenance-dialog/purchase-method-deduction-maintenance-dialog.component';

@Component({
  selector: 'app-purchase-method-deduction-maintenance',
  templateUrl: './purchase-method-deduction-maintenance.component.html',
  styleUrls: ['./purchase-method-deduction-maintenance.component.css']
})
export class PurchaseMethodDeductionMaintenanceComponent implements OnInit {
  allPurchaseMethodDeductions: any;
  activePurchaseMethodDeductions: any;
  purchaseMethodDeductionGroup: any;
  dropdowns: any;
  purchaseMethodDeductionForm: FormGroup;
  addInd: boolean = false;
  purchaseMethodDefault: number = 1;
  salesTerritoryDefault: number = 1;
  form: any;
  p: number = 1;
  searchText: string = "";

  originalDataSource;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columnNames = [{
    id: "purchaseMethod",
    value: "Purchase Method"

  }, {
    id: "salesTerritory",
    value: "Sales Territory"
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
    id: "purchaseMethodDeductionRate",
    value: "Purchase Method Deduction Rate"
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

    this.purchaseMethodDeductionForm = this.formBuilder.group({
      purchaseMethod: [this.purchaseMethodDefault, [Validators.required]],
      salesTerritory: [this.salesTerritoryDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      purchaseMethodDeductionRate: [0, [Validators.required, Validators.max(20)]],
    });

    this.onChanges();
  }

  onChanges() {
    this.purchaseMethodDeductionForm.valueChanges.subscribe(val => {
      // console.log(this.purchaseMethodDeductionForm.errors);
    });
  }

  onSubmit() {
    if (!this.purchaseMethodDeductionForm.invalid) {
      var values = {
        purchaseMethodId: this.purchaseMethodDeductionForm.controls.purchaseMethod.value,
        salesTerritoryId: this.purchaseMethodDeductionForm.controls.salesTerritory.value,
        effectiveStartDate: this.purchaseMethodDeductionForm.controls.effectiveStartDate.value,
        purchaseMethodDeductionRate: this.purchaseMethodDeductionForm.controls.purchaseMethodDeductionRate.value
      }

      var body = {
        newPurchaseMethodDeduction: values
      }

      this.apiService.post('PurchaseMethodDeductionMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Purchase Method Deduction Successfully Added');
          this.getAllPurchaseMethodDeductions();
          this.getActivePurchaseMethodDeductions();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllPurchaseMethodDeductions() {
    this.apiService.get('PurchaseMethodDeductionMaintenance/retrieveall')
      .subscribe(data => {
        this.allPurchaseMethodDeductions = data;

        this.purchaseMethodDeductionForm.setValidators([maxPurchaseMethodDeductionDate(this.allPurchaseMethodDeductions)]);

        if (this.purchaseMethodDeductionGroup) this.getPurchaseMethodDeductionGroup(this.purchaseMethodDeductionGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActivePurchaseMethodDeductions() {
    this.apiService.get('PurchaseMethodDeductionMaintenance/retrieveactive')
      .subscribe(data => {
        this.activePurchaseMethodDeductions = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('PurchaseMethodDeductionMaintenance/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllPurchaseMethodDeductions();
        this.getActivePurchaseMethodDeductions();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getPurchaseMethodDeductionGroup(purchaseMethodDeduction: any) {
    var purchaseMethodDeductions = this.allPurchaseMethodDeductions.filter(x => x.purchaseMethodId === purchaseMethodDeduction.purchaseMethodId);
    
    this.purchaseMethodDeductionGroup = purchaseMethodDeductions;
  }

  get purchaseMethodDeductionRate() { return this.purchaseMethodDeductionForm.get('purchaseMethodDeductionRate'); }

  rowClick(purchaseMethodDeduction: any) {
    // All Sunnova Loans will have the same history because we are filtering on purchaseMethod ID.
    var filteredPurchaseMethodDeduction = this.allPurchaseMethodDeductions.filter(x => x.purchaseMethodId === purchaseMethodDeduction.purchaseMethodId);
    filteredPurchaseMethodDeduction = filteredPurchaseMethodDeduction.filter(x => x.salesTerritoryId === purchaseMethodDeduction.salesTerritoryId);
    console.log(filteredPurchaseMethodDeduction);
    const dialogRef = this.dialog.open(PurchaseMethodDeductionMaintenanceDialogComponent, {
      width: '80%', data: { filteredPurchaseMethodDeduction }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activePurchaseMethodDeductions.length - 1; i++) {
      let currentRow = this.activePurchaseMethodDeductions[i];
      tableArr.push({
        purchaseMethod: currentRow.purchaseMethod, salesTerritory: currentRow.salesTerritory, effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate), effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate),
        // purchaseMethodDeductionRate: this.currencyPipe.transform(currentRow.purchaseMethodDeductionRate), activeInd: currentRow.activeInd, purchaseMethodDeductionId: currentRow.purchaseMethodDeductionId,
        // Dilip Com-1138
        purchaseMethodDeductionRate: this.currencyPipe.transform(currentRow.purchaseMethodDeductionRate, "USD", true, "1.4-4"), activeInd: currentRow.activeInd, purchaseMethodDeductionId: currentRow.purchaseMethodDeductionId,
        salesTerritoryId: currentRow.salesTerritoryId, purchaseMethodId: currentRow.purchaseMethodId
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
  purchaseMethod: string,
  salesTerritory: string,
  effectiveStartDate: string,
  effectiveEndDate: string,
  purchaseMethodDeductionRate: string,
  activeInd: boolean,
  purchaseMethodDeductionId: number,
  purchaseMethodId: number,
  salesTerritoryId: number
}
