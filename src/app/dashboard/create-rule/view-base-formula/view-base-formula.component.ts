import { Component, OnInit, ElementRef, Inject, Input, ViewEncapsulation, ViewChild, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {SearchComponent} from '../../search/search.component';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-view-base-formula',
  templateUrl: './view-base-formula.component.html',
  styleUrls: ['./view-base-formula.component.css']
})
export class ViewBaseFormulaComponent implements OnInit {
  rulesForm:any={};
  createRuleForm: FormGroup;
  count: number = 1;
  hElement: HTMLElement;
  ruleTypes: any[]=[];
  tableContentData: any;
  staticMetaData: []
  baseFormulasData: []
  isDisabled: boolean = true;
  isReadonly: boolean = true;
  invalidRule: boolean = false;
  criteriaHtml: any;
  creationTypes: any = ["Rule", "Base Formula"];
  activeCreationType: string = this.creationTypes[0];
  currentDraggedItemType: string;
  validInput: boolean = true;
  rule:any={};
  stepsArray:any[]=[];
  start_date:any;
  end_date: any;
  commissionRuleShow: boolean = false;
  paymentRuleShow: boolean = false;
  commissionTriggerRuleShow: boolean = false;
  viewRuleId: any;
  @Input() ruleTypeId:number;
  constructor(@Inject(DOCUMENT) document, private formBuilder: FormBuilder, public apiService: ApiService, private renderer:Renderer2,
  private elementRef:ElementRef, private toastMsg: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.apiService.hideLoader = true;
    this.hElement = this.elementRef.nativeElement;
    localStorage.setItem('href',window.location.href);
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {  //  Dilip 05/27/2020 COM-815 
      // this.viewRuleId = params.id;      
      if (!this.apiService.checkPermission('ViewBaseFormula')) {
        // this.router.navigate(['/ui/dashboard'])
        this.apiService.goBack();
        this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
      }
      let rule = window.location.href.split('/');
      let ruleId = rule[rule.length - 1];
      this.viewRuleId = ruleId
      
      this.apiService.get('baseformula/' + ruleId)
        .subscribe(data => {
          // console.log("result",data.result);
          if (data.statusCode === "200" || data.statusCode === "201") {
            localStorage.setItem('LastRuleDetails', JSON.stringify(data.result))
            this.rulesForm.rule_name = data.result.rule_name;
            this.rulesForm.description = data.result.description;
            for (let i = 0; i < data.result.steps.length; i++) {
              this.stepsArray = data.result.steps;
            }
            this.toastMsg.success("Rule fetched successfully", '!');
          } else {
            this.toastMsg.error("Server", 'Error!')
          }
        }, (err: any) => {
          this.toastMsg.error(err, 'Error!')
        });
    })
  }

  ngOnDestroy(){
    this.elementRef.nativeElement.remove();
  }

  getValueType(data){
    if(data!="1"&&data!="2"){
      return "3";
    }
  }
  }
