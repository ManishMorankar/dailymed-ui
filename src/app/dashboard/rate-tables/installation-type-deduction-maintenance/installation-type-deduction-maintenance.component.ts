import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { dateLessThanDate, maxInstallationTypeDeductionDate } from '../../../shared/validators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { InverterDeductionDialogComponent } from '../inverter-deduction-form/inverter-deduction-dialog.component';
import { MatDialog } from '@angular/material';
import { InstallationTypeDeductionMaintenanceDialogComponent } from '../installation-type-deduction-maintenance-dialog/installation-type-deduction-maintenance-dialog.component';

@Component({
  selector: 'app-installation-type-deduction-maintenance',
  templateUrl: './installation-type-deduction-maintenance.component.html',
  styleUrls: ['./installation-type-deduction-maintenance.component.css']
})
export class InstallationTypeDeductionMaintenanceComponent implements OnInit {
  allInstallationTypeDeductions: any;
  activeInstallationTypeDeductions: any;
  installationTypeDeductionGroup: any;
  dropdowns: any;
  installationTypeDeductionForm: FormGroup;
  addInd: boolean = false;
  installationTypeDefault: number = 1;
  salesTerritoryTypeDefault: number = 1;
  form: any;
  p: number = 1;
  searchText: string = "";

  originalDataSource;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columnNames = [
{
  id: "salesTerritory",
  value: "Sales Territory"
},
    {
    id: "installationType",
    value: "Installation Type"

  }, {
    id: "effectiveStartDate",
    value: "Effective Start Date"
  },
  {
    id: "effectiveEndDate",
    value: "Effective End Date"
  },
  {
    id: "installationTypeDeductionRate",
    value: "Installation Type Deduction Rate"
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

    this.installationTypeDeductionForm = this.formBuilder.group({
      installationType: [this.installationTypeDefault, [Validators.required]],
      salesTerritory: [this.salesTerritoryTypeDefault],
      effectiveStartDate: ['', [Validators.required]],
      installationTypeDeductionRate: [0, [Validators.required, Validators.max(20)]],
    });

    this.onChanges();
  }

  onChanges() {
    this.installationTypeDeductionForm.valueChanges.subscribe(val => {
      // console.log(this.installationTypeDeductionForm.errors);
    });
  }

  onSubmit() {
    if (!this.installationTypeDeductionForm.invalid) {
      var values = {
        installationTypeId: this.installationTypeDeductionForm.controls.installationType.value,
        salesTerritory: this.installationTypeDeductionForm.controls.salesTerritory.value,
        effectiveStartDate: this.installationTypeDeductionForm.controls.effectiveStartDate.value,
        installationTypeDeductionRate: this.installationTypeDeductionForm.controls.installationTypeDeductionRate.value
      }

      var body = {
        newInstallationTypeDeduction: values
      }

      this.apiService.post('InstallationTypeDeductionMaintenance', body)
        .subscribe(data => {
          this.toastMsg.success('Finance Partner Deduction Successfully Added');
          this.getAllInstallationTypeDeductions();
          this.getActiveInstallationTypeDeductions();
          this.addInd = !this.addInd;
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!');
        });
    }
  }

  getAllInstallationTypeDeductions() {
    this.apiService.get('InstallationTypeDeductionMaintenance/retrieveall')
      .subscribe(data => {
        console.log('all', data);
        this.allInstallationTypeDeductions = data;

        this.installationTypeDeductionForm.setValidators([maxInstallationTypeDeductionDate(this.allInstallationTypeDeductions)]);

        if (this.installationTypeDeductionGroup) this.getInstallationTypeDeductionGroup(this.installationTypeDeductionGroup[0]);
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getActiveInstallationTypeDeductions() {
    this.apiService.get('InstallationTypeDeductionMaintenance/retrieveactive')
      .subscribe(data => {
        console.log('active', data);
        this.activeInstallationTypeDeductions = data;
        this.displayedColumns = this.columnNames.map(x => x.id);
        
        this.createTable();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getDropdowns() {
    this.apiService.get('InstallationTypeDeductionMaintenance/dropdowns')
      .subscribe(data => {
        
        this.dropdowns = data;
        this.getAllInstallationTypeDeductions();
        this.getActiveInstallationTypeDeductions();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getInstallationTypeDeductionGroup(installationTypeDeduction: any) {
    var installationTypeDeductions = this.allInstallationTypeDeductions.filter(x => x.installationTypeId === installationTypeDeduction.installationTypeId);

    this.installationTypeDeductionGroup = installationTypeDeductions;
  }

  get installationTypeDeductionRate() { return this.installationTypeDeductionForm.get('installationTypeDeductionRate'); }

  rowClick(installationTypeDeduction: any) {
    var installationTypeDeduction = this.allInstallationTypeDeductions.filter(x => x.installationTypeId === installationTypeDeduction.installationTypeId && x.salesTerritoryId === installationTypeDeduction.salesTerritoryId);

    const dialogRef = this.dialog.open(InstallationTypeDeductionMaintenanceDialogComponent, {
      width: '80%', data: { installationTypeDeduction }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }



  createTable() {
    let tableArr: Element[] = [];
    for (let i: number = 0; i <= this.activeInstallationTypeDeductions.length - 1; i++) {
      let currentRow = this.activeInstallationTypeDeductions[i];
      tableArr.push({
        installationType: currentRow.installationType, effectiveStartDate: this.datePipe.transform(currentRow.effectiveStartDate), effectiveEndDate: this.datePipe.transform(currentRow.effectiveEndDate),
        // installationTypeDeductionRate: this.currencyPipe.transform(currentRow.installationTypeDeductionRate), activeInd: currentRow.activeInd, installationTypeDeductionId: currentRow.installationTypeDeductionId,
        // Dilip Rate table changes
        installationTypeDeductionRate: this.currencyPipe.transform(currentRow.installationTypeDeductionRate, "USD", true, "1.3-3"), activeInd: currentRow.activeInd, installationTypeDeductionId: currentRow.installationTypeDeductionId,
        installationTypeId: currentRow.installationTypeId, salesTerritory: currentRow.salesTerritory, salesTerritoryId: currentRow.salesTerritoryId
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
  installationType: string,
  effectiveStartDate: string,
  effectiveEndDate: string,
  installationTypeDeductionRate: string,
  activeInd: boolean,
  installationTypeDeductionId: number,
  installationTypeId: number,
  salesTerritory: string,
  salesTerritoryId: number
}
