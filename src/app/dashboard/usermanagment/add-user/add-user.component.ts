import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../model/user.model';
import { MustMatch } from '../../../services/must-match.service'

import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  dropdowns: any;
  submit_btn: string = "Create User"
  userForm: FormGroup;
  user: User;
  default_pass: string = ""
  rolesList: any = []
  constructor(private formBuilder: FormBuilder, 
              private router: Router, 
              public apiService: ApiService, 
    private toastMsg: ToastrService, private datePipe: DatePipe) {
    this.user = new User();

  }
  @Input() editUser: any = {}
  ngOnInit() {
    if(Object.keys(this.editUser).length > 0 && this.editUser.type == 'Edit'){
      this.submit_btn = "Edit User"
      this.user.name = this.editUser.name ? this.editUser.name: ""
      this.user.email = this.editUser.email?this.editUser.email: ""
      this.user.status = this.editUser.status?this.editUser.status: ""
      this.default_pass = "------",

        this.user.gender = this.editUser.gender ? this.editUser.gender : ""
    }
   
    this.initializeForm();

   
    //this.getRolesList()
  }


  /**
   * Initialize form with default values
   */
  initializeForm(){
    this.userForm = this.formBuilder.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      password: [this.default_pass, [Validators.required, Validators.minLength(6)]],
      confirm_pass: [this.default_pass, Validators.compose([Validators.required, Validators.minLength(6)])],
      status: [this.user.status, Validators.required],

      gender: [this.user.gender, [Validators.required]],
    }, { validator: MustMatch('password', 'confirm_pass')});
  }


  /**
   * User Create & Update
   * Check Edit User Type
   */
  onSubmit() {
    //console.log(this.userForm)
    if (this.userForm.invalid) {
      return;
    }
    const userPayload = {
      name: this.userForm.controls.name.value,
      email: this.userForm.controls.email.value,
      password: this.userForm.controls.password.value,
      status: this.userForm.controls.status.value,
      gender: this.userForm.controls.gender.value,
     
    }
   

    if(Object.keys(this.editUser).length > 0 && this.editUser.type == 'Edit'){
      userPayload["empId"] = this.editUser.empId
      //delete userPayload["password"]
      
      this.apiService.ssoPut('user/register/', userPayload)
      .subscribe(data => {
        if(data.statusCode === "201") {
          this.toastMsg.success(data['message']);
          this.router.navigate(['ui/commissions/usermanagement/users']);
        }else {
          this.toastMsg.error(data['message']);
        }
      },(err: any) => {
        
        this.toastMsg.error(err, "Error!")
      });
    }else{
      this.apiService.ssoPost('user/register/', userPayload)
      .subscribe(data => {
        if(data.statusCode === "201") {
          this.toastMsg.success(data['message']);
          this.router.navigate(['ui/commissions/usermanagement/users']);
        }else {
          this.toastMsg.error(data.message, "Error!")
        }
      },(err: any) => {
        this.toastMsg.error(err, "Error!")
      });
    }
    
  }


}
