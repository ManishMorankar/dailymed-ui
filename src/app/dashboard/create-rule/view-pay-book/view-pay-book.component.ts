import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { IPaymentBook } from "../../../model/pay-book.model";

declare var $: any;
@Component({
  selector: "app-view-pay-book",
  templateUrl: "./view-pay-book.component.html",
  styleUrls: ["./view-pay-book.component.css"]
})
export class ViewPayBookComponent implements OnInit {
  paymentBook: IPaymentBook = <IPaymentBook>{};
  ruleId: number;
  ruleTypes: any[] = [];

  constructor(
    public apiService: ApiService,
    private toastMsg: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.ruleId = params.id;

      if (!this.apiService.checkPermission('ViewPaymentBooks')) {
        // this.router.navigate(['/ui/dashboard'])
        this.apiService.goBack();
        this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
      }

      this.getRuleTypes();
      this.getPaymentBooks();
    });
  }

  getPaymentBooks() {
    this.apiService.get(`paymentbook/${this.ruleId}`).subscribe(
      data => {
        if (data["statusCode"] === "201" && data.result) {
          this.paymentBook = <IPaymentBook>{
            pbId: data.result.pbId,
            ruleId: data.result.ruleId,
            ruleName: data.result.ruleName,
            ruleType: data.result.ruleType,
            ruleDescription: data.result.ruleDescription,
            pbType: data.result.pbType,
            overdrawLimit: data.result.overdrawLimit,
            weeklyPay: data.result.weeklyPay
          };
        }
      },
      (err: any) => {
        this.toastMsg.error(err, "Server Error!");
      }
    );
  }

  getRuleTypes(id?: any) {
    this.apiService.get("GetData/GetRuleType").subscribe(
      data => {
        if (data["statusCode"] === "201" && data.result) {
          this.ruleTypes = data.result.ruleData;
        }
      },
      (err: any) => {
        this.toastMsg.error(err, "Server Error!");
      }
    );
  }
}
