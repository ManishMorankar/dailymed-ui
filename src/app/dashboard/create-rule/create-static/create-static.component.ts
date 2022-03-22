import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { Static } from '../../../model/static.model';
import { MatDialogRef } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-create-static',
  templateUrl: './create-static.component.html',
  styleUrls: ['./create-static.component.css']
})
export class CreateStaticComponent implements OnInit {
  options: any = ["Numeric", "String", "Date"];
  type: string = this.options[0];
  staticForm: FormGroup;
  invalidLogin: boolean = false;
  staticModel = new Static('', '', '');
  @Output() closeModalEvent = new EventEmitter<boolean>();
  constructor(public dialogRef: MatDialogRef<CreateStaticComponent>, private apiService: ApiService, private toastMsg: ToastrService) {
  }

  ngOnInit() {
  }

  // getStaticMetaData(){
  //   this.apiService.get('getdata/getStaticContent')
  //     .subscribe(data => {
  //       if (data["statusCode"] === "201" && data.result) {
  //         this.staticMetaData = data.result;
  //         //console.log(this.staticMetaData)
  //       }
  //     }, (err: any) => {
  //       console.log(err)
  //       this.toastMsg.error(err, 'Server Error!')
  //     });
  // }


  onSubmit(){
    // console.log("Static", this.staticModel)
    if(this.staticModel.data_type && this.staticModel.display_name && this.staticModel.value){
      this.apiService.post('Static', this.staticModel)
      .subscribe(data => {
        if(data.statusCode == "200" || data.statusCode == "201") {
          this.staticModel = new Static('', '', '');
          this.toastMsg.success("Static successfully added.", 'Success!')
        }else {
          this.invalidLogin = true;
          // console.log("Server Error", data)
          this.toastMsg.error(data.message, "Error!")
        }
      },(err: any) => {
        this.invalidLogin = true;
        // console.log(err)
        this.toastMsg.warning("Static Aleady Exists", "Error");
      });
    }else{
      this.toastMsg.warning("Please fill all input fields.", 'Error!')
    }
  }


}
