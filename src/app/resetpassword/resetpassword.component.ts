import { Component, OnInit } from '@angular/core';
import {ApiService} from "../services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: String;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg: ToastrService, private activatedRoute: ActivatedRoute) { 
    this.apiService.hideLoader = true
    // this.token = this.activatedRoute.snapshot.params.token
    
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.token = params.token;
      if(!this.token)
      this.toastMsg.error("Reset password link is invalid", 'Error!')
      this.resetForm = this.formBuilder.group({
        new_pass: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        confirm_pass: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      }, {validator: this.checkPasswords });
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.new_pass.value;
    let confirmPass = group.controls.confirm_pass.value;
    return pass === confirmPass ? null : { notSame: true }     
  }

  /**
   * Reset Password post request
   */
  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    const resetPayload = {
      password: this.resetForm.controls.new_pass.value,
      token: this.token
    }
    this.apiService.hideLoader = false
    this.apiService.ssoPost('Authentication/PasswordResetUpdate', resetPayload)
    .subscribe(data => {
      this.apiService.hideLoader = true
      // console.log(data)
      if(data.statusCode === "200" || data.statusCode === "201") {
        setTimeout(()=>{ 
          this.toastMsg.success("Password has been updated successfully. Please login.", 'Success!')
          this.router.navigate(['login']);
        }, 1000)
        //this.router.navigate(['login']);
      }else {
        this.toastMsg.error(data.message, 'Server Error!')
      }
    },(err: any) => {
      this.apiService.hideLoader = true
      this.toastMsg.error(err, 'Server Error!')
    });
  }
}
