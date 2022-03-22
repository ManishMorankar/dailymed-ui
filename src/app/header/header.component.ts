import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ApiService } from "../services/api.service";
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { SidenavService } from '../services/sidenav.service';
import { SharedSidebarService } from '../shared/sidebar-icon';
import { VersionDialogComponent } from './version-dialog/version-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterContentChecked {
  authUser: boolean = false
  loggedUserName: String;
  title: String = 'Welcome Trinity Systems'
  homeUrl: boolean = false;
  isTokenExpired: boolean = false;
  icon: string = "menu";
  showSearch: boolean = true;
  sidebarToggle: boolean;

  sidebarvalue: string;
  menuValue: string;


  constructor(public apiService: ApiService, private router: Router, private location: Location, public dialog: MatDialog, private sidenav: SidenavService, private sharedSidebarService: SharedSidebarService) {
    router.events.subscribe((val) => {
      if (location.path() != '' && location.path().indexOf('ui/dashboard') !== -1 || this.apiService.getRole() == 'Sales Reps') {
        this.homeUrl = false;
      } else {
        this.homeUrl = true
      }
    });

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        console.log(val.url);
        if (val.url == "/ui/usermanagement" || !this.apiService.checkPermission('AccessSearchBar')) {
          this.showSearch = false;
        } else {
          this.showSearch = true;
        }

        if (val.url == "/ui/dashboard/finance" || val.url == "/ui/dashboard" || val.url == "/ui/dashboard/sales" || val.url == "/ui/dashboard/legal") {
          //this.sidenav.sidenav.opened = false;
          this.icon = "keyboard_backspace"
          if (this.sidenav.sidenav != undefined) {
            this.sidenav.open();
          }
          this.sharedSidebarService.updateSidebarToggle("open");
          this.sharedSidebarService.updateMenuToggle("close");

          // this.sidebarToggle = false;
          //this.addValue("open");
        } else {
          this.sidebarToggle = true;
          this.showSearch = true;
          this.sidenav.open();
          this.sharedSidebarService.updateSidebarToggle("open");
          this.sharedSidebarService.updateMenuToggle("close");
        }
        if (val.url == "/ui/dashboard/finance" || val.url == "/ui/dashboard/sales" || val.url == "/ui/dashboard/legal") {

        }
      }
    })

    this.apiService.isTokenExpired.subscribe(v => {
      console.log("Page Expired......", v);
      this.isTokenExpired = v;
      // dilip Com-1049
      // if(this.isTokenExpired){
      //   this.dialog.closeAll();
      //   const dialogRef = this.dialog.open(LoginDialogComponent, {
      //     width: '500px',
      //     data: {isTokenExpired: v}
      //   });

      //   dialogRef.afterClosed().subscribe(result => {
      //     console.log('The dialog was closed');
      //   });
      // }else{
      //   this.dialog.closeAll();
      // }
    });

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (this.sidenav.sidenav != undefined && this.sidenav.sidenav.opened) {
          // this.icon = "close";
          this.icon = "menu"
        } else {
          this.icon = "menu"
        }
      }
    });

    this.sidebarToggle = true;
    //this.sharedSidebarService.menuValue = "open";
  }
  ngAfterContentChecked() {
    this.sidebarvalue = this.sharedSidebarService.sidebarToggle;
    if (this.sharedSidebarService.sidebarToggle == "open") {
      this.sidebarToggle = false;
    } else {
      this.sidebarToggle = true;
    }
  }

  // addValue(str) {
  //   this.sharedSidebarService.updateComp2Val(str);
  // }

  toggleSidenav() {
    if (this.sidenav.sidenav.opened) {
      this.sidenav.close();
      this.icon = "menu"
    } else {
      this.sidenav.open();

      this.icon = "menu"
    }

    // console.log("Status", this.sidenav.sidenav.opened);
    // this.sharedSidebarService.updateSidebarToggle("open");
    // this.sharedSidebarService.updateMenuToggle("close");
    //   this.sidenav.open();

  }

  ngOnInit() {
    if (this.sidenav.sidenav != undefined) {
      this.sidenav.sidenav.opened = true;
    }
    this.sharedSidebarService.updateSidebarToggle("open");
    this.sharedSidebarService.updateMenuToggle("close");
    this.sidebarToggle = true;
    if (this.sidenav.sidenav != undefined) {
      this.sidenav.open();
    }
    // if(this.apiService.getToken() && this.apiService.getUserObj()){
    //   this.authUser = true;
    //   this.loggedUserName = this.apiService.getUserName()
    // }
  }

  dashboard() {
    let role = this.apiService.getRole()
    if (role == 'Sales Reps' && this.apiService.checkPermission('ViewSalesRepDashboard')) {
      this.router.navigate(['/ui/commissions/salesrepdashboard', this.apiService.getContactId()]);
    } else if (role == 'Finance Admin' || role == 'Finance Admin With UAM' || role == 'Finance User') {
      this.router.navigate(['/ui/dashboard/finance']);

    } else if (role == 'Sales Admin-Admin' || role == 'Sales Admin-User') {
      this.router.navigate(['/ui/dashboard/sales']);
    } else if (role == 'Legal Admin' || role == 'Legal User' || role == 'BT Support' || role == 'BT Admin') {
      this.router.navigate(['/ui/dashboard/legal']);
    }
  }

  logOut() {
    this.apiService.logout();
    window.location.reload();
    this.router.navigate(['/login']);
   


  }

  openVersionDialog() {
    var date: Date = new Date(new Date(Date.now()).toLocaleString() + ' UTC');
    const dialogRef = this.dialog.open(VersionDialogComponent, {
      width: '500px',
      data: {
        lastSyncDate: date,
        lastSyncDateUtc: Date.now()
      }
    })
  }


}
