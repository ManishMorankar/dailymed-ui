import { Component, OnInit } from '@angular/core';
import {ApiService} from "../services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  resetForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg: ToastrService) { 
    this.apiService.hideLoader = true
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  /**
   * Forgot Password post request
   */
  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    const resetPayload = {
      email: this.resetForm.controls.email.value,
    }
    this.apiService.hideLoader = false
    this.apiService.ssoPost('Authentication/PasswordReset', resetPayload)
    .subscribe(data => {
      this.apiService.hideLoader = true
      // console.log(data)
      if(data.statusCode === "200" || data.statusCode === "201") {
        setTimeout(()=>{ 
          this.toastMsg.success("Reset password link sent to your registered email. Please check", 'Success!')
          this.router.navigate(['login']);
        }, 1000)
      }else {
        this.toastMsg.error(data.message, 'Server Error!')
      }
    },(err: any) => {
      this.apiService.hideLoader = true
      this.toastMsg.error(err, 'Server Error!')
    });
  }
}
