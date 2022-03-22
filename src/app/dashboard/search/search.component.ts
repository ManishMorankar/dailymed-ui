import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit, OnDestroy {
  type: number = 1;
  keyword: string = "";
  searchValues: any[] = [];
  page: number = 1;
  ruleTypeId: number;
  option1: string = "";
  option2: string = "";
  option3: string = "";
  option4: string = "";
  option5: string = "";
  pageSize = 10;
  constructor(
    private toastMsg: ToastrService,
    public apiService: ApiService,
    private router: Router
  ) {
    if (
      localStorage.getItem("type") &&
      localStorage.getItem("searchedParam")
    ) {
      this.type = JSON.parse(localStorage.getItem("type"));
      if (localStorage.getItem("searchedParam") == "rule") {
        $(document).ready(function () {
          $("#inlineRadio1").prop("checked", true);
          $("#inlineRadio2").prop("checked", false);
          $("#inlineRadio3").prop("checked", false);
          $("#inlineRadio4").prop("checked", false);
          $("#inlineRadio5").prop("checked", false);
        });
      } else if (localStorage.getItem("searchedParam") == "plan") {
        $(document).ready(function () {
          $("#inlineRadio1").prop("checked", false);
          $("#inlineRadio2").prop("checked", false);
          $("#inlineRadio3").prop("checked", false);
          $("#inlineRadio4").prop("checked", true);
          $("#inlineRadio5").prop("checked", false);
        });
      } else if (localStorage.getItem("searchedParam") == "contact") {
        $(document).ready(function () {
          $("#inlineRadio1").prop("checked", false);
          $("#inlineRadio2").prop("checked", false);
          $("#inlineRadio3").prop("checked", true);
          $("#inlineRadio4").prop("checked", false);
          $("#inlineRadio5").prop("checked", false);
        });
      }
      else if (localStorage.getItem("searchedParam") == "opportunity") {
        $(document).ready(function () {
          $("#inlineRadio1").prop("checked", false);
          $("#inlineRadio2").prop("checked", true);
          $("#inlineRadio3").prop("checked", false);
          $("#inlineRadio4").prop("checked", false);
          $("#inlineRadio5").prop("checked", false);
        });
      } else if (localStorage.getItem("searchedParam") == "baseFormula") {
        $(document).ready(function () {
          $("#inlineRadio1").prop("checked", false);
          $("#inlineRadio2").prop("checked", false);
          $("#inlineRadio3").prop("checked", false);
          $("#inlineRadio4").prop("checked", false);
          $("#inlineRadio5").prop("checked", true);
        });
      }
      this.searchValue(this.keyword);
    }
  }

  clear() {
    localStorage.removeItem("type");
    localStorage.removeItem("searchedParam");
  }

  ngOnInit() { }

  change(data: any) {
    this.type = data[data.length - 1];
  }

  viewRule(rule: any) {
    localStorage.setItem("type", JSON.stringify(this.type));
    localStorage.setItem("searchedParam", "rule");
    if (rule.commissionRuleTypeName == "Base Pay Structure") {
      this.router.navigate([
        "ui/commissions/viewBasePayStructure",
        rule.commissionRuleId
      ]);
    } else if (rule.commissionRuleTypeName == "Payment Book") {
      this.router.navigate([
        "ui/commissions/viewPaymentBook",
        rule.commissionRuleId
      ]);
    } else if (rule.commissionRuleTypeName == "Base Pay" || rule.commissionRuleTypeName == "Kilowatt Incentives"
      || rule.commissionRuleTypeName == "Self-Gen Install Incentive Goal" || rule.commissionRuleTypeName == "Outreach High Flyer" || rule.commissionRuleTypeName == "Direct High Flyer"
      || rule.commissionRuleTypeName == "Traditional President's Club" || rule.commissionRuleTypeName == "Bonus" || rule.commissionRuleTypeName == "Employee Incentive" || rule.commissionRuleTypeName == "Outreach - EOM 10/1/10 Incentive" || rule.commissionRuleTypeName == "Outreach - EOM Existing Incentive"
      || rule.commissionRuleTypeName == "Traditional High Flyer" || rule.commissionRuleTypeName == "Outreach - EOM Old DM Pay Incentive" || rule.commissionRuleTypeName == "Outreach - EOM Old DM Pay Unlimited Incentive" || rule.commissionRuleTypeName == "Direct President's Club") {
      this.router.navigate(["ui/commissions/viewRule", rule.commissionRuleId]);
    }
  }

  viewPlan(planId: any) {
    this.router.navigate(["ui/commissions/viewPlan", planId]);
    localStorage.setItem("type", JSON.stringify(this.type));
    localStorage.setItem("searchedParam", "plan");
  }

  viewBaseFormula(formulaId: number) {
    this.router.navigate(["ui/commissions/viewBaseFormula", formulaId]);
    localStorage.setItem("type", JSON.stringify(this.type));
    localStorage.setItem("searchedParam", "baseFormula");
  }

  viewOpportunity(oppId: number) {
    this.router.navigate(["ui/commissions/opportunitydetails", oppId]);
    localStorage.setItem("type", JSON.stringify(this.type));
    localStorage.setItem("searchedParam", "opportunity");
  }

  viewContact(contactId: number) {
    this.router.navigate(["ui/commissions/salesrep", contactId]);
    localStorage.setItem("type", JSON.stringify(this.type));
    localStorage.setItem("searchedParam", "contact");
  }

  searchValue(keyword: any) {
    if (keyword && keyword.length > 2) {
      const searchpayLoad = {
        type: this.type,
        keyword: keyword
      };
      if (!keyword) {
        this.toastMsg.error("Please enter the value to search");
      } else {
        this.apiService.post("SearchContent/", searchpayLoad).subscribe(
          data => {
            if (data.statusCode === "200" || data.statusCode === "201") {
              this.searchValues = data.result;
              //console.log(this.searchValues);
              //this.toastMsg.success("Records searched successfully!");
            } else {
              this.toastMsg.error("Server", "Error!");
            }
          },
          (err: any) => {
            this.toastMsg.error(err, "Error!");
          }
        );
      }
    }
  }

  ngOnDestroy() {
    localStorage.setItem('opportunity', '/ui/commissions/search');
  }
}
