import { Component, OnInit, ElementRef, Inject, Input, ViewEncapsulation, ViewChild, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SearchComponent } from '../../search/search.component';
import { IRule } from 'src/app/model/rule.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IPaymentDueDateMapping } from 'src/app/model/payment-due-date-mapping.model';
import { IStep, ICondition } from 'src/app/model/step.model';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as FileSaver from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-view-rule',
  templateUrl: './view-rule.component.html',
  styleUrls: ['./view-rule.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewRuleComponent implements OnInit, OnDestroy {
  rulesForm: IRule = <IRule>{};
  createRuleForm: FormGroup;
  showBasePayStructure: boolean = false;
  showBasePay: boolean = true;
  showBonusIncentive: boolean = false;
  showRateIncentive: boolean = false;
  showPaymentBook: boolean = false;
  showChildRuleTypes: boolean = false;
  employeeIncentive: boolean = false;
  bonusReclaimShow: boolean = false;
  childRuleTypes: any;
  count: number = 1;
  hElement: HTMLElement;
  ruleTypes: any[] = [];
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
  rule: any = {};
  stepsArray: any[] = [];
  commissionRuleShow: boolean = false;
  paymentRuleShow: boolean = false;
  commissionTriggerRuleShow: boolean = false;
  incentiveTypeId: number;
  paymentDueDateMappingsName: number;
  effectiveStartEndDateInd: boolean;
  viewRuleId: any;
  awardIncentiveData: any
  @Input() ruleTypeId: number;
  paymentDueDateMappings: IPaymentDueDateMapping[];
  quarterDropdownShow: boolean = false
  commissionRuleTypes: any = []
  calandarYearQuarters: any;
  paymentRuleTypes: any = []
  commissionTriggerRuleTypes: any = []
  commissionRuleId: number;
  paymentRuleTypeId: number;
  commissionTriggerRuleId: number;
  effectiveStartDate: any;
  effectiveEndDate: any;
  start_quater: any;
  childRuleName: any;
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  quarterTypes: any = ["Q1", "Q2", "Q3", "Q4"];
  startDateLabel: any;
  endDateLabel: any;
  steps: IStep[];
  constructor(@Inject(DOCUMENT) document, private formBuilder: FormBuilder, public apiService: ApiService,
    private renderer: Renderer2, private elementRef: ElementRef, private toastMsg: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) {
    this.apiService.hideLoader = true;
    this.hElement = this.elementRef.nativeElement;
    // this.viewRuleId = this.activatedRoute.snapshot.params.id;
    localStorage.setItem('href', window.location.href);
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.viewRuleId = params.id;

      if (!this.apiService.checkPermission('ViewRule')) {
        // this.router.navigate(['/ui/dashboard'])
        this.apiService.goBack();
        this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
      }
      this.apiService.get('Rule/' + this.viewRuleId)
        .subscribe(data => {
          if (data.statusCode === "200" || data.statusCode === "201") {
            console.log('rule',data.result);
            this.rulesForm = <IRule>{
              ruleId: data.result.rule_id,
              ruleName: data.result.rule_name,
              description: data.result.description,
              ruleTypeId: data.result.rule_type_id,
              ruleTypeName: data.result.rule_type_name,
              effectiveStartDate: data.result.start_date,
              effectiveEndDate: data.result.end_date,
              noReclaim: data.result.noReclaim,
              promptAssignPlan: data.result.prompt_assign_plan,
              numberOfBonuses: data.result.numberOfBonuses
            };
            // console.log("Rule: ", this.rulesForm);
            this.effectiveStartDate = data.result.start_date;
            this.effectiveEndDate = data.result.end_date;
            this.start_quater = data.result.start_quater;
            this.childRuleName = JSON.parse(JSON.stringify(data.result.rule_type_name));
            localStorage.setItem('LastRuleDetails', JSON.stringify(data.result))
            this.incentiveTypeId = data.result.rule_type_id;
            this.paymentDueDateMappingsName = data.result.paymentDueDateMappingId ? data.result.paymentDueDateMappingId : "";
            this.effectiveStartEndDateInd = this.rulesForm.effectiveStartDate != null || this.rulesForm.promptAssignPlan;
            if (data.result.rule_type_name == "Kilowatt Incentives" || data.result.rule_type_name == "Self-Gen Install Incentive Goal"
              || data.result.rule_type_name == "Outreach - EOM Existing Incentive" || data.result.rule_type_name == "Outreach - EOM 10/1/10 Incentive"
              || data.result.rule_type_name == "Outreach - EOM Old DM Pay Incentive" || data.result.rule_type_name == "Outreach - EOM Old DM Pay Unlimited Incentive") {
              this.rulesForm.ruleTypeId = 4;
              this.rulesForm.ruleTypeName = "Bonus Incentive Goal";
              this.getRuleTypes(4);
            } else if (data.result.rule_type_name == "Outreach High Flyer" || data.result.rule_type_name == "Direct High Flyer"
              || data.result.rule_type_name == "Traditional President's Club" ||
              data.result.rule_type_name == "Traditional High Flyer" || data.result.rule_type_name == "Direct President's Club") {
              this.rulesForm.ruleTypeId = 5;
              this.rulesForm.ruleTypeName = "Rate Incentive Goal";
              this.getRuleTypes(5);
            }
            else {
              this.getRuleTypes(data.result.rule_type_id);
            }
            if (data.result.paymentDueDateMappingId >= 0) {
              this.getPaymentDueDateMappings();
            }

            //Commission Rule Types
            if (data.result.commission_rule_type_id > 0) {
              this.getCommissionTypes(data.result.commission_rule_type_id);
            }
            //Payment Rule Types
            if (data.result.payment_rule_type_id > 0) {
              this.getPaymentTypes(data.result.payment_rule_type_id);
            }
            //Trigger Rule Types
            if (data.result.trigger_rule_type_id > 0) {

              this.getCommissionRuleTriggers(data.result.trigger_rule_type_id);
            }
            for (let i = 0; i < data.result.steps.length; i++) {
              this.stepsArray = data.result.steps;
              this.steps = this.stepsArray.map(s => {
                return <IStep>{
                  stepName: s.step_name,
                  stepId: s.step_id,
                  action: s.action,
                  criteria: s.criteria,
                  comment: s.comment,
                  roundDepth: s.roundDepth,
                  conditions: s.conditions.map(c => {
                    return <ICondition>{
                      rightSide: c.right_side,
                      leftSide: c.left_side,
                      operators: c.operators,
                      action: c.action
                    }
                  })
                }
              });
            }
            this.toastMsg.success("Rule fetched successfully", '!');
          } else {
            this.toastMsg.error("Server", 'Error!')
          }
        }, (err: any) => {
          this.toastMsg.error(err, 'Error!')
        });
      //this.onDemandProcessStatus()
      this.getAwardIncentives();
    })
    
  }

  modifystartEndDates() {
    let item = this.childRuleTypes ? this.childRuleTypes.filter(row => row.ruleCd == this.childRuleName) : [];
    if (this.childRuleTypes && item && item.length > 0) {
      if (item[0].frequency == "Quarterly") {
        this.startDateLabel = "Quarter";
        this.endDateLabel = "Year";
        this.getCalandarYearQuarters();
      }
      else if (item[0].frequency == "Monthly") {
        this.startDateLabel = "Month";
        this.endDateLabel = "Year";
        if (this.effectiveStartDate) {
          this.rulesForm.effectiveStartDate = this.monthNames[new Date(this.effectiveStartDate).getMonth()];
        }
        if (this.effectiveEndDate) {
          this.rulesForm.effectiveEndDate = new Date(this.effectiveEndDate).getFullYear();
        }
      } else if (item[0].frequency == "Date") {
        this.startDateLabel = "Start Date";
        this.endDateLabel = "End Date";
        if (this.effectiveStartDate) {
          this.rulesForm.effectiveStartDate = this.apiService.dateFormat(this.effectiveStartDate.toString(), 'dd-MM-yyyy');
        }
        if (this.effectiveEndDate) {
          this.rulesForm.effectiveEndDate = this.apiService.dateFormat(this.effectiveEndDate.toString(), 'dd-MM-yyyy');
        }
      }
    } else {
      let item = this.ruleTypes.filter(row => row.ruleCd == this.rulesForm.ruleTypeName);
      if (item && item.length > 0 && item[0].frequency == "Date") {
        this.startDateLabel = "Start Date";
        this.endDateLabel = "End Date";
        if (this.effectiveStartDate) {
          this.rulesForm.effectiveStartDate = this.apiService.dateFormat(this.effectiveStartDate.toString(), 'dd-MM-yyyy');
        }
        if (this.effectiveEndDate) {
          this.rulesForm.effectiveEndDate = this.apiService.dateFormat(this.effectiveEndDate.toString(), 'dd-MM-yyyy');
        }
      }
    }
  }

  getCalandarYearQuarters() {

    this.apiService.get('GetData/CalandarYearQuarters')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          console.log('calandar', this.start_quater);
          this.calandarYearQuarters = data.result;
          if (this.start_quater && this.start_quater.indexOf('Q') !== -1) {

            let i: number = 0;
            let quarterVal = 0;
            this.calandarYearQuarters.filter(
              data => {
                if (data.calandarYearQuarterName == this.start_quater.split(' ')[0]) {
                  quarterVal = i
                  return i;
                }
                i++;
              }
            );

            let quarterYearVal = this.start_quater.split(' ')[1];
            this.rulesForm.effectiveStartDate = this.quarterTypes[quarterVal];
            this.rulesForm.effectiveEndDate = quarterYearVal.toString();
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  getValueType(data) {
    //console.log("data",data);
    // if (data != "1" && data != "2") {
      // Dilip 06/23/2020 COM-981
      if (data != "1" && data != "2" && data != "4") {
      return "3";
    }
  }
  /**
     * GetCommissionTypes
     */
  getCommissionTypes(ruleId) {
    this.apiService.get('GetData/GetCommissionTypes')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.commissionRuleTypes = data.result;
          this.commissionRuleShow = true;
          if (data.result.length > 0) {
            this.commissionRuleTypes.filter(item => {
              if (item.id == ruleId) {
                this.commissionRuleId = item.id
              }
            });
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * GetPaymentTypes
   */
  getPaymentTypes(ruleId) {
    this.apiService.get('GetData/GetPaymentTypes')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.paymentRuleTypes = data.result;
          this.paymentRuleShow = true;
          if (data.result.length > 0) {
            this.paymentRuleTypes.filter(item => {
              if (item.id == ruleId) {
                this.paymentRuleTypeId = item.id
              }
            });
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * GetCommissionRuleTriggers
   */
  getCommissionRuleTriggers(ruleId) {
    this.apiService.get('GetData/GetCommissionRuleTriggers')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.commissionTriggerRuleTypes = data.result;
          this.commissionTriggerRuleShow = true;
          if (data.result.length > 0) {
            this.commissionTriggerRuleTypes.filter(item => {
              if (item.id == ruleId) {
                this.commissionTriggerRuleId = item.id
              }
            });
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }
  getPaymentDueDateMappings() {
    this.apiService.get('GetData/PaymentDueDateMappings')
      .subscribe(data => {
        if (data && data.statusCode === "201" && data.result) {
          //console.log("Payment Due", data)
          this.paymentDueDateMappings = data.result.map(x => { return <IPaymentDueDateMapping>x });
          // console.log("Payment Due Date Mappings", this.paymentDueDateMappings);
        }
      }, err => {
        this.toastMsg.error(err, "Server Error!");
      })
  }
  onChangeRuleType(rule) {
    // console.log("rule",rule);
    let rule_type = rule[0].ruleCd;
    let payment_types_data = $('#mySelect option:selected').attr('payment_types_data')
    let commission_types_data = $('#mySelect option:selected').attr('commission_types_data')
    let trigger_types_data = $('#mySelect option:selected').attr('trigger_types_data')
    let ruleId = this.rulesForm.ruleTypeId;
    this.employeeIncentive = false;
    this.bonusReclaimShow = false;
    switch (rule_type.trim()) {
      case "Base Pay Structure": {
        this.showBasePay = false;
        this.showBasePayStructure = true;
        this.showBonusIncentive = false;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.app-basepay-structure').addClass('w-72');


        break;
      }
      case "Bonus Incentive Goal": {
        this.showBasePay = true;
        this.showBasePayStructure = false;
        this.showBonusIncentive = true;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.showBasePay').addClass('w-72');


        break;
      }
      case "Rate Incentive Goal": {
        this.showBasePay = true;
        this.showBasePayStructure = false;
        this.showBonusIncentive = false;
        this.showRateIncentive = true;
        this.showPaymentBook = false;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.showBasePay').addClass('w-72');


        break;
      }
      case "Bonus": {
        this.showBasePay = true;
        this.showBasePayStructure = false;
        this.showBonusIncentive = false;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        this.bonusReclaimShow = true;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.showBasePay').addClass('w-72');


        break;
      }
      case "Payment Book": {
        this.showBasePay = false;
        this.showBasePayStructure = false;
        this.showBonusIncentive = false;
        this.showRateIncentive = false;
        this.showPaymentBook = true;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').addClass('disabled');
        $('.app-payment-book').addClass('w-72');


        break;
      }
      case "Employee Incentive": {
        this.showBasePay = true;
        this.showBasePayStructure = false;
        this.showBonusIncentive = false;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        this.employeeIncentive = true;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.showBasePay').addClass('w-72');
        break;
      }
      default: {
        this.showBasePay = true;
        this.showBasePayStructure = false;
        this.showBonusIncentive = false;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.showBasePay').addClass('w-72');


        break;
      }
    }

    //Get child rule types
    if (this.showBonusIncentive == true || this.showRateIncentive == true) {
      this.getChildRuleTypes(ruleId);
    } else {
      this.showChildRuleTypes = false;
      this.modifystartEndDates();
    }

    if (payment_types_data == 'true')
      this.paymentRuleShow = true
    else
      this.paymentRuleShow = false

    if (commission_types_data == 'true')
      this.commissionRuleShow = true
    else
      this.commissionRuleShow = false

    if (trigger_types_data == 'true')
      this.commissionTriggerRuleShow = true
    else
      this.commissionTriggerRuleShow = false

  }

  /**
   * Get Rule Types
   */
  getRuleTypes(id?: any) {
    this.apiService.get('getdata/GetRuleType')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.ruleTypes = data.result;
          let ruleType = this.ruleTypes.filter(item => item.ruleTypeId == id);
          this.onChangeRuleType(ruleType);
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  getChildRuleTypes(ruleId, data?: any) {
    //   commissionRuleShow: boolean = false
    // paymentRuleShow: boolean = false
    // commissionTriggerRuleShow: boolean = false
    if (ruleId) {
      this.showChildRuleTypes = true
      this.apiService.get('getdata/GetRuleType/' + ruleId)
        .subscribe(data => {
          if (data["statusCode"] === "201" && data.result) {
            this.childRuleTypes = data.result;
            this.modifystartEndDates();
          }
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!')
        });
    }
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }


  /**
   * Start On-Demand Process
   * @param rule_id
   */

  startOnDemand() {
    if (this.viewRuleId) {
      let payload = {
        RuleId: this.viewRuleId,
        StartDate: this.effectiveStartDate,
        EndDate: this.effectiveEndDate
      }
      this.apiService.post('OnDemand', payload)
        .subscribe(data => {
          // console.log('Ondemand', data)
          if (data["statusCode"] === "201" && data.result == true) {
            this.toastMsg.success("Ondemand process has been started successfully.", 'Success!')
          } else {
            this.toastMsg.success(data.message, 'Error!')
          }
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!')
        });
    } else {
      this.toastMsg.error("Ondemand process is  failed.", 'Success!')
    }
  }

  /**
   * Check OnDemand Status
   * @param rule_id
   */
  onDemandProcessStatus() {
    if (this.viewRuleId) {
      this.apiService.get('OnDemand/' + this.viewRuleId)
        .subscribe(data => {
          // console.log('Ondemand Status', data)
          if (data["statusCode"] === "201" && data.result == true) {
            this.toastMsg.warning("Already one process is running, Please try after sometime.", 'Warning!')
          } else if (data["statusCode"] == '201' && data.result == false) {
            this.startOnDemand()
          }
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!')
        });
    }
  }

  /**
   * Get Award Incentive Info
   * @param rule_id
   */
  getAwardIncentives() {
    // console.log("Rule Id & Contact Id", this.viewRuleId)
    if (this.viewRuleId) {
      this.apiService.get('OnDemandJson/' + this.viewRuleId)
        .subscribe(data => {
          // console.log('Award Incentives', data)
          if (data["statusCode"] === "201" && data.result) {
            this.awardIncentiveData = data.result;
            // console.log("this.awardIncentiveData",this.awardIncentiveData);
          }
        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!')
        });
    }
  }

  GetAwardedIncentivesWorksheet() {    
    this.http.get(`${environment.apiBaseUrl}GetData/AwardedIncentivesWorksheet/${this.viewRuleId}`, { responseType: 'blob' })
      .subscribe(data => {
        this.downLoadFile(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8");
      }, err => {
        this.toastMsg.error(err, "Error!");
      });
  }  
  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });

    FileSaver.saveAs(blob, this.rulesForm.ruleName + '.xlsx');
  }

}
