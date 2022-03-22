import { Component, OnInit, Input, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  isTokenExpired: boolean = false
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, 
    private toastMsg: ToastrService, public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) { 
    this.isTokenExpired = this.data.isTokenExpired;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }


  /**
   * Login post request
   */
  onSubmit() {
    if (this.loginForm.invalid) {
      this.invalidLogin = true
      return;
    }
    this.invalidLogin = false
    const loginPayload = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }
    this.apiService.ssoPost('Authentication/Login', loginPayload)
    .subscribe(data => {
      if(data.statusCode === "200" && data.result && data.result.user) {
        localStorage.setItem('listOfApplications', JSON.stringify(data.result.listOfApplications));
        localStorage.setItem('token', data.result.token);
        localStorage.setItem('currentUser', JSON.stringify(data.result.user));
        this.getUserCapabilities(data.result.user.empId)
        //this.router.navigate(['ui/dashboard']);
      }else {
        this.invalidLogin = true;
      }
    },(err: any) => {
      this.invalidLogin = true;
      // console.log(err)
    });
  }

  /**
   * Create Salt and store in session
   * @param capabilities 
   */
  parseCapabilityData(capabilities: any){
    
    let finalCapbilities = []
    if(capabilities.length > 0){
      capabilities.filter(obj => finalCapbilities.push(obj.name))
    }
    let encrypt = this.apiService.encryptData(finalCapbilities)
    localStorage.setItem("permissions", encrypt)
    //this.router.navigate(['ui/dashboard']);
  }

  getUserCapabilities(empId: any){
    if(empId){
      this.apiService.ssoGet('UserDetails/'+empId)
      .subscribe(data => {
        if(data.statusCode == "201" && data.result && data.result[0].capabilities) {
          this.parseCapabilityData(data.result[0].capabilities)
          localStorage.setItem("cid", data.result[0].contactId?data.result[0].contactId:null)
          localStorage.setItem("role", data.result[0].roleName?data.result[0].roleName:null)
          this.apiService.closeLogin()
          this.dialog.closeAll();
        }else {
          this.toastMsg.error('No capabilities for this user', 'Error!')
        }
      },(err: any) => {
        // console.log(err)
        this.toastMsg.error(err, 'Error!')
      });
    }else{
      this.toastMsg.error('Server Error', 'Error!')
    }
    
  }

}
