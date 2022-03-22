import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { CreateRuleModule } from '../dashboard/create-rule/create-rule.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { SharedModule } from '../shared-module/shared.module';
import { fromEventPattern } from 'rxjs';
import { RateTablesModule } from './rate-tables/rate-tables.module';

import { AddUserComponent } from './usermanagment/add-user/add-user.component';
import { EditUserComponent } from './usermanagment/edit-user/edit-user.component';
import { UsersListComponent } from './usermanagment/users-list/users-list.component';
import { MatRadioModule, MatCheckboxModule, MatGridListModule, MatListModule, MatDividerModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSort, MatPaginator, MatDialogModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatBadgeModule, MatTooltipModule } from '@angular/material';
import { MainPipeModule } from '../pipe/main-pipe.module';
import { MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CurrencyPipe } from '@angular/common';
// import { CreateStaticComponent } from './create-static/create-static.component';
//import { AdminAccessGuard } from '../guards/admin-access.guard';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { LegalAdminDashboardComponent } from './legalAdmin-dashboard/legalAdmin-dashboard.component';
import { SidenavService } from './../services/sidenav.service';
import { SharedSidebarService } from './../shared/sidebar-icon';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OrganizationComponent } from './masters/organization/organization-component';
import { UsersComponent } from "./masters/users/users-component";
import { AssignUserLicenseComponent } from "./masters/assign-user-license/assign-user-license-component";
import { DocumentStatusReportComponent } from "./masters/document-status-report/document-status-report-component";
import { DailyMedReportComponent } from "./masters/daily-med-report/daily-med-report-component";
import { OptionsComponent } from "./options/options-component"
import { NgSelectModule } from '@ng-select/ng-select';




@NgModule({
  declarations: [
    DashboardComponent,
    SearchComponent,
    AddUserComponent,
    EditUserComponent,
    UsersListComponent,
    LegalAdminDashboardComponent,
    ConfirmationDialogComponent,
    OrganizationComponent,
    
    UsersComponent,
    AssignUserLicenseComponent,
    DocumentStatusReportComponent,
    DailyMedReportComponent,
    OptionsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CreateRuleModule,
    NgxCurrencyModule,
    SharedModule,
    RateTablesModule,
    MatRadioModule,
    MainPipeModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
    MatPaginatorModule,
    MatGridListModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatTooltipModule,
    MatAutocompleteModule,
    NgSelectModule
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    MatDatepickerModule,
    SidenavService,
    SharedSidebarService
  ],
  entryComponents: [
    ConfirmationModalComponent,
    ConfirmationDialogComponent
  ]
  //providers: [AdminAccessGuard]
})
export class DashboardModule { }
