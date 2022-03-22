import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  editUser: any = {}
  constructor(public apiService: ApiService, private router: Router, private toastMsg: ToastrService) { }

  ngOnInit() {
    this.editUser.type = "Edit"
    if(localStorage.getItem("EditUser")){
      this.editUser = JSON.parse(localStorage.getItem("EditUser"))
      this.editUser.type = "Edit"
    }
  }

}
