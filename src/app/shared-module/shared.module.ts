import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { RouterModule } from '@angular/router';
import { GoBackComponent } from '../go-back/go-back.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { InverterDeductionDialogComponent } from '../dashboard/rate-tables/inverter-deduction-form/inverter-deduction-dialog.component';
import { FinancePartnerDeductionDialogComponent } from '../dashboard/rate-tables/finance-partner-deduction-dialog/finance-partner-deduction-dialog.component';
import { TerritoryRateMaintenanceDialogComponent } from '../dashboard/rate-tables/territory-rate-maintenance-dialog/territory-rate-maintenance-dialog.component';
import { ModuleDeductionMaintenanceDialogComponent } from '../dashboard/rate-tables/module-deduction-maintenance-dialog/module-deduction-maintenance-dialog.component';
import { PurchaseMethodDeductionMaintenanceDialogComponent } from '../dashboard/rate-tables/purchase-method-deduction-maintenance-dialog/purchase-method-deduction-maintenance-dialog.component';
import { PpaBonusRateMaintenanceDialogComponent } from '../dashboard/rate-tables/ppa-bonus-rate-maintenance-dialog/ppa-bonus-rate-maintenance-dialog.component';
import { TieredOverageMaintenanceDialogComponent } from '../dashboard/rate-tables/teired-overage-dialog/teired-overage-dialog.component';
import { OutReachConfigurationMaintenanceDialogComponent } from '../dashboard/rate-tables/out-reach-configuration-maintenance-dialog/out-reach-configuration-maintenance-dialog.component';
import { PermitDeductionMaintenanceDialogComponent } from '../dashboard/rate-tables/permit-deduction-maintenance-dialog/permit-deduction-maintenance-dialog.component';
import { InstallationTypeDeductionMaintenanceDialogComponent } from '../dashboard/rate-tables/installation-type-deduction-maintenance-dialog/installation-type-deduction-maintenance-dialog.component';
import { VersionDialogComponent } from '../header/version-dialog/version-dialog.component';
@NgModule({
  declarations: [
    ConfirmationModalComponent,
    GoBackComponent,
    LoginDialogComponent,
    InverterDeductionDialogComponent,
    FinancePartnerDeductionDialogComponent,
    TerritoryRateMaintenanceDialogComponent,
    ModuleDeductionMaintenanceDialogComponent,
    PurchaseMethodDeductionMaintenanceDialogComponent,
    PpaBonusRateMaintenanceDialogComponent,
    TieredOverageMaintenanceDialogComponent,
    OutReachConfigurationMaintenanceDialogComponent,
    PermitDeductionMaintenanceDialogComponent,
    InstallationTypeDeductionMaintenanceDialogComponent,
    VersionDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [
    ConfirmationModalComponent,
    GoBackComponent,
    LoginDialogComponent
  ],
  entryComponents: [
    LoginDialogComponent,
    InverterDeductionDialogComponent,
    FinancePartnerDeductionDialogComponent,
    TerritoryRateMaintenanceDialogComponent,
    ModuleDeductionMaintenanceDialogComponent,
    PurchaseMethodDeductionMaintenanceDialogComponent,
    PpaBonusRateMaintenanceDialogComponent,
    TieredOverageMaintenanceDialogComponent,
    OutReachConfigurationMaintenanceDialogComponent,
    PermitDeductionMaintenanceDialogComponent,
    InstallationTypeDeductionMaintenanceDialogComponent,
    VersionDialogComponent
  ]
})
export class SharedModule { }
