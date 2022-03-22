import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../model/user.model';
import { MustMatch } from '../../../services/must-match.service'

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  searchText: string = "";
  usersList: any = [];
  rolesList: any = [];
  role_id: string = "0";
  page: number = 1;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public apiService: ApiService,
    private toastMsg: ToastrService) {

  }

  ngOnInit() {
    //if (!this.apiService.checkPermission('Users') && !this.apiService.checkPermission('Admin')) {
    //  this.apiService.goBack();
    //  this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    //}
    this.getUsersList()
   // this.getRolesList()
  }

  /**
   * Filter Department
   */
  filterDepartment() {
    this.getUsersList();
  }

  /**
   * Users List
   */
  getUsersList() {
    // let url = 'userdetails/getuserdetails?roleid=';
    // if(flag == 'trigger' && this.rolesList){
    //   url = 'UserInfoDetails?roleid='+this.role_id
    // }
    this.apiService.ssoGet('user/register/')
      .subscribe(data => {
        //console.log("Get Users", data)
        if (data.statusCode === "201" && data.result) {
          this.usersList = data.result;
        } else {
          this.toastMsg.error(data.message, "Error!")
        }
      }, (err: any) => {
        // console.log(err)
        this.toastMsg.error(err, "Error!")
      });
  }

  /**
   * Role List
   */
  getRolesList() {
    this.apiService.get('commissions/getRoles')
      .subscribe(data => {
        //console.log("Get Roles", data)
        if (data.statusCode === "201" && data.result) {
          this.rolesList = data.result;
        } else {
          this.toastMsg.error(data.message, "Error!")
        }
      }, (err: any) => {
        // console.log(err)
        this.toastMsg.error(err, "Error!")
      });
  }

  /**
   *
   */
  onEditUser(user: any) {
    // console.log("Edit User", user)
    localStorage.setItem('EditUser', JSON.stringify(user))
    this.router.navigate(['/ui/dashboard/masters/users/edit'])
  }
}
