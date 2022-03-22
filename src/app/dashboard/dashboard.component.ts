import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import {ApiService} from "../services/api.service";
import {Router} from "@angular/router";
import { SidenavService } from '../services/sidenav.service';
import { SharedSidebarService } from '../shared/sidebar-icon';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatDrawer) public sidenav: MatDrawer;
  userRole: String;
  // prodBody: boolean = true;
  // stagingBody: boolean = false;
  // testBody: boolean = false;
  appsBody: boolean = true;
  title: String;
  sideBgImg: String;
  listOfApplications: any;
  // productionList: [];
  // stagingList: [];
  // testList: [];
  appsList: [];
  userMngtBody: boolean = false;
  sidebarvalue: string;
  menuValue: string;
  constructor(public apiService: ApiService, private router: Router, private sidenavService: SidenavService, private sharedSidebarService: SharedSidebarService) {
    this.sharedSidebarService.sidebarToggle = "open";
  }

  ngOnInit() {
    this.router.navigate(['/ui/dashboard/legal']);
    this.listOfApplications = JSON.parse(localStorage.getItem('listOfApplications'))
    this.setApplications(this.listOfApplications)
    this.title = "Central System Dashboard"
    if( !this.apiService.isLoggedIn() ){
      this.router.navigate(['/']);
    }
    this.sharedSidebarService.sidebarToggle = "open";
  }
  ngAfterContentChecked() {
    this.menuValue = this.sharedSidebarService.menuToggle;
  }

  /**
   * Dashboard sidebar tab functionality 
   * @param type 
   */

  onSideMenu(type: String){
    if(type === 'prod'){
      // this.prodBody = true
      // this.stagingBody = false;
      // this.testBody = false;
      this.userMngtBody = false;
    }else if(type === 'staging'){
      // this.prodBody = false
      // this.stagingBody = true;
      // this.testBody = false;
      this.userMngtBody = false;
    }else if(type === 'test'){
      // this.prodBody = false
      // this.stagingBody = false;
      // this.testBody = true;
      this.userMngtBody = false;
    }else if(type === 'apps'){
      // this.prodBody = false
      // this.stagingBody = false;
      // this.testBody = true;
      this.appsBody = true;
      this.userMngtBody = false;
    }else if(type === 'userMngt'){
      // this.prodBody = false
      // this.stagingBody = false;
      // this.testBody = false;
      this.appsBody = false;
      this.userMngtBody = true;
    }
  }

  /**
   * Set applications
   */
  setApplications(appList:any){
    // if(appList && appList[0].production)
    //   this.productionList = appList[0].production;
    // if(appList && appList[0].staging)
    //   this.stagingList = appList[0].staging;
    // if(appList && appList[0].test)
    //   this.testList = appList[0].test;
    if(appList && appList[0].apps)
      this.appsList = appList[0].apps;
  }

  /**
   * Redirect Dashboard based on role
   */
  redirectDashboard(){
    this.toggleSidenav();
    // this.sharedSidebarService.updateComp2Val("close");
    // this.addValue("close");
    
    let role = this.apiService.getRole()
    if(role == 'Sales Reps' && this.apiService.checkPermission('ViewSalesRepDashboard')){
      this.router.navigate(['/ui/commissions/salesrepdashboard', this.apiService.getContactId()]);
    }else if (role == 'Finance Admin' || role == 'Finance Admin With UAM' || role == 'Finance User' || role == 'BT Admin'){
      this.router.navigate(['/ui/dashboard/finance']);
    }else if(role == 'Sales Admin-Admin' || role == 'Sales Admin-User'){
      this.router.navigate(['/ui/dashboard/sales']);
    }else if(role == 'Legal Admin' || role == 'Legal User' || role == 'BT Support'){
      this.router.navigate(['/ui/dashboard/legal']);
    } else if (role == 'User Access Management(UAM)') {
      this.router.navigate(['/ui/usermanagement'])
    } else {
      this.router.navigate(['/unauthorized'])
    }
  }
  // addValue(str) {
  //   this.sharedSidebarService.updateComp1Val(str);
  // }
  toggleSidenav() {
    console.log(this.sidenavService, 'side nav');
    if (this.sharedSidebarService.sidebarToggle == "open") {
      this.sharedSidebarService.sidebarToggle = "close";
    } else {this.sharedSidebarService.sidebarToggle = "open";}
    //this.sharedSidebarService.updateComp2Val("open");
    // this.addValue("close");
  }
  updateSidebarService() {
    this.sharedSidebarService.updateSidebarToggle("open");
    this.sharedSidebarService.updateMenuToggle("close");
  }

}
