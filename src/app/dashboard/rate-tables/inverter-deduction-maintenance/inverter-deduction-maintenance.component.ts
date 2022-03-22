import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxInverterDeductionDate } from '../../../shared/validators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { InverterDeductionDialogComponent } from '../inverter-deduction-form/inverter-deduction-dialog.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-inverter-deduction-maintenance',
  templateUrl: './inverter-deduction-maintenance.component.html',
  styleUrls: ['./inverter-deduction-maintenance.component.css']
})
export class InverterDeductionMaintenanceComponent implements OnInit {
  allInverterDeductions: any;
  activeInverterDeductions: any;
  inverterDeductionGroup: any;
  dropdowns: any;
  inverterDeductionForm: FormGroup;
  addInd: boolean = false;
  inverterTypeDefault: number = 1;
  financePartnerDefault: number = 1;
  form: any;
  p: number = 1;
  searchText: string = "";

  originalDataSource;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columnNames = [{
    id: "inverterType",
    value: "Inverter Type"
  },
  {
    id: "financePartner",
    value: "Finance Partner"
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
    id: "inverterDeductionRate",
    value: "Inverter Deduction Rate"
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

    this.inverterDeductionForm = this.formBuilder.group({
      inverterType: [this.inverterTypeDefault, [Validators.required]],
      financePartner: [this.financePartnerDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      inverterDeductionRate: [0, [Validators.required, Validators.max(20)]],
    });

    this.onChanges();
  }

  onChanges() {
    this.inverterDeductionForm.valueChanges.subscribe(val => {
      // console.log(this.inverterDeductionForm.errors);
    });
  }

  onSubmit() {
    if (!this.inverterDeductionForm.invalid) {
      var values = {
        inverterTypeId: this.inverterDeductionForm.controls.inverterType.value,
        financePartnerId: this.inverterDeductionForm.controls.financePartner.value,
        effectiveStartDate: this.inverterDeductionForm.controls.effectiveStartDate.value,
        inverterDeductionRate: this.inverterDeductionForm.controls.inverterDeductionRate.value
      }

      var body = {
        newInverterDeduction: values
      }

      this.apiService.post('InverterDeductionMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Inverter Deduction Successfully Added');
          this.getAllInverterDeductions();
          this.getActiveInverterDeductions();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllInverterDeductions() {
    this.apiService.get('InverterDeductionMaintenance/retrieveall')
      .subscribe(data => {
        this.allInverterDeductions = data;

        this.inverterDeductionForm.setValidators([maxInverterDeductionDate(this.allInverterDeductions)]);

        if (this.inverterDeductionGroup) this.getInverterDeductionGroup(this.inverterDeductionGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActiveInverterDeductions() {
    this.apiService.get('InverterDeductionMaintenance/retrieveactive')
      .subscribe(data => {
        this.activeInverterDeductions = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('InverterDeductionMaintenance/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllInverterDeductions();
        this.getActiveInverterDeductions();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getInverterDeductionGroup(inverterDeduction: any) {
    // var inverterDeductions = this.allInverterDeductions.filter(x => x.financePartnerId === inverterDeduction.financePartnerId);
    var inverterDeductions = this.allInverterDeductions.filter(x => x.financePartnerId === inverterDeduction.financePartnerId && x.inverterTypeId === inverterDeduction.inverterTypeId);  // dilip
    this.inverterDeductionGroup = inverterDeductions;
  }

  get inverterDeductionRate() { return this.inverterDeductionForm.get('inverterDeductionRate'); }

  rowClick(inverterDeduction: any) {
    var inverterDeductions = this.allInverterDeductions.filter(x => x.financePartnerId === inverterDeduction.financePartnerId && x.inverterTypeId === inverterDeduction.inverterTypeId);  // dilip
    const dialogRef = this.dialog.open(InverterDeductionDialogComponent, {
      width: '80%', data: { inverterDeductions }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activeInverterDeductions.length - 1; i++) {
      let currentRow = this.activeInverterDeductions[i];
      tableArr.push({
        financePartner: currentRow.financePartner, effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate), effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate),
        // inverterDeductionRate: this.currencyPipe.transform(currentRow.inverterDeductionRate), activeInd: currentRow.activeInd, inverterDeductionId: currentRow.inverterDeductionId,
        // Dilip Rate table changes
        inverterDeductionRate: this.currencyPipe.transform(currentRow.inverterDeductionRate,"USD",true,"1.3-3"), activeInd: currentRow.activeInd, inverterDeductionId: currentRow.inverterDeductionId,
        financePartnerId: currentRow.financePartnerId, inverterType: currentRow.inverterType, inverterTypeId: currentRow.inverterTypeId
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
  financePartner: string,
  effectiveStartDate: string,
  effectiveEndDate: string,
  inverterDeductionRate: string,
  activeInd: boolean,
  inverterDeductionId: number,
  financePartnerId: number,
  inverterType: string,
  inverterTypeId: string
}