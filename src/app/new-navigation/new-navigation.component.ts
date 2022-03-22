import { Component, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, NavigationEnd } from "@angular/router";
import { ApiService } from '../services/api.service';
import { TooltipPosition } from '@angular/material/tooltip';


@Component({
  selector: 'app-new-navigation',
  templateUrl: './new-navigation.component.html',
  styleUrls: ['./new-navigation.component.css']
})
export class NewNavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isExpanded: boolean = true;
  subRateTables: boolean;
  subPaymentTables: boolean;
  subReportTables: boolean;
  subDashboardTables: boolean;
  subAdminTables: boolean;
  subAdministrationTables: boolean;
  subOrganizationTables: boolean;
  subUserMastersTables: boolean;
  subDocumentDetailsTables: boolean;
  subTransactionsTables: boolean;
  submaintananceTables: boolean;

  constructor(public apiService: ApiService, private router: Router, private breakpointObserver: BreakpointObserver) { }



  toggleRateTableDropdown() {
    this.isExpanded = !this.subRateTables;
    this.subRateTables = !this.subRateTables;
  }
  togglePaymentDropdown() {

    this.isExpanded = !this.subPaymentTables;
    this.subPaymentTables = !this.subPaymentTables;
  }
  toggleReportDropdown() {
    this.isExpanded = !this.subReportTables;
    this.subReportTables = !this.subReportTables;
  }

  downArrowMaintanance() {
    this.isExpanded = true;
    this.subPaymentTables = true;
  }
  downArrowPayment() {
    this.isExpanded = true;
    this.subPaymentTables = true;
  }
  downArrowReport() {
    this.isExpanded = true;
    this.subReportTables = true;
  }

  upArrowPayment() {
    this.subPaymentTables = false;
  }
  upArrowMaintanance() {
    this.submaintananceTables = false;
  }

  upArrowReport() {
    this.subReportTables = false;
  }

  iconClickPayment() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subPaymentTables = true;
    } else {
      this.subPaymentTables = !this.subPaymentTables;
    }
  }
  iconClickmaintanence() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.submaintananceTables = true;
    } else {
      this.submaintananceTables = !this.submaintananceTables;
    }
  }
  iconClickReport() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subReportTables = true;
    } else {
      this.subReportTables = !this.subReportTables;
    }
  }

  paymentTextPayment() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subPaymentTables = true;
    }
    else {
      this.subPaymentTables = !this.subPaymentTables;
    }
  }
  maintenanceTextMaintanance() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.submaintananceTables = true;
    }
    else {
      this.submaintananceTables = !this.submaintananceTables;
    }
  }
  paymentTextReport() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subReportTables = true;
    }
    else {
      this.subReportTables = !this.subReportTables;
    }
  }

  downArrowRate() {
    this.isExpanded = true;
    this.subRateTables = true;
  }

  upArrowRate() {
    this.subRateTables = false;
  }

  iconClickRate() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subRateTables = true;
    } else {
      this.subRateTables = !this.subRateTables;
    }
  }
  paymentTextRate() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subRateTables = true;
    } else {
      this.subRateTables = !this.subRateTables;
    }
  }

  downArrowDashboard() {
    this.isExpanded = true;
    this.subDashboardTables = true;
  }

  upArrowDashboard() {
    this.subDashboardTables = false;
  }

  iconClickDashboard() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subDashboardTables = true;
    } else {
      this.subDashboardTables = !this.subDashboardTables;
    }
  }

  dashboardTextDashboard() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subDashboardTables = true;
    }
    else {
      this.subDashboardTables = !this.subDashboardTables;
    }
  }

  adminTextDashboard() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subAdminTables = true;
    }
    else {
      this.subAdminTables = !this.subAdminTables;
    }
  }

  downArrowAdmin() {
    this.isExpanded = true;
    this.subAdminTables = true;
  }

  upArrowAdmin() {
    this.subAdminTables = false;
  }

  downArrowAdministration() {
    this.isExpanded = true;
    this.subAdministrationTables = true;
  }

  upArrowAdministration() {
    this.subAdministrationTables = false;
  }

  downArrowOrganization() {
    this.isExpanded = true;
    this.subOrganizationTables = true;
  }

  upArrowOrganization() {
    this.subOrganizationTables = false;
  }

  downArrowDocumentDetails() {
    this.isExpanded = true;
    this.subDocumentDetailsTables = true;
  }

  upArrowDocumentDetails() {
    this.subDocumentDetailsTables = false;
  }

  downArrowTransactions() {
    this.isExpanded = true;
    this.subTransactionsTables = true;
  }

  upArrowTransactions() {
    this.subTransactionsTables = false;
  }

  downArrowUserMasters() {
    this.isExpanded = true;
    this.subUserMastersTables = true;
  }

  upArrowUserMasters() {
    this.subUserMastersTables = false;
  }

  iconClickAdmin() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subAdminTables = true;
    } else {
      this.subAdminTables = !this.subAdminTables;
    }
  }
  iconClickAdministration() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subAdministrationTables = true;
    } else {
      this.subAdministrationTables = !this.subAdministrationTables;
    }
  }
  iconClickOrganization() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subOrganizationTables = true;
    } else {
      this.subOrganizationTables = !this.subOrganizationTables;
    }
  }

  iconClickUserMasters() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subUserMastersTables = true;
    } else {
      this.subUserMastersTables = !this.subUserMastersTables;
    }
  }

  iconClickDocumentDetails() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subDocumentDetailsTables = true;
    } else {
      this.subDocumentDetailsTables = !this.subDocumentDetailsTables;
    }
  }

  iconClickTransactions() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subTransactionsTables = true;
    } else {
      this.subTransactionsTables = !this.subTransactionsTables;
    }
  }


  adminTextAdmin() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subAdminTables = true;
    }
    else {
      this.subAdminTables = !this.subAdminTables;
    }
  }

  adminTextAdministration() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subAdministrationTables = true;
    }
    else {
      this.subAdministrationTables = !this.subAdministrationTables;
    }
  }

  adminTextOrganization() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subOrganizationTables = true;
    }
    else {
      this.subOrganizationTables = !this.subOrganizationTables;
    }
  }

  adminTextUserMasters() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subUserMastersTables = true;
    }
    else {
      this.subUserMastersTables = !this.subUserMastersTables;
    }
  }

  adminTextDocumentDetails() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subDocumentDetailsTables = true;
    }
    else {
      this.subDocumentDetailsTables = !this.subDocumentDetailsTables;
    }
  }

  adminTextTransactions() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subTransactionsTables = true;
    }
    else {
      this.subTransactionsTables = !this.subTransactionsTables;
    }
  }

  adminTextReport() {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.subReportTables = true;
    }
    else {
      this.subReportTables = !this.subReportTables;
    }
  }



  menuToggle() {
    if (!this.isExpanded) {
      this.isExpanded = true;
    } else {
      this.isExpanded = false;

    }


  }


  leftArrowClick() {
    this.isExpanded = false;
    this.subRateTables = false;
    this.subPaymentTables = false;
    this.submaintananceTables = false;
    this.subDashboardTables = false;
  }
  rightArrowClick() {
    this.isExpanded = true;
  }

  checkShowMenu() {
    return this.apiService.showMenu();
  }
}
