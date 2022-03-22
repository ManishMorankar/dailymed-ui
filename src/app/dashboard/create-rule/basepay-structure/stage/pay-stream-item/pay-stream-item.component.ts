import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { IPayStreamItem } from 'src/app/model/base-pay-structure.model';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { IPaymentType } from 'src/app/model/payment-type.model';
import { IPaymentDueDateMapping } from 'src/app/model/payment-due-date-mapping.model';
declare var $: any;
@Component({
  selector: 'app-pay-stream-item',
  templateUrl: './pay-stream-item.component.html',
  styleUrls: ['./pay-stream-item.component.css']
})
export class PayStreamItemComponent implements OnInit {
  @Input() paymentNumber: number;
  @Output() payStreamItem = new EventEmitter<IPayStreamItem>();
  @Input() percentage: number;
  @Input() stage: string;
  @Input() paymentDueDateMappingId: number;
  @Input() daysInAdvance: number;
  @Input() payBasedOn: string;
  @Input() disabled: boolean;
  @Input() cloneStreams: any = [];
  @Input() clone: IPayStreamItem;
  paymentTypeId: number;
  paymentTypes: IPaymentType[];
  paymentDueDateMappings: IPaymentDueDateMapping[];

  constructor(private apiService: ApiService, private toastMsg: ToastrService) { }

  ngOnInit() {
    this.getPaymentTypes();
    this.getPaymentDueDateMappings();
    this.onChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.clone) {
      this.prePopulateRuleData();
    }
  }

  onChange() {
    this.payStreamItem.emit(<IPayStreamItem>{
      paymentNumber: this.paymentNumber,
      percentage: this.percentage,
      stage: this.stage,
      paymentDueDateMappingId: this.paymentDueDateMappingId,
      daysInAdvance: this.daysInAdvance,
      paymentTypeId: this.paymentTypeId,
      payBasedOn: this.payBasedOn
    });
  }

  getPaymentTypes() {
    this.apiService.get('BasePayStructures/GetPaymentTypes')
      .subscribe(data => {
        if(data && data.result) {
          this.paymentTypes = data.result.map(x => {
            return <IPaymentType>{
              paymentTypeId: x.paymentTypeId,
              paymentTypeName: x.paymentTypeName
            }
          });
          if(this.cloneStreams && this.cloneStreams.length > 0){
            this.percentage = this.cloneStreams[0]["percentage"]
            this.stage = this.cloneStreams[0]["stage"]
            this.daysInAdvance = this.cloneStreams[0]["days_in_advance"]
            this.payBasedOn = this.cloneStreams[0]["pay_based_on"]
            this.paymentTypeId = this.cloneStreams[0]["payment_type_id"]
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, "Server Error!");
      });
  }

  getPaymentDueDateMappings()
  {
    this.apiService.get('GetData/PaymentDueDateMappings')
      .subscribe(data => {
        if(data && data.statusCode === "201" && data.result) {
          this.paymentDueDateMappings = data.result.map(x => {return <IPaymentDueDateMapping>x});
          // console.log("Payment Due Date Mappings", this.paymentDueDateMappings);
        }
      }, err => {
        this.toastMsg.error(err, "Server Error!");
      })
  }

  /**
   * Pre-populate clone data
   */
  prePopulateRuleData() {
    if (this.clone && Object.keys(this.clone).length > 0) {
      this.paymentNumber = this.clone.paymentNumber;
      this.percentage = this.clone.percentage;
      this.stage = this.clone.stage;
      this.daysInAdvance = this.clone.daysInAdvance;
      this.payBasedOn = this.clone.payBasedOn.toLowerCase();
      this.paymentTypeId = this.clone.paymentTypeId;
      this.paymentDueDateMappingId= this.clone.paymentDueDateMappingId;
    }
  }

}
