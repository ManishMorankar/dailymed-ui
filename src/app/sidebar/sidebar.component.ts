import { Component, OnInit, ViewChild,AfterContentChecked } from '@angular/core';
import { SidenavService } from '../services/sidenav.service';
import { ApiService } from '../services/api.service';
import { MatDrawer } from '@angular/material';
import { SharedSidebarService } from '../shared/sidebar-icon';
import {Router, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatDrawer) public sidenav: MatDrawer;
  dashboard: boolean;
  subRateTables: boolean;
  subPaymentTables: boolean;
  subApplications: boolean;

  sidebarvalue: string;
  menuValue: string;
  
  constructor(public apiService: ApiService, private router: Router, private sidenavService: SidenavService, private sharedSidebarService: SharedSidebarService) {
    this.sharedSidebarService.sidebarToggle = "open";

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        console.log(val.url);
        if (val.url == "/ui/dashboard/finance" || val.url == "/ui/dashboard" || val.url == "/ui/dashboard/sales" || val.url == "/ui/dashboard/legal" ) {
         
          this.sidenav.open();
      this.sharedSidebarService.updateSidebarToggle("open");
      this.sharedSidebarService.updateMenuToggle("close");
      console.log(this.sharedSidebarService.sidebarToggle);
        } else {
          this.sidenav.open();
          this.sharedSidebarService.updateSidebarToggle("open"); 
      this.sharedSidebarService.updateMenuToggle("close");
        }
      }
    })
  }

  ngOnInit() {

  }
  ngAfterContentChecked() {
    this.menuValue = this.sharedSidebarService.menuToggle;
  }

  // addValue(str) {
  //   this.sharedSidebarService.updateComp1Val(str);
  // }

  toggleRateTableDropdown() {
    this.subRateTables = !this.subRateTables;
  }
  togglePaymentDropdown() {
    this.subPaymentTables = !this.subPaymentTables;
  }
  toggleApplicationsDropdown() {
    this.subApplications = !this.subApplications;
  }
  toggleSidenav() {
    console.log(this.sidenav);
    this.sidenav.close();
    this.sharedSidebarService.updateSidebarToggle("close");
    this.sharedSidebarService.updateMenuToggle("open");
  }
  updateSidebarService() {
    this.sharedSidebarService.updateSidebarToggle("open");
    this.sharedSidebarService.updateMenuToggle("close");
  }

  goHome(){
    this.sharedSidebarService.updateSidebarToggle("open");
    this.sharedSidebarService.updateMenuToggle("close");
    this.router.navigate(['/ui/dashboard']);
  }

}
