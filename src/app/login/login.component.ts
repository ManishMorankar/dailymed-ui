import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ApiResponse } from '../services/api.response';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  emailVal: string;
  passwordVal: string;
  // routesObject: any = require('../model/capabilities.json');


  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg: ToastrService, private http: HttpClient) {

  }

  setEmail(event: any) {
    this.emailVal = event.target.value;
  }
  setPassword(event: any) {
    this.passwordVal = event.target.value;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
    if (localStorage.getItem('CurrentUrl') == null) {
      location.reload();
    }
  }

  /**
   * Login post request
   */
  onSubmit() {
    const loginPayload = {
                email: this.emailVal,//this.loginForm.controls.email.value,
                password: this.passwordVal//this.loginForm.controls.password.value
              }
    console.log("LOGGING IN");
    this.apiService.ssoPost('auth/login', loginPayload)
      .subscribe(data => {
        if (data.statusCode === "200" && data.result && data.result.user) {
          //localStorage.setItem('listOfApplications', JSON.stringify(data.result.listOfApplications));
          localStorage.setItem('token', data.result.token);
          localStorage.setItem('currentUser', JSON.stringify(data.result.user));
          localStorage.setItem('UserID', this.emailVal);
          this.toastMsg.success(data['message']);
          //this.getUserCapabilities(data.result.user.empId)
          this.router.navigate(['ui/dashboard']);
          //this.router.navigate(['ui/dashboard/masters/daily-med-report'])
        } else {
          this.invalidLogin = true;
        }
      }, (err: any) => {
        this.invalidLogin = true;
        // console.log(err)
      });
    //alert("test user" + this.emailVal);
    localStorage.setItem('token', "data.result.token");
              //this.router.navigate(['ui/dashboard']);


    //var TokenCount;
    //var TotalLicenses;

    //this.http.get<ApiResponse>(`${environment.apiBaseUrl}UserDetails/DecryptLicense`)
    //  .subscribe(data => {
    //    TotalLicenses = data;

    //    this.http.get<ApiResponse>(`${environment.apiBaseUrl}UserDetails/TokenCount`)
    //      .subscribe(data => {
    //        TokenCount = data;
    //        if (TokenCount >= TotalLicenses) {
    //          this.toastMsg.error("License Limit Exceeded", "Your License Has Exceeded Its User Limit");
    //          return;
    //        }
    //        else {
    //          console.log("ONSUBMIT");
    //          /* if (this.loginForm.invalid) {
    //             this.invalidLogin = true
    //             return;
    //           }*/
    //          this.invalidLogin = false
    //          const loginPayload = {
    //            email: this.emailVal,//this.loginForm.controls.email.value,
    //            password: this.passwordVal//this.loginForm.controls.password.value
    //          }
    //          console.log("LOGGING IN");
    //          this.apiService.ssoPost('Authentication/Login', loginPayload)
    //            .subscribe(data => {
    //              if (data.statusCode === "200" && data.result && data.result.user) {
    //                localStorage.setItem('listOfApplications', JSON.stringify(data.result.listOfApplications));
    //                localStorage.setItem('token', data.result.token);
    //                localStorage.setItem('currentUser', JSON.stringify(data.result.user));
    //                localStorage.setItem('UserID', this.emailVal);
    //                this.getUserCapabilities(data.result.user.empId)
    //                this.router.navigate(['ui/dashboard']);
    //              } else {
    //                this.invalidLogin = true;
    //              }
    //            }, (err: any) => {
    //              this.invalidLogin = true;
    //              // console.log(err)
    //            });
    //          //alert("test user" + this.emailVal);
    //          localStorage.setItem('token', "data.result.token");
    //          //this.router.navigate(['ui/dashboard']);
    //        }

    //      }, err => {
    //        this.toastMsg.error(err, "Error!");
    //      })

    //  }, err => {
    //    this.toastMsg.error(err, "Error!");
    //    return;
    //  })
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
    let encrypt = this.apiService.encryptData(finalCapbilities)
    localStorage.setItem("permissions", encrypt)
    this.router.navigate(['ui/dashboard']);
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

}
