import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { IPlanDetails } from 'src/app/model/plan-details.model';
import { IBasicPlan } from 'src/app/model/basic-plan.model';
declare var $: any;

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css']
})
export class ViewPlanComponent implements OnInit {

  basicPlan: any[] = [];
  savedPlan = [];
  dummyPlan = [];
  rules: any[] = [];
  rulesData: any[] = [];
  item: string = "no";
  requiredIndex: number = 100;
  removedIndex: number = 100;
  removedChildIndex: number = 100;
  child: boolean = false;
  childIndex: number = 100;
  parentIndex: number = 100;
  removedParentIndex: number = 100;
  planName: string;
  planId: any;
  planDetails: IPlanDetails;
  ruleType: string;
  showPreview: boolean = false;
  ruleId: number;
  noRule: boolean = false;

  constructor(public apiService: ApiService, private toastMsg: ToastrService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    this.apiService.hideLoader = true;

  }

  getRuleTypes() {
    this.apiService.get('getdata/GetRuleType')
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          data.result.forEach((row: any) => {
            if (["Employee Incentive", "Base Pay Structure", "Payment Book"].includes(row.ruleCd)) return;
            this.basicPlan.push({ "parent": row.ruleCd, "child": [] });
            this.savedPlan.push({ "parent": row.ruleCd, "child": [] });
            this.dummyPlan.push({ "parent": row.ruleCd, "child": [] });
          });
          this.getRules();
          // console.log("rules", data.result)
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  // getRules() {
  //   this.apiService.get('getdata/GetRules')
  //     .subscribe(data => {
  //       var tempThis = this;
  //       if (data.statusCode === "201" && data.result) {
  //         this.rulesData = data.result;
  //         // console.log("data",this.rulesData);
  //         data.result.forEach((row: any) => {
  //           tempThis.rules = tempThis.rules.concat(row.data);
  //           let ruleArray = this.basicPlan.filter(item => item.parent == row.ruleType);
  //           if (ruleArray && ruleArray.length > 0) {
  //             ruleArray[0].child = [];
  //             row.data.forEach((row1: any) => {
  //               ruleArray[0].child.push(row1.ruleName);
  //             });
  //           }
  //         });
  //         this.assignPlan();
  //       }
  //     }, (err: any) => {
  //       this.toastMsg.error(err, 'Server Error!')
  //     });
  // }

  getRules() {
    this.apiService.get('Plans/RepConfig/' + this.planId)
      .subscribe(data => {
        if (data.statusCode === "200" || data.statusCode === "201") {
          this.planName = data.result.planName;
          this.planDetails = <IPlanDetails>data.result;
          this.basicPlan = this.planDetails.planDetails.map(pd => {
            return <IBasicPlan>{
              parent: pd.ruleTypeName,
              child: pd.rules
            }
          });
          // this.toastMsg.success("Plan fetched successfully", 'Success!');
          // this.getRateIncentiveGoal();
        } else {
          this.toastMsg.error("Server Error", 'Error!')
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Error!')
      });
  }

  clone() {
    localStorage.setItem("clone", "true");
    localStorage.setItem("planId", JSON.stringify(this.planId));
    this.router.navigate(["ui/commissions/createplan"]);
  }

  assignPlan() {
    let plan = window.location.href.split('/');
    this.planId = plan[plan.length - 1];
    this.apiService.get('Plans/' + this.planId)
      .subscribe(data => {
        if (data.statusCode === "200" || data.statusCode === "201") {
          this.planName = data.result.planName;
          data.result.planDetails.forEach((row: any) => {
            let ruletype: any[] = [];
            for (let i = 0; i < row.rules.length; i++) {
              ruletype = this.rulesData.filter(item1 => item1.ruleType == row.ruleTypeName);
              if (ruletype) {
                if (ruletype[0]) {
                  let rule;
                  let child = false;
                  if (ruletype[0].children != null) {
                    rule = ruletype[0].children.filter(rule => rule.ruleTypeId == row.rules[i].ruleId);
                    child = true;
                  } else {
                    rule = ruletype[0].data.filter(rule => rule.ruleId == row.rules[i].ruleId);
                    child = false;
                  }
                  this.savedPlan.forEach((row1: any) => {
                    if (rule[0]) {
                      if (row1.parent == row.ruleTypeName) {
                        if (child == false) {
                          row1.child.push(rule[0].ruleName);
                        } else {
                          row1.child.push(rule[0].ruleType);
                        }
                      }
                    }
                  });
                }
              }
            }
          });
          this.toastMsg.success("Plan fetched successfully", '!');
        } else {
          this.toastMsg.error("Server", 'Error!')
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Error!')
      });

  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {  //  Dilip  COM-815 
      this.planId = params.id;
      if (!this.apiService.checkPermission('ViewPlan')) {
        // this.router.navigate(['/ui/dashboard'])
        this.apiService.goBack();
        this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
      }
      this.showPreview = false;
      this.ruleType = null;
      this.ruleId = null;
      $.fn.extend({
        treed: function (o) {

          var openedClass = 'fa-minus-circle';
          var closedClass = 'fa-plus-circle ';

          if (typeof o != 'undefined') {
            if (typeof o.openedClass != 'undefined') {
              openedClass = o.openedClass;
            }
            if (typeof o.closedClass != 'undefined') {
              closedClass = o.closedClass;
            }
          };

          //initialize each of the top levels
          var tree = $(this);
          tree.addClass("treeview");
          $('#tree1').find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            // console.log(branch,"branch");
            branch.prepend("<i class='indicator fa " + closedClass + "'></i>");
            branch.addClass('branch');
            branch.on('click', function (e) {
              if (this == e.target) {
                var icon = $(this).children('i:first');
                icon.toggleClass(openedClass + " " + closedClass);
                $(this).children().children().toggle();
              }
            })
            branch.children().children().toggle();
          });
          //fire event from the dynamically added icon
          tree.find('.branch .indicator').each(function () {
            $(this).on('click', function () {
              $(this).closest('li').click();
            });
          });
          //fire event to open branch if the li contains an anchor instead of text
          tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
              $(this).closest('li').click();
              e.preventDefault();
            });
          });
          //fire event to open branch if the li contains a button instead of text
          tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
              $(this).closest('li').click();
              e.preventDefault();
            });
          });
        }
      });

      //Initialization of treeviews
      $('#tree1').treed();
      $('#tree2').treed();
      this.getRuleTypes();
    });
  }

  onChildClick(parent: any, child: any) {
    if (child && child.ruleId > 0) {
      this.showPreview = true;
      this.noRule = false;
      this.ruleType = parent.parent;
      this.ruleId = child.ruleId;
    } else {
      this.noRule = true;
      this.showPreview = false;
    }

    // if (this.ruleType = "Rate Incentive Goal")
    //   {
    //     this.getRateIncentiveGoal();
    //   }
  }

}
