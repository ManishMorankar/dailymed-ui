import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RateTablesRoutingModule } from './rate-tables-routing.module';
import { RateTablesComponent } from './rate-tables.component';
import { TerritoryRateMaintenanceComponent } from './territory-rate-maintenance/territory-rate-maintenance.component';
import { OutReachConfigurationComponent } from './out-reach-configuration-maintenance/out-reach-configuration-maintenance.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxPaginationModule } from 'ngx-pagination';
import { FinancePartnerDeductionMaintenanceComponent } from './finance-partner-deduction-maintenance/finance-partner-deduction-maintenance.component';
import { ModuleDeductionMaintenanceComponent } from './module-deduction-maintenance/module-deduction-maintenance.component';
import { InverterDeductionMaintenanceComponent } from './inverter-deduction-maintenance/inverter-deduction-maintenance.component';
import { InstallationTypeDeductionMaintenanceComponent } from './installation-type-deduction-maintenance/installation-type-deduction-maintenance.component';
import { PurchaseMethodDeductionMaintenanceComponent } from './purchase-method-deduction-maintenance/purchase-method-deduction-maintenance.component';
import { PermitDeductionMaintenanceComponent } from './permit-deduction-maintenance/permit-deduction-maintenance.component';
import { PpaBonusRateMaintenanceComponent } from './ppa-bonus-rate-maintenance/ppa-bonus-rate-maintenance.component';
import { MainPipeModule } from 'src/app/pipe/main-pipe.module';
import { MatTableModule, MatSortModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import { TableFilterPipe } from '../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FinancePartnerDeductionDialogComponent } from './finance-partner-deduction-dialog/finance-partner-deduction-dialog.component';
import { TerritoryRateMaintenanceDialogComponent } from './territory-rate-maintenance-dialog/territory-rate-maintenance-dialog.component';
import { ModuleDeductionMaintenanceDialogComponent } from './module-deduction-maintenance-dialog/module-deduction-maintenance-dialog.component';
import { InstallationTypeDeductionMaintenanceDialogComponent } from './installation-type-deduction-maintenance-dialog/installation-type-deduction-maintenance-dialog.component';
import { PurchaseMethodDeductionMaintenanceDialogComponent } from './purchase-method-deduction-maintenance-dialog/purchase-method-deduction-maintenance-dialog.component';
import { PpaBonusRateMaintenanceDialogComponent } from './ppa-bonus-rate-maintenance-dialog/ppa-bonus-rate-maintenance-dialog.component';
import { OutReachConfigurationMaintenanceDialogComponent } from './out-reach-configuration-maintenance-dialog/out-reach-configuration-maintenance-dialog.component';
import { PermitDeductionMaintenanceDialogComponent } from './permit-deduction-maintenance-dialog/permit-deduction-maintenance-dialog.component';
import {TeiredOverageComponent} from './teired-overage/teired-overage-maintenance.component';

@NgModule({
  declarations: [
    RateTablesComponent,
    TerritoryRateMaintenanceComponent,
	OutReachConfigurationComponent,
    FinancePartnerDeductionMaintenanceComponent,
    ModuleDeductionMaintenanceComponent,
    InverterDeductionMaintenanceComponent,
    InstallationTypeDeductionMaintenanceComponent,
    PurchaseMethodDeductionMaintenanceComponent,
    PermitDeductionMaintenanceComponent,
    PpaBonusRateMaintenanceComponent,
    TeiredOverageComponent    
  ],
  imports: [
    CommonModule,
    RateTablesRoutingModule,
    NgxCurrencyModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipeModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
    MatPaginatorModule,
    SharedModule
  ],
  providers: [
    TableFilterPipe,
    DatePipe,
    PercentPipe,
    CurrencyPipe
  ]
})
export class RateTablesModule { }
