import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {Router, ActivatedRoute} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
declare var $:any;

@Component({
  selector: 'app-clone-rule',
  templateUrl: './clone-rule.component.html',
  styleUrls: ['./clone-rule.component.css']
})
export class CloneRuleComponent implements OnInit{

  questionId: any
  ruleObj: any
  cloneRule: any;
  loadPage: boolean = false
  constructor(public apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastMsg: ToastrService) {
    // this.questionId = this.activatedRoute.snapshot.params['question_id'];
  }

  ngOnInit() {
    if (!this.apiService.checkPermission('CloneRule')) {
      // this.router.navigate(['/ui/dashboard'])
      this.apiService.goBack();
      this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    }
    this.activatedRoute.params.subscribe(params => {
      this.questionId = params.question_id;

      if(localStorage.getItem('LastRuleDetails')){
        this.ruleObj = JSON.parse(localStorage.getItem('LastRuleDetails'))
  
        this.cloneRule = this.ruleObj
        this.loadPage = true
      }else{
        //this.activatedRoute.get
      }
    })
  }



}
