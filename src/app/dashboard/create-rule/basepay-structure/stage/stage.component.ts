import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { IBasePayStructure } from 'src/app/model/base-pay-structure.model';
import { IPayStreamItem } from 'src/app/model/base-pay-structure.model';
import { disableDebugTools } from '@angular/platform-browser';
import { IPaymentDueDateMapping } from 'src/app/model/payment-due-date-mapping.model';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {
  @Input() stageNumber: number;
  @Input() promptAssignPlan: boolean;
  @Input() disabled: boolean = false;
  basePayStructure: IBasePayStructure = <IBasePayStructure>{
    numberOfPayments: 1,
    payStream: []
  };
  payStreamItems: {} = {};
  @Input() clone: IBasePayStructure;
  paymentDueDateMappings: IPaymentDueDateMapping[];


  constructor(private apiService: ApiService, private toastMsg: ToastrService) { }
  ngOnInit() {
    this.getPaymentDueDateMappings();
  }

  ngOnChanges(changes: SimpleChanges) {
   
    if (changes.promptAssignPlan) {
      this.basePayStructure.promptAssignPlan = changes.promptAssignPlan.currentValue;
    }
    if (changes.clone) {
      this.prePopulateRuleData();
    }
  }

  onPayStreamItemChange(payStreamItem: IPayStreamItem) {
    this.payStreamItems[payStreamItem.paymentNumber] = payStreamItem;
  }

  onNumberOfPaymentsChange() {
    this.payStreamItems = {};
  }

  /**
   * Pre-populate clone data
   */
  prePopulateRuleData() {
    if (this.clone && Object.keys(this.clone).length > 0) {
      
      this.basePayStructure = this.clone;
      if(this.basePayStructure.startDate!= "undefined" && this.basePayStructure.startDate!=null){
      let date=moment(this.basePayStructure.startDate);
      this.basePayStructure.startDate=date.toISOString(true).split('T')[0];
    }
  }
}

  getPaymentDueDateMappings()
  {
    this.apiService.get('GetData/PaymentDueDateMappings')
      .subscribe(data => {
        if(data && data.statusCode === "201" && data.result) {
          this.paymentDueDateMappings = data.result.map(x => {return <IPaymentDueDateMapping>x});
        }
      }, err => {
        this.toastMsg.error(err, "Server Error!");
      })
  }

  getPaymentDueDate(dueDateName: string) {
    if (this.paymentDueDateMappings){
       let id = this.paymentDueDateMappings.filter(x => x.paymentDueDateMappingName === dueDateName);
       return id[0];
    }
    else{
      return <IPaymentDueDateMapping>{};
    }
  }

  forLoop(n: number) {
    let arr = [];

    for (let i = 0; i < n; i++) {
      arr.push(i + 1);
    }

    return arr;
  }
}
