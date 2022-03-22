import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { UsersListComponent } from './usermanagment/users-list/users-list.component'
import { AddUserComponent } from './usermanagment/add-user/add-user.component'
import { EditUserComponent } from './usermanagment/edit-user/edit-user.component'
import { AuthGuard } from '../guards/auth.guard';
import { AdminAccessGuard } from '../guards/admin-access.guard';
import { LegalAdminDashboardComponent } from './legalAdmin-dashboard/legalAdmin-dashboard.component';
import { OrganizationComponent } from './masters/organization/organization-component';

import { UsersComponent } from './masters/users/users-component';
import { AssignUserLicenseComponent } from './masters/assign-user-license/assign-user-license-component';
import { DocumentStatusReportComponent } from './masters/document-status-report/document-status-report-component';
import { DailyMedReportComponent } from './masters/daily-med-report/daily-med-report-component';
import { OptionsComponent } from '../dashboard/options/options-component';




const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/legal', component: DailyMedReportComponent },
  { path: 'usermanagement', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'commissions/rule', loadChildren: 'src/app/dashboard/create-rule/create-rule.module#CreateRuleModule', canActivate: [AuthGuard] },
  // { path: 'commissions/rule', loadChildren: '../dashboard/create-rule/create-rule.module#CreateRuleModule', canActivate: [AuthGuard] },
  { path: 'commissions/ratetables', loadChildren: 'src/app/dashboard/rate-tables/rate-tables.module#RateTablesModule', canActivate: [AuthGuard] },
  
  /** User Managment */
  { path: 'commissions/usermanagement/users', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'commissions/usermanagement/users/create', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'commissions/usermanagement/users/edit', component: EditUserComponent, canActivate: [AuthGuard] }, //, canActivate:[AdminAccessGuard]
  { path: 'dashboard/masters/organization', component: OrganizationComponent, canActivate: [AuthGuard] },
 //{ path: 'dashboard/masters/users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/masters/users', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/masters/users/create', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/masters/users/edit', component: EditUserComponent, canActivate: [AuthGuard] }, 

  { path: 'dashboard/masters/assignuserlicense', component: AssignUserLicenseComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/masters/document-status-report', component: DocumentStatusReportComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/masters/daily-med-report', component: DailyMedReportComponent },
  { path: 'options', component: OptionsComponent, canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
