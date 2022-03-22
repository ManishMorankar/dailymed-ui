import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiService } from "./services/api.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { MatSidenav, MatSidenavContainer, MatDrawer } from '@angular/material';
import { SidenavService } from './services/sidenav.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Employee } from './services/employee';
import { DataService } from './services/data.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(SidebarComponent) public sidebarComponent: SidebarComponent;

  subRateTables: boolean;
  dashboard: boolean;

  title = 'DailyMed System';

  employees: Employee[];
  errorMessage: any;

  invalidLogin: boolean = false;

  constructor(public apiService: ApiService, private router: Router, private changeDetectorRef: ChangeDetectorRef, private sidenavService: SidenavService, private dataService: DataService, private toastMsg: ToastrService) {
    this.apiService.hideLoader = true;
    // this.changeDetectorRef.detectChanges();
    if (!this.apiService.isLoggedIn()) {
      //this.router.navigate(['Login'])
      this.router.navigate([''])
    }

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        console.log(val.url);
        if (val.url == null || val.url == "/" || val.url == "/ui/dashboard" || val.url == "/login") {
          localStorage.setItem('CurrentUrl', "/ui/dashboard");
          if (this.apiService.isLoggedIn()) {
             let role = this.apiService.getRole()
            localStorage.setItem('showMenu', "true");
            if (role == 'Sales Reps' && this.apiService.checkPermission('ViewSalesRepDashboard')) {
              this.router.navigate(['/ui/commissions/salesrepdashboard', this.apiService.getContactId()]);
            } else if (role == 'Finance Admin' || role == 'Finance Admin With UAM' || role == 'Finance User') {
              this.router.navigate(['/ui/dashboard/finance']);
            } else if (role == 'Sales Admin-Admin' || role == 'Sales Admin-User') {
              this.router.navigate(['/ui/dashboard/sales']);
            } else if (role == 'Legal Admin' || role == 'Legal User') {
              this.router.navigate(['/ui/dashboard/legal']);
            } else {
              this.router.navigate(['/ui/dashboard']);
            }
            
          }
        }
        else {
          localStorage.setItem('CurrentUrl', val.url);
        }

        if (val.url == "/ui/dashboard" || val.url == "/ui/usermanagement") {
          if (this.sidebarComponent) {
            this.sidebarComponent.dashboard = true;
            this.sidenavService.open();
          }
        } else {
          if (this.sidebarComponent) {
            this.sidebarComponent.dashboard = false;
            this.sidenavService.close();
          }
        }
      }
    })
  }


  ngOnInit(): void {
    console.log("AppComponent INIT");
    if (localStorage.getItem("ADtoken") == undefined || localStorage.getItem("ADtoken") == null) {
      this.invalidLogin = true;
    }
    else {
      this.getUser();
    }
    // if(this.apiService.isLoggedIn()){
    //   if (localStorage.getItem("CurrentUrl") != null) {
    //     this.router.navigate([localStorage.getItem("CurrentUrl")]);
    //   }
    // } 


    if ((localStorage.getItem("UserID") != null) && (!this.apiService.isLoggedIn())) {
      console.log(localStorage.getItem("UserID"));
      this.invalidLogin = false
      const loginPayload = {
        email: localStorage.getItem("UserID"), //this.dataService.getCurrentUserInfo()  ,
        password: ''
      }

      if (!JSON.parse(localStorage.getItem('loggingIn'))) {
        console.log("LOGGING IN");
        localStorage.setItem('loggingIn', JSON.stringify(true));
        this.apiService.ssoPost('Authentication/LoginAD', loginPayload)
          .subscribe(data => {
            if (data.statusCode === "200" && data.result && data.result.user) {
              console.log("TOKEN", data.result.token, new Date());
              localStorage.setItem('listOfApplications', JSON.stringify(data.result.listOfApplications));
              localStorage.setItem('token', data.result.token);
              localStorage.setItem('currentUser', JSON.stringify(data.result.user));
              this.getUserCapabilities(data.result.user.empId)
              // this.router.navigate(['ui/dashboard/legal']);
            } else {
              this.invalidLogin = true;
              console.log(data.statusCode);
              this.dataService.logout();
            }
            localStorage.setItem('loggingIn', JSON.stringify(false));
          }, (err: any) => {
            this.invalidLogin = true;
            console.log(err)
            localStorage.setItem('showMenu', "true");
            this.router.navigate(['unauthorized']);
            localStorage.setItem('loggingIn', JSON.stringify(false));
          });
      }

    }
    if (this.sidenavService.sidenav != undefined) {
      this.sidenavService.sidenav.opened = false;
    }
  }


  /**
   * Create Salt and store in session
   * @param capabilities 
   */
  parseCapabilityData(capabilities: any) {

    let finalCapbilities = []
    if (capabilities.length > 0) {
      capabilities.filter(obj => finalCapbilities.push(obj.name))
    }
    // alert(finalCapbilities);
    let encrypt = this.apiService.encryptData(finalCapbilities)
    localStorage.setItem("permissions", encrypt)
    if (localStorage.getItem("CurrentUrl") != null) {
      this.router.navigate([localStorage.getItem("CurrentUrl")]);
    }
  }
  getUserCapabilities(empId: any) {
    if (empId) {
      this.apiService.ssoGet('UserDetails/' + empId)
        .subscribe(data => {
          if (data.statusCode == "201" && data.result && data.result[0].capabilities) {
            this.parseCapabilityData(data.result[0].capabilities)
            localStorage.setItem("cid", data.result[0].contactId ? data.result[0].contactId : null)
            localStorage.setItem("role", data.result[0].roleName ? data.result[0].roleName : null)
          } else {
            this.toastMsg.error('No capabilities for this user', 'Error!')
          }
        }, (err: any) => {
          // console.log(err)
          this.toastMsg.error(err, 'Error!')
        });
    } else {
      this.toastMsg.error('Server Error', 'Error!')
    }

  }

  getUser() {
    this.dataService.getCurrentUserInfo();
  }

  logout() {
    this.dataService.logout();
  }

  ngAfterViewInit(): void {
    if (this.sidebarComponent != undefined) {
      this.sidenavService.setSidenav(this.sidebarComponent.sidenav);
    }
    // this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {/* react to scrolling */});
    // if (this.router.url)
  }

  toggleRateTableDropdown() {
    this.subRateTables = !this.subRateTables;
  }

}
