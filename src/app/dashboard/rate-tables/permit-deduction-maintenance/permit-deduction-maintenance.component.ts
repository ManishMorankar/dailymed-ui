import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxPermitDeductionDate } from '../../../shared/validators';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import {MatPaginator} from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { PermitDeductionMaintenanceDialogComponent } from '../permit-deduction-maintenance-dialog/permit-deduction-maintenance-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-permit-deduction-maintenance',
  templateUrl: './permit-deduction-maintenance.component.html',
  styleUrls: ['./permit-deduction-maintenance.component.css']
})
export class PermitDeductionMaintenanceComponent implements OnInit {
  allPermitDeductions: any;
  activePermitDeductions: any;
  permitDeductionGroup: any;
  dropdowns: any;
  permitDeductionForm: FormGroup;
  addInd: boolean = false;
  salesTerritoryDefault: number = 1;
  financePartnerDefault: number = 1;
  purchaseMethodDefault: number = 1;
  form: any;
  p: number = 1;
  searchText: string = "";

  originalDataSource;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  columnNames = [{
    id: "salesTerritory",
    value: "Sales Territory"
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
  id: "utilityCompany",
  value: "Utility Company"
},
{
  id: "effectiveStartDate",
  value: "Start Date"
},
{
  id: "effectiveEndDate",
  value: "End Date"
},
{
  id: "minimumPpw",
  value: "Minimum PPW"
},
{
  id: "permitDeductionRate",
  value: "Permit Deduction Rate"
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

    this.permitDeductionForm = this.formBuilder.group({
      salesTerritory: [this.salesTerritoryDefault, [Validators.required]],
      financePartner: [this.financePartnerDefault, [Validators.required]],
      purchaseMethod: [this.purchaseMethodDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      permitDeductionRate: [0, [Validators.required, Validators.max(20)]],
    });

    this.onChanges();
  }

  onChanges() {
    this.permitDeductionForm.valueChanges.subscribe(val => {
      // console.log(this.permitDeductionForm.errors);
    });
  }

  onSubmit() {
    if (!this.permitDeductionForm.invalid) {
      var values = {
        salesTerritoryId: this.permitDeductionForm.controls.salesTerritory.value,
        financePartnerId: this.permitDeductionForm.controls.financePartner.value,
        purchaseMethodId: this.permitDeductionForm.controls.purchaseMethod.value,
        effectiveStartDate: this.permitDeductionForm.controls.effectiveStartDate.value,
        permitDeductionRate: this.permitDeductionForm.controls.permitDeductionRate.value
      }

      var body = {
        newPermitDeduction: values
      }

      this.apiService.post('PermitDeductionMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Permit Deduction Successfully Added');
          this.getAllPermitDeductions();
          this.getActivePermitDeductions();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllPermitDeductions() {
    this.apiService.get('PermitDeductionMaintenance/retrieveall')
      .subscribe(data => {
        this.allPermitDeductions = data;

        this.permitDeductionForm.setValidators([maxPermitDeductionDate(this.allPermitDeductions)]);

        if (this.permitDeductionGroup) this.getPermitDeductionGroup(this.permitDeductionGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActivePermitDeductions() {
    this.apiService.get('PermitDeductionMaintenance/retrieveactive')
      .subscribe(data => {
        console.log('active', data); 
        this.activePermitDeductions = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('PermitDeductionMaintenance/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllPermitDeductions();
        this.getActivePermitDeductions();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getPermitDeductionGroup(permitDeduction: any) {
    var permitDeductions = this.allPermitDeductions.filter(x => x.financePartnerId === permitDeduction.financePartnerId && x.purchaseMethodId === permitDeduction.purchaseMethodId && x.salesTerritoryId === permitDeduction.salesTerritoryId);

    this.permitDeductionGroup = permitDeductions;
  }

  get permitDeductionRate() { return this.permitDeductionForm.get('permitDeductionRate'); }

  rowClick(permitDeduction: any) {
    // this.getPermitDeductionGroup(permitDeduction);

    // this.permitDeductionForm.patchValue({
    //   financePartner: permitDeduction.financePartnerId,
    //   purchaseMethod: permitDeduction.purchaseMethodId,
    //   salesTerritory: permitDeduction.salesTerritoryId,
    // });

    var permitDeductions = this.allPermitDeductions.filter(x => x.financePartnerId === permitDeduction.financePartnerId && x.purchaseMethodId === permitDeduction.purchaseMethodId && x.salesTerritoryId === permitDeduction.salesTerritoryId && 
      x.utilityCompanyId === permitDeduction.utilityCompanyId && x.minimumPpw === permitDeduction.minimumPpw); 
    console.log('history', permitDeductions);
    const dialogRef = this.dialog.open(PermitDeductionMaintenanceDialogComponent, {
      width: '80%', data: { permitDeductions }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
    
  }

  createTable() {
    let tableArr: Element[] = [];
    for(let i:number = 0; i <= this.activePermitDeductions.length - 1; i++) {
      let currentRow = this.activePermitDeductions[i];
      tableArr.push({financePartner: currentRow.financePartner, effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate), effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate),
        // permitDeductionRate: this.currencyPipe.transform(currentRow.permitDeductionRate), activeInd: currentRow.activeInd, permitDeductionId: currentRow.permitDeductionId,
        // Dilip Rate table changes
        permitDeductionRate: this.currencyPipe.transform(currentRow.permitDeductionRate,"USD",true,"1.3-3"), activeInd: currentRow.activeInd, permitDeductionId: currentRow.permitDeductionId,
      financePartnerId: currentRow.financePartnerId, purchaseMethod: currentRow.purchaseMethod, purchaseMethodId: currentRow.purchaseMethodId, salesTerritoryId: currentRow.salesTerritoryId,
    salesTerritory: currentRow.salesTerritory, utilityCompany: currentRow.utilityCompany, utilityCompanyId: currentRow.utilityCompanyId, minimumPpw: currentRow.minimumPpw});
    }
    this.dataSource = new MatTableDataSource(tableArr);
    this.originalDataSource = tableArr;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  searchForItem():void {
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
  financePartner: string,
  effectiveStartDate: string,
  effectiveEndDate: string,
  permitDeductionRate: string,
  activeInd: boolean,
  permitDeductionId: number,
  financePartnerId: number,
  purchaseMethod: string,
  purchaseMethodId: number,
  salesTerritoryId: number,
  salesTerritory: string,
  utilityCompany: string,
  utilityCompanyId: number,
  minimumPpw: number
}
