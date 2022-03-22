import { Component, OnInit, ElementRef, Inject, ViewEncapsulation, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { IBasePayStructure } from '../../../model/base-pay-structure.model';
import { IPaymentType } from 'src/app/model/payment-type.model';
import { IRule } from 'src/app/model/rule.model';
import { IPayStreamItem } from 'src/app/model/base-pay-structure.model';
import { IBasePayStructureForm } from 'src/app/model/base-pay-structure.model';
declare var $: any;

@Component({
  selector: 'app-view-base-pay-structure',
  templateUrl: './view-base-pay-structure.component.html',
  styleUrls: ['./view-base-pay-structure.component.css']
})
export class ViewBasePayStructureComponent implements OnInit, OnDestroy {
  rulesForm: any = {};
  payStreamList: any[] = [];
  ruleTypes: any[] = [];
  paymentTypes: IPaymentType[];
  viewRuleId: any;
  basePayStructureRules: IRule[];
  basePayStructureForm: IBasePayStructureForm = <IBasePayStructureForm>{};

  constructor(public apiService: ApiService, private elementRef: ElementRef, private toastMsg: ToastrService) {
    let rule = window.location.href.split('/');
    let ruleId = rule[rule.length - 1];
    this.viewRuleId = ruleId

    this.apiService.hideLoader = true;
  }

  ngOnInit() {
    this.getPaymentTypes();
    this.getBasePayStructureForm();
  }

  getPaymentTypes() {
    this.apiService.get('BasePayStructures/GetPaymentTypes')
      .subscribe(data => {
        if (data && data.result) {
          this.paymentTypes = data.result.map(x => {
            return <IPaymentType>{
              paymentTypeId: x.paymentTypeId,
              paymentTypeName: x.paymentTypeName
            }
          });
        }
      }, (err: any) => {
        this.toastMsg.error(err, "Server Error!");
      });
  }

  getBasePayStructureForm() {
    this.apiService.get(`BasePayStructures/${this.viewRuleId}`)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          localStorage.setItem('LastRuleDetails', JSON.stringify(data.result));
          
          this.basePayStructureForm = <IBasePayStructureForm>{
            ruleId: data.result.ruleId,
            ruleName: data.result.ruleName,
            ruleTypeId: data.result.ruleTypeId,
            description: data.result.description,
            promptAssignPlan: data.result.promptAssignPlan,
            numberOfStages: data.result.numberOfStages,
            basePayStructures: data.result.basePayStructures.map(bps => {
              return <IBasePayStructure>{
                basePayStructureId: bps.basePayStructureId,
                basePayStructureName: bps.basePayStructureName,
                numberOfPayments: bps.numberOfPayments,
                startDate: bps.startDate,
                endDate: bps.endDate,
                payStream: bps.payStream.map(payStreamItem => {
                  return <IPayStreamItem>{
                    paymentNumber: payStreamItem.paymentNumber,
                    percentage: payStreamItem.percentage,
                    stage: payStreamItem.stage,
                    payBasedOn: payStreamItem.payBasedOn,
                    paymentTypeId: payStreamItem.paymentTypeId,
                    daysInAdvance: payStreamItem.daysInAdvance
                  }
                })
              }
            })
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, "Server Error!");
      });
  }

  getPaymentType(paymentTypeId: number) {
    if (!this.paymentTypes) return <IPaymentType>{};
    let paymentType = this.paymentTypes.filter(type => type.paymentTypeId == paymentTypeId)[0];

    paymentType = paymentType || <IPaymentType>{};

    return paymentType;
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }

}
