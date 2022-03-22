import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxFinancePartnerDeductionDate } from '../../../shared/validators';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import {MatPaginator} from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { FinancePartnerDeductionDialogComponent } from '../finance-partner-deduction-dialog/finance-partner-deduction-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-finance-partner-deduction-maintenance',
  templateUrl: './finance-partner-deduction-maintenance.component.html',
  styleUrls: ['./finance-partner-deduction-maintenance.component.css']
})
export class FinancePartnerDeductionMaintenanceComponent implements OnInit {
  allFinancePartnerDeductions: any;
  activeFinancePartnerDeductions: any;
  financePartnerDeductionGroup: any;
  dropdowns: any;
  financePartnerDeductionForm: FormGroup;
  addInd: boolean = false;
  financePartnerDefault: number = 1;
  form: any;
  p: number = 1;
  searchText: string = "";

  originalDataSource;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  columnNames = [{
    id: "financePartner",
    value: "Finance Partner"

  }, {
    id: "effectiveStartDate",
    value: "Effective Start Date"
  },
  {
    id: "effectiveEndDate",
    value: "Effective End Date"
  },
  {
    id: "financePartnerDeductionRate",
    value: "Finance Partner Deduction Rate"
  }];

  constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe, 
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe,private dialog: MatDialog) {

  }

  ngOnInit() {
    if (!this.apiService.checkPermission('ViewRateTables')) {
      // this.router.navigate(['/ui/dashboard'])
      this.apiService.goBack();
      this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    }
    this.getDropdowns();

    this.financePartnerDeductionForm = this.formBuilder.group({
      financePartner: [this.financePartnerDefault, [Validators.required]],
      effectiveStartDate: ['', [Validators.required]],
      financePartnerDeductionRate: [0, [Validators.required, Validators.max(20)]],
    });

    this.onChanges();
  }

  onChanges() {
    this.financePartnerDeductionForm.valueChanges.subscribe(val => {
      // console.log(this.financePartnerDeductionForm.errors);
    });
  }

  onSubmit() {
    if (!this.financePartnerDeductionForm.invalid) {
      var values = {
        financePartnerId: this.financePartnerDeductionForm.controls.financePartner.value,
        effectiveStartDate: this.financePartnerDeductionForm.controls.effectiveStartDate.value,
        financePartnerDeductionRate: this.financePartnerDeductionForm.controls.financePartnerDeductionRate.value
      }

      var body = {
        newFinancePartnerDeduction: values
      }

      this.apiService.post('FinancePartnerDeductionMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Finance Partner Deduction Successfully Added');
          this.getAllFinancePartnerDeductions();
          this.getActiveFinancePartnerDeductions();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllFinancePartnerDeductions() {
    this.apiService.get('FinancePartnerDeductionMaintenance/retrieveall')
      .subscribe(data => {
        this.allFinancePartnerDeductions = data;

        this.financePartnerDeductionForm.setValidators([maxFinancePartnerDeductionDate(this.allFinancePartnerDeductions)]);

        if (this.financePartnerDeductionGroup) this.getFinancePartnerDeductionGroup(this.financePartnerDeductionGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActiveFinancePartnerDeductions() {
    this.apiService.get('FinancePartnerDeductionMaintenance/retrieveactive')
      .subscribe(data => {
        this.activeFinancePartnerDeductions = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('FinancePartnerDeductionMaintenance/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
        this.getAllFinancePartnerDeductions();
        this.getActiveFinancePartnerDeductions();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getFinancePartnerDeductionGroup(financePartnerDeduction: any) {
    var financePartnerDeductions = this.allFinancePartnerDeductions.filter(x => x.financePartnerId === financePartnerDeduction.financePartnerId);

    this.financePartnerDeductionGroup = financePartnerDeductions;
  }

  get financePartnerDeductionRate() { return this.financePartnerDeductionForm.get('financePartnerDeductionRate'); }

  rowClick(financePartnerDeduction: any) {
    var financePartnerDeduction = this.allFinancePartnerDeductions.filter(x => x.financePartnerId === financePartnerDeduction.financePartnerId);
    const dialogRef = this.dialog.open(FinancePartnerDeductionDialogComponent, {
      width: '80%', data: { financePartnerDeduction }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  createTable() {
    let tableArr: Element[] = [];
    for(let i:number = 0; i <= this.activeFinancePartnerDeductions.length - 1; i++) {
      let currentRow = this.activeFinancePartnerDeductions[i];
      tableArr.push({financePartner: currentRow.financePartner, effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate), effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate),
        // financePartnerDeductionRate: this.currencyPipe.transform(currentRow.financePartnerDeductionRate), activeInd: currentRow.activeInd, financePartnerDeductionId: currentRow.financePartnerDeductionId,
        // Dilip Rate table changes
        financePartnerDeductionRate: this.currencyPipe.transform(currentRow.financePartnerDeductionRate,"USD",true,"1.3-3"), activeInd: currentRow.activeInd, financePartnerDeductionId: currentRow.financePartnerDeductionId,
      financePartnerId: currentRow.financePartnerId});
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
  financePartnerDeductionRate: string,
  activeInd: boolean,
  financePartnerDeductionId: number,
  financePartnerId: number
}
