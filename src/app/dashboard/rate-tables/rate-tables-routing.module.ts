import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { RateTablesComponent } from './rate-tables.component';
import { TerritoryRateMaintenanceComponent } from './territory-rate-maintenance/territory-rate-maintenance.component';
import { FinancePartnerDeductionMaintenanceComponent } from './finance-partner-deduction-maintenance/finance-partner-deduction-maintenance.component';
import { ModuleDeductionMaintenanceComponent } from './module-deduction-maintenance/module-deduction-maintenance.component';
import { InverterDeductionMaintenanceComponent } from './inverter-deduction-maintenance/inverter-deduction-maintenance.component';
import { InstallationTypeDeductionMaintenanceComponent } from './installation-type-deduction-maintenance/installation-type-deduction-maintenance.component';
import { PurchaseMethodDeductionMaintenanceComponent } from './purchase-method-deduction-maintenance/purchase-method-deduction-maintenance.component';
import { PermitDeductionMaintenanceComponent } from './permit-deduction-maintenance/permit-deduction-maintenance.component';
import { PpaBonusRateMaintenanceComponent } from './ppa-bonus-rate-maintenance/ppa-bonus-rate-maintenance.component';
import { OutReachConfigurationComponent } from './out-reach-configuration-maintenance/out-reach-configuration-maintenance.component';
import {TeiredOverageComponent} from './teired-overage/teired-overage-maintenance.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: RateTablesComponent, canActivate:[AuthGuard] },
  { path: 'territoryrate', component: TerritoryRateMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'financepartnerdeduction', component: FinancePartnerDeductionMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'modulededuction', component: ModuleDeductionMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'inverterdeduction', component: InverterDeductionMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'installationtypededuction', component: InstallationTypeDeductionMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'purchasemethoddeduction', component: PurchaseMethodDeductionMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'permitdeduction', component: PermitDeductionMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'ppabonusrate', component: PpaBonusRateMaintenanceComponent, canActivate:[AuthGuard] },
  { path: 'tieredoverage', component: TeiredOverageComponent, canActivate:[AuthGuard] },
  { path: 'outreachconfig', component: OutReachConfigurationComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateTablesRoutingModule { }