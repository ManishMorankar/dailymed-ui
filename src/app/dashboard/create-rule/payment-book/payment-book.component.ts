import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import {Router, ActivatedRoute} from "@angular/router";
declare var $: any;

@Component({
  selector: '.app-payment-book',
  templateUrl: './payment-book.component.html',
  styleUrls: ['./payment-book.component.css']
})
export class PaymentBookComponent implements OnInit {
  private _showPaymentBook
  @Input()
  set showPaymentBook(showPaymentBook: boolean) {
    this._showPaymentBook = showPaymentBook;
    if (this.showPaymentBook)
      this.getPaymentBookTypes();
  }
  get showPaymentBook(): boolean { return this._showPaymentBook }
  @Input() createRuleForm: FormGroup;
  paymentBookTypes: any[];
  invalidRule: boolean = false;
  paymentBooks: any[] = [];
  defaultRuleType: any;
  constructor(private apiService: ApiService, private toastMsg: ToastrService, private router: Router) {

  }

  ngOnInit() {
    if(this.showPaymentBook)
      this.getPaymentBookTypes();

    this.getPaymentBooks();
    
    if (this.createRuleForm.controls.overdraw_limit.value == "") {
      this.createRuleForm.controls.overdraw_limit.setValue(0);
    }

    if (this.createRuleForm.controls.weekly_pay.value == "") {
      this.createRuleForm.controls.weekly_pay.setValue(0);
    }
  }

  /**
   * Get Payment Book Types
   */
  getPaymentBookTypes() {
    this.apiService.get('PaymentBook/GetPaymentBookType')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.paymentBookTypes = data.result;
        }
      }, (err: any) => {
        // console.log(err);
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  getPaymentBooks() {
    this.apiService.get('PaymentBook')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.paymentBooks = data.result;
          // console.log(this.paymentBooks);
          this.defaultRuleType = this.createRuleForm.controls.rule_type_id.value
        }
      }, (err: any) => {
        // console.log(err);
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  /**
   * Create Rule post request
   */
  onSubmit() {
    if (this.createRuleForm.invalid) {
      return;
    }
    if (!this.validate(this.createRuleForm.controls.rule_name.value, this.createRuleForm.controls.overdraw_limit.value, this.createRuleForm.controls.weekly_pay.value)) {
      this.toastMsg.error("A payment book matching these details already exists.", "Error!");
      return;
    }
    this.invalidRule = false;
    let createRulePayload = {};

    createRulePayload = {
      rule_type_id: this.createRuleForm.controls.rule_type_id.value,
      rule_name: this.createRuleForm.controls.rule_name.value,
      Description: this.createRuleForm.controls.Description.value,
      payment_book_type: this.createRuleForm.controls.payment_book_type.value,
      weekly_pay: this.createRuleForm.controls.weekly_pay.value,
      overdraw_limit: this.createRuleForm.controls.overdraw_limit.value
    };
    // console.log(createRulePayload)
    this.apiService.post('Rule', createRulePayload)
      .subscribe(data => {
        // console.log("Response", data)
        if (data["statusCode"] === "200" || data["statusCode"] === "201") {
          this.toastMsg.success("Rule has been created successfully", '!');
          this.getPaymentBooks();
        } else {
          this.invalidRule = true;
          this.toastMsg.error("Server", 'Error!');
        }
      }, (err: any) => {
        this.invalidRule = true;
        // console.log(err);
        this.toastMsg.error(err, 'Error!');
      });
  }

  validate(name: string, overdraw: number, weeklyPay: number) {
    if (this.paymentBooks) {
      if (this.paymentBooks.filter( function(item) { return item.ruleName == name || (item.overdrawLimit == overdraw && item.weeklyPay == weeklyPay) }).length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }


  onGoBack(){
    if(confirm("Your unsaved progress will be deleted, do you wish to continue?")){
      this.router.navigate(['/ui/commissions'])
    }else
      return false
    
  }

  resetForm(){
    this.createRuleForm.controls.rule_type_id.setValue("6")
    this.createRuleForm.controls.payment_book_type.setValue("")
    this.createRuleForm.controls.rule_name.setValue("")
    this.createRuleForm.controls.Description.setValue("") 
    this.createRuleForm.controls.overdraw_limit.setValue(0)
    this.createRuleForm.controls.weekly_pay.setValue(0)
    
  }

}
