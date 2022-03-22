import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { ApiService } from "../services/api.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ISearchResult, ISearchValue } from '../model/search-result.model';
import * as _ from 'lodash';
import { SharedSidebarService } from '../shared/sidebar-icon';
declare var $: any;

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit, OnDestroy {
  keyword: string = "";
  searchValues: ISearchValue[] = [];
  page: number = 1;
  ruleTypeId: number;

  constructor(private toastMsg: ToastrService, public apiService: ApiService, private router: Router, private sharedSidebarService: SharedSidebarService) {
  }

  clear() {
  }

  ngOnInit() { }

  viewRule(ruleId: number) {
    this.router.navigate(["ui/commissions/viewRule", ruleId]);
  }

  viewBasePayStructure(ruleId: number) {
    this.router.navigate(["ui/commissions/viewBasePayStructure", ruleId]);
  }

  viewPaymentBook(ruleId: number) {
    this.router.navigate(["ui/commissions/viewPaymentBook", ruleId]);
  }

  viewPlan(planId: any) {
    this.router.navigate(["ui/commissions/viewPlan", planId]);
  }

  viewBaseFormula(formulaId: number) {
    this.router.navigate(["ui/commissions/viewBaseFormula", formulaId]);
  }

  viewOpportunity(oppId: number) {
    this.router.navigate(["ui/commissions/opportunitydetails", oppId]);
  }

  viewContact(contactId: number) {
    this.router.navigate(["ui/commissions/salesrep", contactId]);
  }

  searchValue(keyword: string) {
    if (keyword && keyword.length > 2) {
      const searchpayLoad = {
        keyword: keyword,
        viewRule: this.apiService.checkPermission('ViewRule'),
        viewOpportunity: this.apiService.checkPermission('ViewOpportunityDetail'),
        viewContact: this.apiService.checkPermission('ViewSalesRepDetail'),
        viewPlan: this.apiService.checkPermission('ViewPlan'),
        viewBaseFormula: this.apiService.checkPermission('ViewBaseFormula')
      };
      if (!keyword) {
        this.toastMsg.error("Please enter the value to search");
      } else {
        this.apiService.post("SearchContent/", searchpayLoad).subscribe(
          data => {
            if (data.statusCode === "200" || data.statusCode === "201") {
              var values = data.result.map(x => { return <ISearchResult>x });

              values = _.groupBy(values, 'objectType');

              this.searchValues = Object.keys(values).map(k => {
                return <ISearchValue>{
                  type: k,
                  values: values[k]
                };
              })

              if (this.keyword == undefined) {
                this.keyword = "";
              }
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

  onClick(item: ISearchResult): void {
    this.sharedSidebarService.updateSidebarToggle("close");
    this.sharedSidebarService.updateMenuToggle("open");

    switch (item.objectType) {
      case "CommissionRule":
        switch (item.ruleType) {
          case "Base Pay Structure":
            this.viewBasePayStructure(item.objectId);
            break;

          case "Payment Book":
            this.viewPaymentBook(item.objectId);
            break;

          default:
            this.viewRule(item.objectId);
            break;
        }
        break;

      case "Opportunity":
        this.viewOpportunity(item.objectId);
        break;

      case "Plan":
        this.viewPlan(item.objectId);
        break;

      case "Formula":
        this.viewBaseFormula(item.objectId);
        break;

      case "Contact":
        this.viewContact(item.objectId);
        break;

      default:
        break;
    }
  }

  ngOnDestroy() {
    localStorage.setItem('opportunity', '/ui/commissions/search');
  }
}