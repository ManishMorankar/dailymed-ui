
import { Component, OnInit, AfterViewInit, ElementRef, Inject, ViewEncapsulation, Input, ChangeDetectorRef, ViewChild, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../services/api.service";
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { MetadataRestructure, DragDropRestructure, DragDropContent } from './model/aggregate.model';
import { StaticRestructure } from './model/static.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RateObject, ActionObject, ConditionObject } from './model/rate-object.model';
import { ValidateActionService } from './service/validate-action.service';
import { RestructureService } from './service/restructure.service';
import { IPaymentDueDateMapping } from 'src/app/model/payment-due-date-mapping.model';
import { MatDialog } from '@angular/material';
import { CreateStaticComponent } from './create-static/create-static.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { baseFormulaFirstCharacter } from 'src/app/shared/validators';
declare var $: any;

@Component({
  selector: 'app-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateRuleComponent implements OnInit, AfterViewInit, OnDestroy {
  //@ViewChild('action-box', {static: false}) actionBox: ElementRef;
  searchedItem: any[];
  rateObject: RateObject[];
  allMetadata: string[];
  staticStructure: StaticRestructure[];
  aggregateStructure: DragDropRestructure[];
  rateAndExceptionStructure: DragDropRestructure[];
  promptStructure: DragDropRestructure[];
  createRuleForm: FormGroup;
  showBasePayStructure: boolean = false;
  showBasePay: boolean = true;
  showBonusIncentive: boolean = false;
  showRateIncentive: boolean = false;
  showPaymentBook: boolean = false;
  employeeIncentive: boolean = false;
  bonusReclaimShow: boolean = false;
  count: number = 1;
  hElement: HTMLElement;
  ruleTypes: any = [];
  tableContentData: any;
  staticMetaData: { identifier: string, tableName: string, displayName: string, dataType: string }[]
  baseFormulasData: { identifier: string, displayName: string, dataType: string }[]
  allTableContents: { identifier: string, tableName: string, columnName: string, displayName: string, dataType: string }[];
  booleansData: {tableName: string, content: { identifier: string, displayName: string, dataType: string }[]}[];
  paymentDueDateMappings: IPaymentDueDateMapping[];
  isDisabled: boolean = true;
  isReadonly: boolean = true;
  invalidRule: boolean = false;
  criteriaHtml: any;
  creationTypes: any = ["Rule", "Base Formula"];
  activeCreationType: string = this.creationTypes[0];
  currentDraggedItemType: string;
  validInput: boolean = true;
  startDate: any;
  endDate: any;
  conditionalCriteria: boolean;
  childRuleTypes: any;
  showChildRuleTypes: boolean = false
  commissionRuleShow: boolean = false
  paymentRuleShow: boolean = false
  quarterDropdownShow: boolean = false
  commissionTriggerRuleShow: boolean = false
  commissionRuleTypes: any = []
  calandarYearQuarters: any;
  paymentRuleTypes: any = []
  commissionTriggerRuleTypes: any = []
  pageType: string = "createrule"
  defaultRultType: string = "1"
  createZeroCommission: boolean = false;
  conditionalOperator: any = [{ label: "<", name: "Less than" }, { label: ">", name: "Greater than" }, { label: "<=", name: "Less than or equal" }, { label: ">=", name: "Greater than or equal" }, { label: "=", name: "Equal" }]
  allSteps: any = []
  saveBtn: string = "Save Rule"
  yearsList: any = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"];
  quarterTypes: any = [{ "CalandarYearQuarterName": "Q1", "QuarterStartMonthNumber": "01", "QuarterStartDateNumber": "01", "QuarterEndMonthNumber": "03", "QuarterEndDateNumber": "31" },
  { "CalandarYearQuarterName": "Q2", "QuarterStartMonthNumber": "04", "QuarterStartDateNumber": "01", "QuarterEndMonthNumber": "06", "QuarterEndDateNumber": "30" },
  { "CalandarYearQuarterName": "Q3", "QuarterStartMonthNumber": "07", "QuarterStartDateNumber": "01", "QuarterEndMonthNumber": "09", "QuarterEndDateNumber": "30" },
  { "CalandarYearQuarterName": "Q4", "QuarterStartMonthNumber": "10", "QuarterStartDateNumber": "01", "QuarterEndMonthNumber": "12", "QuarterEndDateNumber": "31" }]
  aggregationData: { identifier: string, tableName: string, displayName: string, dataType: string }[]
  ratesAndExceptionsData: { identifier: string, tableName: string, displayName: string, dataType: string }[]
  promptData: { identifier: string, tableName: string, displayName: string, dataType: string }[]
  ruleTypeName: string;
  ruleTypeName2: string;
  reclaim: boolean = false;
  @Input() cloneRule: any = {};
  clone: any;
  monthlyDropdownShow: boolean = false;
  dateDropdownShow: boolean = false;
  advancedConditionArray: { valid: boolean, validReason: string, visable: boolean, firstItem: boolean, conditionString: string, condition: any[] }[];
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(@Inject(DOCUMENT) document, private changeDetectorRef: ChangeDetectorRef,
    private router: Router, private formBuilder: FormBuilder, public apiService: ApiService,
    private renderer: Renderer2, private elementRef: ElementRef, private toastMsg: ToastrService,
    private _validateActionService: ValidateActionService, private _restructureService: RestructureService, private dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    this.apiService.hideLoader = true;
    this.hElement = this.elementRef.nativeElement
    this.allMetadata = [];
    this.conditionalCriteria = false;
    this.rateObject = [{
      id: 1, step: 1, conditionName: "", conditions: [{ id: 1, condition1: { name: "", metadata: "", identifier: "" }, operator: "Less than", condition2: { name: "", metadata: "", identifier: "" }, isValid: false }],
      conditionQualifier: "", advanceCondition: "", action: [{ id: 1, action: "", identifier: "" }], validAction: false, invalidReasoning: "Action cannot be empty", roundDepth: 0, roundInd: false, actionDisplay: [""]
    }];
    this.advancedConditionArray = [{ valid: false, validReason: "Condition field is empty", visable: false, firstItem: true, conditionString: "", condition: [""] }];
    if (this.router.url.includes('baseformula')) {
      if (!this.apiService.checkPermission('CreateBaseFormula')) {
        this.router.navigate(['notfound'])
      }
      this.pageType = 'baseformula'
      this.activeCreationType = 'Base Formula'
      this.saveBtn = "Save Base Formula"
    } else {
      if (!this.apiService.checkPermission('CreateRule')) {
        this.router.navigate(['notfound'])
      }
    }
    this.initializeFormGroup();
  }

  onDrop(event: CdkDragDrop<string[]>, stepId: number) {
    moveItemInArray(this.rateObject[stepId].action, event.previousIndex, event.currentIndex);
    moveItemInArray(this.rateObject[stepId].actionDisplay, event.previousIndex, event.currentIndex);
    this.validateAction(stepId);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.innerHTML + " ");
    this.currentDraggedItemType = ''
    if (ev.target.attributes.data_type && ev.target.attributes.data_type.value) {
      ev.dataTransfer.setData("dataType", ev.target.attributes.data_type.value)
      this.currentDraggedItemType = ev.target.attributes.data_type.value
    }
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var dataType = ev.dataTransfer.getData("dataType");

    let splitStep = (ev.target.name).split('_')
    let alwaysTrue = $('#step_' + splitStep[1] + '_always_true').prop('checked')
    if (alwaysTrue && splitStep[4] == "1") {
      return false
    }
    //$('input[name="'+ev.target.name+'"]').val(data)
    let button;
    let conditionFlag = ""

    if ((ev.target.name).includes('left') || (ev.target.name).includes('right')) {
      if (dataType == 'Numeric_Action') {
        return false
      }

      if ((ev.target.name).includes('left')) {
        button = (ev.target.name).replace('left', 'validate')

      } else if ((ev.target.name).includes('right')) {
        button = (ev.target.name).replace('right', 'validate')

      }

      $('input[name="' + ev.target.name + '"]').css("background-color", "#22cbce")
    } else {
      data += " "
    }
    ev.target.value = data;
    //this.createRuleForm.controls[ev.target.name].setValue(data)
    //$()
    $('input[name="' + ev.target.name + '"]').attr('dataType', dataType)


    if (button) {
      let condition_left_btn_id = (button).replace('validate', 'left')
      let condition_right_btn_id = (button).replace('validate', 'right')
      $('#' + button).html('Validate')

      let right = $('input[name="' + condition_right_btn_id + '"]').val()
      let left = $('input[name="' + condition_left_btn_id + '"]').val()
      if (right.trim() && left.trim()) {
        let element: HTMLElement = document.getElementById(button) as HTMLElement;
        element.click()
      }

    }
  }

  ngOnInit() {
    if (!this.apiService.checkPermission('CreateRule')) {
      // this.router.navigate(['/ui/dashboard'])
      this.apiService.goBack();
      this.toastMsg.error("Insufficient Permissions. Please make sure your account can access this information.", "Permissions");
    }
    this.staticStructure = [{ dataType: 'Numeric', content: [] }, { dataType: 'String', content: [] }, { dataType: 'Date', content: [] }, { dataType: 'Boolean', content: [] }];

    if (this.pageType != 'baseformula') {
      this.getRuleTypes()
      this.getCommissionTypes()
      this.getCommissionRuleTriggers()
      this.getPaymentTypes()
      this.getCalandarYearQuarters();
      this.getPaymentDueDateMappings();
    }
    this.getStaticMetaData();
    this.getTerritoryMetaData();

    this.getBooleans();

  }

  ngOnDestroy() {
    this._snackBar.dismiss()
  }

  ngAfterViewInit() {

  }
  ngOnChanges() {
    //this.changeDetectorRef.detectChanges();
    if (this.cloneRule) {
      this.clone = true;
    } else {
      this.clone = false;
    }
  }

  onChangeCreationType(ev: any) {
    let creation_type = ev.target.options[ev.target.selectedIndex].value;
    let urls = "/ui/commissions/rule/create"
    if (creation_type == this.creationTypes[1]) {
      urls = "/ui/commissions/rule/baseformula"
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '35%',
      data: {
        message: "Your unsaved progress will be deleted, do you wish to continue?"
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      // console.log(confirmed);
      if (confirmed) {
        this.router.navigate([urls])
      } else {
        if (creation_type == 'Rule')
          this.createRuleForm.controls['activeCreationType'].setValue(this.creationTypes[1])
        else
          this.createRuleForm.controls['activeCreationType'].setValue(this.creationTypes[0])

        return false
      }
    });

  }

  getCalandarYearQuarters(flag = '') {

    this.apiService.get('GetData/CalandarYearQuarters')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.calandarYearQuarters = data.result;
          if (flag == 'clone' && this.cloneRule.start_quater && this.cloneRule.start_quater.indexOf('Q') !== -1) {
            
            let i: number = 0;
            let quarterVal = 0;
            this.calandarYearQuarters.filter(
              data => {
                if (data.calandarYearQuarterName == this.cloneRule.start_quater.split(' ')[0]) {
                  
                  quarterVal = i
                  return i;
                }
                i++;
              }
            );

            this.createRuleForm.patchValue({ startDate: this.cloneRule.start_quater.split(' ')[0] })
            this.createRuleForm.patchValue({ endDate: this.cloneRule.end_quater.split(' ')[1] })
            
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  activateBaseFormula() {
    $("#mySelect")[0].value = "Base Pay";
    // if anyone knows how to trigger onchange event progammatically, please change this section
    this.showBasePay = true;
    this.showBasePayStructure = false;
    this.showBonusIncentive = false;
    this.showRateIncentive = false;
    this.showPaymentBook = false;
    $('*').removeClass('w-72');
    $('.showBasePay').addClass('w-72');
  }

  onChangeSubCategory() {
    let quarter_status = $('#child_rule_type_id option:selected').attr('quartertype');
    if (quarter_status == 'Quarterly') {
      this.quarterDropdownShow = true;
      this.monthlyDropdownShow = false;
      this.dateDropdownShow = false;
    } else if (quarter_status == "Date") {
      this.dateDropdownShow = true;
      this.quarterDropdownShow = false;
      this.monthlyDropdownShow = false;
    } else if (quarter_status == "Monthly") {
      this.monthlyDropdownShow = true;
      this.dateDropdownShow = false;
      this.quarterDropdownShow = false;
    } else {
      this.monthlyDropdownShow = false;
      this.quarterDropdownShow = false;
      this.dateDropdownShow = false;
    }
  }

  onChangeRuleType(ev: any, flag = "") {
    let rule_type = "", ruleId = ""
    if (flag == 'clone') {
      rule_type = ev[0].ruleCd
      ruleId = ev[0].ruleTypeId.toString()


      this.createRuleForm.controls.rule_type_id.setValue(ruleId)
    } else {
      rule_type = ev.target.options[ev.target.selectedIndex].text;
      this.ruleTypeName = rule_type
      this.ruleTypeName2 = rule_type
      ruleId = this.createRuleForm.controls.rule_type_id.value
    }
    let rule_childs = $('#mySelect option:selected').attr('child_data')
    let payment_types_data = $('#mySelect option:selected').attr('payment_types_data')
    let commission_types_data = $('#mySelect option:selected').attr('commission_types_data')
    let trigger_types_data = $('#mySelect option:selected').attr('trigger_types_data')
    let quarters_types_data = $('#mySelect option:selected').attr('quartertype')
    //this.onChangeSubCategory()
    this.employeeIncentive = false
    this.bonusReclaimShow = false
    //this.showBonusIncentive = false
    switch (rule_type.trim()) {
      case "Base Pay Structure": {
        this.showBasePay = false;
        this.showBasePayStructure = true;
        this.showBonusIncentive = false;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').addClass('disabled');
        $('.app-basepay-structure').addClass('w-72');
        this.defaultRultType = ruleId
        break;
      }
      case "Bonus Incentive Goal": {
        this.showBasePay = true;
        this.showBasePayStructure = false;
        this.showBonusIncentive = true;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        this.quarterDropdownShow = true;
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.showBasePay').addClass('w-72');
        this.defaultRultType = ruleId
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
        this.defaultRultType = ruleId
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
        this.defaultRultType = ruleId
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
        this.defaultRultType = ruleId
        break;
      }
      case "Employee Incentive": {
        this.showBasePay = true;
        this.showBasePayStructure = false;
        this.showBonusIncentive = false;
        this.showRateIncentive = false;
        this.showPaymentBook = false;
        this.employeeIncentive = true
        $('*').removeClass('w-72');
        $('#trinityTreeContainer').removeClass('disabled');
        $('.showBasePay').addClass('w-72');
        this.defaultRultType = ruleId
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
        this.defaultRultType = ruleId
        break;
      }

        ev.preventDefault();
    }

    // console.log("Rule Name ", rule_type, this.showBonusIncentive, this.bonusReclaimShow, this.employeeIncentive, this.createRuleForm.controls['effective_start_end_date_ind'].value)
    if (flag != 'clone') {
      this.removeAllSteps()
    }
    //Get child rule types
    if (rule_childs == 'true')
      this.getChildRuleTypes(ruleId)
    else
      this.showChildRuleTypes = false

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
      this.commissionTriggerRuleShow = false;

    if (this.ruleTypeName != 'Base Pay' && !this.showRateIncentive && !this.showPaymentBook)
      this.createRuleForm.controls.payment_due_date_mapping_id.setValue(1)
    else
      this.createRuleForm.controls.payment_due_date_mapping_id.setValue('');
    if (quarters_types_data == 'Quarterly') {
      this.quarterDropdownShow = true;
      this.monthlyDropdownShow = false;
      this.dateDropdownShow = false;
    } else if (quarters_types_data == "Monthly") {
      this.monthlyDropdownShow = true;
      this.dateDropdownShow = false;
      this.quarterDropdownShow = false;
    } else if (quarters_types_data == "Date") {
      this.dateDropdownShow = true;
      this.quarterDropdownShow = false;
      this.monthlyDropdownShow = false;
    } else {
      this.monthlyDropdownShow = false;
      this.quarterDropdownShow = false;
      this.dateDropdownShow = false;
    }
  }

  getChildRuleTypes(ruleId) {
    if (ruleId) {
      this.showChildRuleTypes = true
      this.apiService.get('getdata/GetRuleType/' + ruleId)
        .subscribe(data => {
          if (data["statusCode"] === "201" && data.result) {
            this.childRuleTypes = data.result;
            if (this.childRuleTypes.length > 0) {
              this.paymentRuleShow = this.childRuleTypes[0]["hasPaymentType"] ? this.childRuleTypes[0]["hasPaymentType"] : false;
              this.commissionRuleShow = this.childRuleTypes[0]["hasCommissionType"] ? this.childRuleTypes[0]["hasCommissionType"] : false;
              this.commissionTriggerRuleShow = this.childRuleTypes[0]["hasCommissionRuleTrigger"] ? this.childRuleTypes[0]["hasCommissionRuleTrigger"] : false;
              this.ruleTypeName = this.childRuleTypes[0]["ruleCd"];
              this.quarterDropdownShow = this.childRuleTypes[0]["frequency"] ? true : false
            }
            this.quarterDropdownShow = this.childRuleTypes[0]["frequency"] ? true : false
            //Object.keys(this.cloneRule).length > 0 ? (<HTMLInputElement>document.getElementById('child_rule_type_id')).value = this.cloneRule.rule_type_name.toString() : console.log('No clone rule');
          }

        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!')
        });
    }
  }

  getCloneChildRuleType(ruleId): void {
    if (ruleId) {
      this.apiService.get('getdata/GetCloneRuleType/' + ruleId)
        .subscribe(data => {
          if (data.result !== null) {
            this.getChildRuleTypes(data.result.ruleTypeId);
            this.ruleTypeName = data.result.ruleCd;
            this.showChildRuleTypes = true
            if (!this.cloneRule)
              this.createRuleForm.patchValue({ rule_type_id: data.result.ruleTypeId.toString() });

            if (this.cloneRule.rule_type_id > 0 && !(this.cloneRule.parent_ruletype_id > 0)) {
              //this.createRuleForm.patchValue({rule_type_id: this.cloneRule.rule_type_id.toString()});
              $('#rule_type_id').val(this.cloneRule.rule_type_id.toString());
            } else if (this.cloneRule.rule_type_id > 0 && this.cloneRule.parent_ruletype_id > 0) {
              // console.log("Rule IDS",this.cloneRule.rule_type_id, this.cloneRule.parent_ruletype_id )
              //this.createRuleForm.patchValue({child_rule_type_id: this.cloneRule.rule_type_id.toString()});
              this.createRuleForm.patchValue({ rule_type_id: this.cloneRule.parent_ruletype_id.toString() });
              $('#child_rule_type_id').val("15")
              //$('#rule_type_id').val(this.cloneRule.parent_ruletype_id.toString())
            }
          } else {
            //this.createRuleForm.patchValue({rule_type_id: this.cloneRule.rule_type_id.toString()});
          }

        }, (err: any) => {
          this.toastMsg.error(err, 'Server Error!')
        });
    }
  }
  /**
   * GetCommissionTypes
   */
  getCommissionTypes() {
    this.apiService.get('GetData/GetCommissionTypes')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.commissionRuleTypes = data.result;
          if (Object.keys(this.cloneRule).length > 0 && this.cloneRule.commission_rule_type_id > 0)
            $('#commission_rule_type_id').val(this.cloneRule.commission_rule_type_id.toString())
          //this.createRuleForm.patchValue({commission_rule_type_id: this.cloneRule.commission_rule_type_id})
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * GetPaymentTypes
   */
  getPaymentTypes() {
    this.apiService.get('GetData/GetPaymentTypes')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.paymentRuleTypes = data.result;
          if (Object.keys(this.cloneRule).length > 0 && this.cloneRule.payment_rule_type_id > 0)
            $("#payment_rule_type_id option[value='" + this.cloneRule.payment_rule_type_id + "']").prop('selected', true);
          //$('#payment_rule_type_id').val(this.cloneRule.payment_rule_type_id.toString())
          //this.createRuleForm.patchValue({payment_rule_type_id: this.cloneRule.payment_rule_type_id})
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * GetCommissionRuleTriggers
   */
  getCommissionRuleTriggers() {
    this.apiService.get('GetData/GetCommissionRuleTriggers')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.commissionTriggerRuleTypes = data.result;
          if (Object.keys(this.cloneRule).length > 0 && this.cloneRule.trigger_rule_type_id > 0)
            this.createRuleForm.patchValue({ trigger_rule_type_id: this.cloneRule.trigger_rule_type_id })
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }
  openSnackBar(message: ActionObject[]) {
    var newMessage: string = message.map(x => x.action).join();
    // let newMessage: string = message.toString();
    let formattedMessage: string = newMessage.replace(/,/g, ' ');
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-snackbar'];
    this._snackBar.open(formattedMessage, "Close", config);
  }

  addCondition(id: number, stepId: number, conditionId: number, conditionPlace: string) {
    let currentConditionId: string = `step_condition_${conditionPlace}_${stepId}_${conditionId}`;
    let currentCondition: string = ((<HTMLInputElement>document.getElementById(currentConditionId)).value).trim();
    let metadata: string = '';
    (<HTMLInputElement>document.getElementById(currentConditionId)).value = "";
    if (conditionPlace.toLowerCase() === "left")
      this.rateObject[stepId].conditions[conditionId].condition1 = { name: currentCondition, metadata: (this.getTreeData(currentCondition, 'datatype')), identifier: (this.getTreeData(currentCondition, 'identifier')) };
    else
      this.rateObject[stepId].conditions[conditionId].condition2 = { name: currentCondition, metadata: (this.getTreeData(currentCondition, 'datatype')), identifier: (this.getTreeData(currentCondition, 'identifier')) };

    this.validateCondition(stepId, conditionId);
  }

  addAdvancedConditionOption(condition: any, stepId: number, type: number) {
    if (this.advancedConditionArray[stepId].firstItem == true) {
      type == 0 ? this.advancedConditionArray[stepId].condition[0] = (condition + 1) :
        this.advancedConditionArray[stepId].condition[0] = condition;
    } else {
      type == 0 ? this.advancedConditionArray[stepId].condition.push(condition + 1) :
        this.advancedConditionArray[stepId].condition.push(condition);
    }
    // let advancedConditionUpdate = this.rateObject[stepId].advanceCondition.concat(condition);
    // this.rateObject[stepId].advanceCondition = advancedConditionUpdate;
    this.advancedConditionArray[stepId].firstItem = false;
    this.parseAdvancedCondition(stepId);
    this.advancedConditionValidation(stepId);
  }

  parseAdvancedCondition(stepId: number) {
    let parseArray: { value: string, operator: string }[] = [];;
    for (let i = 0; i < this.advancedConditionArray[stepId].condition.length; i++) {
      switch (this.advancedConditionArray[stepId].condition[i]) {
        case "AND": {
          parseArray.push({ value: "AND", operator: "operator" });
          break;
        }
        case "OR": {
          parseArray.push({ value: "OR", operator: "operator" });
          break;
        }
        case "(": {
          parseArray.push({ value: "(", operator: "open" });
          break;
        }
        case ")": {
          parseArray.push({ value: ")", operator: "close" });
          break;
        }
        default: {
          parseArray.push({ value: this.advancedConditionArray[stepId].condition[i], operator: "condition" });
          break;
        }
      }
    }
    let advancedConditionString: string = "";
    for (let i: number = 0; i < parseArray.length; i++) {
      const currentItem = parseArray[i];
      if (currentItem.operator === "operator") {
        advancedConditionString = advancedConditionString.concat(`\xa0${currentItem.value}\xa0`);

      } else {
        advancedConditionString = advancedConditionString.concat(`${currentItem.value}`);
      }
    }
    this.rateObject[stepId].advanceCondition = advancedConditionString;
    this.advancedConditionArray[stepId].conditionString = advancedConditionString;
  }

  advancedConditionValidation(stepId: number) {
    let validationArray: any = [];
    let openBrackets: number = 0;
    let closeBrackets: number = 0;
    for (let i = 0; i < this.advancedConditionArray[stepId].condition.length; i++) {
      switch (this.advancedConditionArray[stepId].condition[i]) {
        case "AND": {
          validationArray.push("operator");
          break;
        }
        case "OR": {
          validationArray.push("operator");
          break;
        }
        case "(": {
          validationArray.push("open");
          openBrackets = openBrackets + 1;
          break;
        }
        case ")": {
          validationArray.push("close");
          closeBrackets = closeBrackets + 1;
          break;
        }
        default: {
          validationArray.push("condition");
          break;
        }
      }
    }
    if (validationArray.length == 0) {
      this.advancedConditionArray[stepId].valid = false;
      this.advancedConditionArray[stepId].validReason = "The advanced condition cannot be empty";
    } else {

      for (let i: number = 0; i < validationArray.length; i++) {
        const currentItem = validationArray[i];
        if (i === 0 && currentItem === "close") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "A closing parenthesis cannot start";
          break;
        } else if (currentItem === "close" && validationArray[i + 1] === "open") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An Operator should be between opening and closing parethesis";
          break;
        } else if (currentItem === "close" && validationArray[i + 1] === "condition") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An Operator should come after a closing parenthesis";
          break;
        } else if (currentItem === "open" && validationArray[i + 1] === "close") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "A closing parenthesis cannot follow an opening parenthesis";
          break;
        } else if (currentItem === "open" && validationArray[i + 1] === "operator") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "A Condition should follow an opening parenthesis";
          break;
        } else if (currentItem === "operator" && validationArray[i + 1] === "operator") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An Operator cannot follow an Operator";
          break;
        } else if (i === 0 && currentItem === "operator") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An Operator cannot be the first item";
          break;
        } else if (currentItem === "operator" && (validationArray[i + 1] == undefined || validationArray[i + 1] == null)) {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An operator cannot end";
          break;
        } else if (currentItem === "operator" && validationArray[i + 1] === "close") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An operator cannot be the end of a wrapped statement";
          break;
        } else if (currentItem === "condition" && validationArray[i + 1] === "condition") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "A Condition cannot follow a Condition";
          break;
        } else if (currentItem === "condition" && validationArray[i + 1] === "open") {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An open parenthesis cannot follow a Condition";
          break;
        } else if (currentItem === "open" && (validationArray[i + 1] == undefined || validationArray[i + 1] == null)) {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "An open parenthesis cannot end";
          break;
        } else {
          this.advancedConditionArray[stepId].valid = true;
          this.advancedConditionArray[stepId].validReason = "";
        }
        if (openBrackets !== 0 && closeBrackets == 0) {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "A closing Parentheses is needed";
        } else if (openBrackets == 0 && closeBrackets !== 0) {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "You are missing an opening Parentheses.";
        } else if ((openBrackets !== 0 && closeBrackets !== 0) && openBrackets !== closeBrackets) {
          this.advancedConditionArray[stepId].valid = false;
          this.advancedConditionArray[stepId].validReason = "There are an uneven amount of Parentheses.";
        }
      }
    }
  }
  removeAdvancedCondition(conditionElement: number, condition: number, stepId: number) {
    this.advancedConditionArray[stepId].condition.splice(conditionElement, 1);
    this.advancedConditionValidation(stepId);
    this.parseAdvancedCondition(stepId);
  }

  addCloneCondition(id: number, stepId: number, conditionId: number, leftCondition: string, rightCondition: string) {
    this.rateObject[stepId].conditions[conditionId].condition1 = { name: leftCondition, metadata: (this.getTreeData(leftCondition, 'datatype')), identifier: (this.getTreeData(leftCondition, 'identifier')) };
    this.rateObject[stepId].conditions[conditionId].condition2 = { name: rightCondition, metadata: (this.getTreeData(rightCondition, 'datatype')), identifier: (this.getTreeData(rightCondition, 'identifier')) };

    this.validateCondition(stepId, conditionId);
  }

  validateCondition(stepId: number, conditionId: number) {
    if (this.rateObject[stepId].conditions[conditionId].condition1.metadata !== "" &&
      this.rateObject[stepId].conditions[conditionId].condition2.metadata !== "") {
      this.rateObject[stepId].conditions[conditionId].condition1.metadata.toLowerCase() === this.rateObject[stepId].conditions[conditionId].condition2.metadata.toLowerCase() ? this.rateObject[stepId].conditions[conditionId].isValid = true :
        this.rateObject[stepId].conditions[conditionId].isValid = false;
    }
  }
  removeCondition(stepId: number, conditionId: number) {
    this.rateObject[stepId].conditions.splice(conditionId, 1);
  }

  /**
   * Create form controls dynamically
   */
  createControl(formFields: any) {
    //
    const control = this.formBuilder.control(
      ''
    );
    if (formFields) {
      formFields.forEach(field => {
        this.createRuleForm.addControl(field, control);
      });
    }
    return this.createRuleForm;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }


  /**
   * Get Rule Types
   */
  getRuleTypes() {
    this.apiService.get('getdata/GetRuleType')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          // console.log('Rule Types: ', data.result);
          this.ruleTypes = data.result;
          if (this.ruleTypes) {
            this.paymentRuleShow = this.ruleTypes[0]["hasPaymentType"];
            this.commissionRuleShow = this.ruleTypes[0]["hasCommissionType"];
            this.commissionTriggerRuleShow = this.ruleTypes[0]["hasCommissionRuleTrigger"];
            this.ruleTypeName = this.ruleTypes[0]["ruleCd"];
            this.quarterDropdownShow = this.ruleTypes[0]["frequency"] ? true : false
          }


          if (Object.keys(this.cloneRule).length > 0) {
            let ruleType
            if (this.cloneRule.rule_type_id) {
              ruleType = this.ruleTypes.filter(item => item.ruleTypeId == this.cloneRule.rule_type_id);
            } else if (this.cloneRule.ruleTypeId) {
              ruleType = this.ruleTypes.filter(item => item.ruleTypeId == this.cloneRule.ruleTypeId);
            }
            if (ruleType.length == 0) {

              //ruleType = this.ruleTypes.filter(item => item.ruleTypeId == this.cloneRule.ruleTypeId);
              // console.log('getChildRule', ruleType);
              //this.getChildRuleTypes(ruleType);
              this.getCloneChildRuleType(this.cloneRule.rule_type_id);

            }
            if (ruleType[0]) {
              this.onChangeRuleType(ruleType, 'clone');
              this.paymentRuleShow = ruleType[0]["hasPaymentType"]
              this.commissionRuleShow = ruleType[0]["hasCommissionType"]
              this.commissionTriggerRuleShow = ruleType[0]["hasCommissionRuleTrigger"]
              this.quarterDropdownShow = ruleType[0]["frequency"] ? true : false
              //this.cloneRule.rule_type_id.toString()
            }
          }
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * Get Static MetaData
   */
  getStaticMetaData() {
    this.apiService.get('getdata/getStaticContent')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          this.staticMetaData = data.result;
          data.result.forEach(item => {
            this.allMetadata.push(item.displayName);
          })
        }
        this.restructureStatic();
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  restructureStatic() {
    // this.staticStructure = [{ dataType: 'Numeric', content: [] }, { dataType: 'String', content: [] }, { dataType: 'Date', content: [] }, { dataType: 'Boolean', content: [] }];
    if (!this.staticStructure) {
      this.staticStructure = [{ dataType: 'Numeric', content: [] }, { dataType: 'Text', content: [] }, { dataType: 'Date', content: [] }, { dataType: 'Boolean', content: [] }]; // Dilip 05/27/2020 COM-785
    } else {
      for (var i = 0; i < this.staticStructure.length; i++) {
        this.staticStructure[i].content = [];
      }
    }

    this.staticStructure = this._restructureService.restructureStatic(this.staticStructure, this.staticMetaData);
  }

  /**
   * Get Static MetaData
   */
  getTerritoryMetaData() {
    this.apiService.get('getdata/getTableContent')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          var alphaSorted = data.result.sort(this._restructureService.sortAlphabetical);
          this.allTableContents = alphaSorted;
          alphaSorted.forEach(item => {
            this.allMetadata.push(item.displayName);
          })
          this.tableContentData = this.splitArrayToCollections(alphaSorted);
          Object.keys(this.tableContentData).forEach(x => {
            this.tableContentData[x] = this.tableContentData[x].sort(this._restructureService.sortAlphabetical);
          });
          this.getBaseFormulas();
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * Get Base formulas
   */
  getBaseFormulas() {
    this.apiService.get('getdata/GetBaseFormula')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          var alphaSorted = data.result.sort(this._restructureService.sortAlphabetical);
          this.baseFormulasData = alphaSorted;
          alphaSorted.forEach(item => {
            this.allMetadata.push(item.displayName);
          })
          this.getAggregates();
        }

      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * Get Aggregates formulas
   */
  getAggregates() {
    this.apiService.get('getdata/GetAggregates')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          var alphaSorted = data.result;
          Object.keys(alphaSorted).forEach(x => {
            alphaSorted[x].content = alphaSorted[x].content.sort(this._restructureService.sortAlphabetical);
          });
          this.aggregateStructure = alphaSorted;
          alphaSorted.forEach(item => {
            item.content.map(a => {
              this.allMetadata.push(a.displayName);
            })
          })
          this.getRatesAndExceptions();
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * Get Rates and Exceptions
   */
  getRatesAndExceptions() {
    this.apiService.get('getdata/GetRatesAndExceptions')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          
          var alphaSorted = data.result;
          Object.keys(alphaSorted).forEach(x => {
            alphaSorted[x].content = alphaSorted[x].content.sort(this._restructureService.sortAlphabetical);
          });
          this.rateAndExceptionStructure = alphaSorted;
          alphaSorted.forEach(item => {
            item.content.map(a => {
              this.allMetadata.push(a.displayName);
            })
          })
          this.getPrompts();
        }

      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  /**
   * Get Prompt Metadata
   */
  getPrompts() {
    this.apiService.get('getdata/GetPrompts')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          var alphaSorted = data.result;
          Object.keys(alphaSorted).forEach(x => {
            alphaSorted[x].content = alphaSorted[x].content.sort(this._restructureService.sortAlphabetical);
          });
          this.promptStructure = alphaSorted;
          alphaSorted.forEach(item => {
            item.content.map(a => {
              this.allMetadata.push(a.displayName);
            })
          })
          this.loadTreeCss()
          this.prePopulateRuleData();
        }
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  addArithmeticToAction(operator: string, stepId: number): void {
    this._snackBar.dismiss();
    // if (this.rateObject[stepId].actionDisplay.length == 1) {
    //   this.rateObject[stepId].actionDisplay[0] = operator;
    // } else {
    this.rateObject[stepId].actionDisplay.push(operator);

    // }
    this.rateObject[stepId].action.push({ id: (this.rateObject[stepId].action[0].action == "" ? 0 : this.rateObject[stepId].action.length), action: operator, identifier: operator })
    this.validateAction(stepId);
  }

  addStepName(stepId: number) {
    this.rateObject[stepId].conditionName = ((<HTMLInputElement>document.getElementById(`step_name_${stepId}`)).value).trim();
  }

  addToAction(stepId: number) {
    this._snackBar.dismiss();
    const currentActionItem: string = ((<HTMLInputElement>document.getElementById(`actionbox_${stepId}`)).value).trim();
    const dataType: string = this.getTreeData(currentActionItem, 'metadata');
    //console.log("Action Item", currentActionItem);
    if (dataType.toLowerCase() != 'numeric' && dataType.toLowerCase() != 'numeric_action' && dataType.toLowerCase() != 'int' && dataType.toLowerCase() != 'integer' && dataType.toLowerCase() != 'money' && dataType.toLowerCase() != 'number' && dataType.toLowerCase() != 'table content') {
      this.validInput = false
      this.toastMsg.warning('Only Numerics and Operators allowed', 'Please drag valid data');
      (<HTMLInputElement>document.getElementById(`actionbox_${stepId}`)).value = '';
      return false
    } else {
      this.validInput = true
      if (this.rateObject[stepId].actionDisplay.length == 1) {
        this.rateObject[stepId].actionDisplay[0] = currentActionItem;
      } else {
        this.rateObject[stepId].actionDisplay.push(currentActionItem);
      }
      this.rateObject[stepId].action.push({ id: (this.rateObject[stepId].action[0].action == "" ? 0 : this.rateObject[stepId].action.length), action: currentActionItem, identifier: this.getTreeData(currentActionItem, 'identifier') });
      (<HTMLInputElement>document.getElementById(`actionbox_${stepId}`)).value = '';
      this.validateAction(stepId);
    }
    // const currentActionItem: string = ((<HTMLInputElement>document.getElementById(`actionbox_${stepId}`)).value).trim();
  }

  getTreeData(name: string, retrieveType: string): string {
    let retrievedInfo: string = '';
    let data: { identifier: string, displayName: string, dataType: string } = { identifier: '', displayName: '', dataType: '' };
    if (this.baseFormulasData.some(e => e.displayName === name)) {
      const data: { identifier: string, displayName: string, dataType: string } = this.baseFormulasData.find(e => e.displayName === name);
      retrievedInfo = (retrieveType.toLowerCase() === 'identifier' ? data.identifier : data.dataType);
    } else if (this.aggregateStructure.some(e => e.content.some(b => b.displayName === name))) {
      for (let i: number = 0; i < this.aggregateStructure.length; i++) {
        let currentRow = this.aggregateStructure[i].content;
        for (let j: number = 0; j < currentRow.length; j++) { if (currentRow[j].displayName === name) { data = currentRow[j] }; }
      }
      retrievedInfo = (retrieveType.toLowerCase() === 'identifier' ? data.identifier : data.dataType);
    } else if (this.rateAndExceptionStructure.some(e => e.content.some(b => b.displayName === name))) {
      for (let i: number = 0; i < this.rateAndExceptionStructure.length; i++) {
        let currentRow = this.rateAndExceptionStructure[i].content;
        for (let j: number = 0; j < currentRow.length; j++) { if (currentRow[j].displayName === name) { data = currentRow[j] }; }
      }
      retrievedInfo = (retrieveType.toLowerCase() === 'identifier' ? data.identifier : data.dataType);
    } else if (this.staticMetaData.some(e => e.displayName === name)) {
      const data: { identifier: string, displayName: string, dataType: string } = this.staticMetaData.find(e => e.displayName === name);
      retrievedInfo = (retrieveType.toLowerCase() === 'identifier' ? data.identifier : data.dataType);
    } else if (this.allTableContents.some(e => e.displayName === name)) {
      const data: { identifier: string, displayName: string, dataType: string } = this.allTableContents.find(e => e.displayName === name);
      retrievedInfo = (retrieveType.toLowerCase() === 'identifier' ? data.identifier : data.dataType);
    } else if (this.searchBooleans(name)) {
      const data: { identifier: string, displayName: string, dataType: string } = this.retrieveBooleans(name);
      retrievedInfo = (retrieveType.toLowerCase() === 'identifier' ? data.identifier : data.dataType);
    } else if (this.promptStructure.some(e => e.content.some(b => b.displayName === name))) {
      for (let i: number = 0; i < this.promptStructure.length; i++) {
        let currentRow = this.promptStructure[i].content;
        for (let j: number = 0; j < currentRow.length; j++) { if (currentRow[j].displayName === name) { data = currentRow[j] }; }
      }
      retrievedInfo = (retrieveType.toLowerCase() === 'identifier' ? data.identifier : data.dataType);
    } else {
    }
    return retrievedInfo;
  }

  searchBooleans(name: string): boolean {
    for (let i =0; i < this.booleansData.length; i++) {
      for (let j=0; j < this.booleansData[i].content.length; j++) {
        if (this.booleansData[i].content[j].displayName === name) return true;
      }
    }
    return false;
  }

  retrieveBooleans(name: string): {identifier: string, displayName: string, dataType: string} {
    let foundValues:{identifier: string, displayName: string, dataType: string} = {identifier: "", displayName: "", dataType: ""};
    for (let i =0; i < this.booleansData.length; i++) {
      for (let j=0; j < this.booleansData[i].content.length; j++) {
        if (this.booleansData[i].content[j].displayName === name) {
          foundValues = {identifier : this.booleansData[i].content[j].identifier,
          displayName : name, dataType : this.booleansData[i].content[j].dataType};
          return foundValues;
        }
      }
    }
    return foundValues;
  }

  getPaymentDueDateMappings() {
    this.apiService.get('GetData/PaymentDueDateMappings')
      .subscribe(data => {
        if (data && data.statusCode === "201" && data.result) {
          this.paymentDueDateMappings = data.result.map(x => { return <IPaymentDueDateMapping>x });
          // console.log("Payment Due Date Mappings", this.paymentDueDateMappings);
        }
      }, err => {
        this.toastMsg.error(err, "Server Error!");
      })
  }

  searchForItem(): void {
    this.searchedItem = [];
    let name: string = (<HTMLInputElement>document.getElementById('searchItem')).value;
    if (name == '') {
      this.searchedItem = [];
    } else {
      this.searchedItem = this.allMetadata.filter(option => option.toLowerCase().includes(name));
    }
  }

  addNewCondition(stepId: number, conditionId: number) {
    this.rateObject[stepId].conditions.push({ id: (this.rateObject[stepId].conditions.length + 1), condition1: { name: "", metadata: "", identifier: "" }, operator: "Less Than", condition2: { name: "", metadata: "", identifier: "" }, isValid: false });
  }

  addNewStep() {
    let stepId: number = this.rateObject.length;
    this.rateObject.push({
      id: (stepId + 1), step: (stepId + 1), conditionName: "", conditions: [{ id: 1, condition1: { name: "", metadata: "", identifier: "" }, operator: "Less than", condition2: { name: "", metadata: "", identifier: "" }, isValid: false }],
      conditionQualifier: "", advanceCondition: "", action: [{ id: 1, action: "", identifier: "" }], validAction: false, invalidReasoning: "Action cannot be empty", roundInd: false, roundDepth: null, actionDisplay: [""]
    });
    this.advancedConditionArray.push({ valid: false, validReason: "Condition field is empty", visable: false, firstItem: true, conditionString: "", condition: [""] });
  }

  removeAction(conditionId: number, stepId: number): void {
    if (this.rateObject[stepId].action.length <= 1) {
      this.rateObject[stepId].action.push({ id: 0, action: "", identifier: "" });
    }
    this.rateObject[stepId].actionDisplay.splice(conditionId, 1);
    this.rateObject[stepId].action.splice(conditionId, 1);
    if (this.rateObject[stepId].action[0].action !== "") {
      this.validateAction(stepId);
    } else {
      this.rateObject[stepId].validAction = false;
      this.rateObject[stepId].invalidReasoning = "Action cannot be empty";
    }
  }

  validateAction(stepId: number): void {
    this.rateObject = this._validateActionService.validateAction(this.rateObject, stepId);
  }
  /**
   * Get Base formulas
   */
  getBooleans() {
    this.apiService.get('getdata/GetBooleans')
      .subscribe(data => {
        if (data["statusCode"] === "201" && data.result) {
          
          var alphaSorted = data.result.sort(this._restructureService.sortAlphabetical);
          this.booleansData = alphaSorted;
          alphaSorted.forEach(item => {
            item.content.map(a => {
              this.allMetadata.push(a.displayName);
            })
          })
        }

      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!')
      });
  }

  loadTreeCss() {
    setTimeout(() => {
      $.fn.extend({
        treed: function (o) {

          var openedClass = 'fa-minus-square';
          var closedClass = 'fa-plus-square';

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
          tree.addClass("tree");
          tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator far " + closedClass + "'></i>");
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
      $('#tree1').treed();
      $('.base_formula_li').css('display', 'none')
      //$('[data-toggle="tooltip"]').tooltip();
    }, 200);
  }

  splitArrayToCollections(arrayData) {
    return arrayData.reduce(function (obj, value) {
      let key = value.tableName;
      if (obj[key] == null) obj[key] = [];

      obj[key].push(value);
      return obj;
    }, {});

  }

  jsonToArray(json) {
    let result = [];
    let jsonObjs;
    let keys = Object.keys(json);
    keys.forEach(function (key) {
      jsonObjs["name"] = key
      jsonObjs["data"] = json[key]
      result.push = jsonObjs
    });
    //result.push(jsonObjs)
    return result;
  }

  /**
   * Create Rule post request
   */

  validateForm(): boolean {
    let isValid: boolean = true;
    for (let i: number = 0; i < this.rateObject.length; i++) {
      if (this.rateObject[i].conditionName == '') {
        this.toastMsg.warning('Please enter a Step Name');
        isValid = false;
      }
      else if (this.rateObject[i].validAction == false) {
        this.toastMsg.warning('Please provide a valid action');
        isValid = false;
      }
      for (let j: number = 0; j < this.rateObject[i].conditions.length; j++) {
        let conditions = this.rateObject[i].conditions[j];
        if (conditions.isValid == false) {
          this.toastMsg.warning('Please provide valid conditions');
          isValid = false;
        }
      }
    }
    if (this.createRuleForm.controls.rule_name.value == '') {
      this.toastMsg.warning('Please provide a valid rule name');
      isValid = false;
    }
    else if (this.createRuleForm.controls.Description.value == '') {
      this.toastMsg.warning('Please provide a valid description name');
      isValid = false;
    }
    if (this.conditionalCriteria == false) {
      this.toastMsg.warning('Please select your conditional criteria.');

      isValid = false
    };
    return isValid;
  }

  lastday(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  toggleReclaim() {
    this.reclaim = !this.reclaim;
    this.reclaim ? this.createRuleForm.controls.noReclaim.setValue(true)
      : this.createRuleForm.controls.noReclaim.setValue(false);

    console.log(this.createRuleForm.controls.noReclaim.value);
  }

  onSubmit() {
    if (this.validateForm()) {

      if (this.createRuleForm.invalid) {
        return;
      }
      this.invalidRule = false
      let createRulePayload = {};
      let steps = [];
      let actionVal = "";
      let validateConditions: boolean = true;
      for (let i = 0; i < this.rateObject.length; i++) {
        let step_name = this.rateObject[i].conditionName;
        let actionVal: string = '';
        for (let j: number = 0; j < this.rateObject[i].action.length; j++) {
          actionVal = actionVal + this.rateObject[i].action[j].action;
        }
        let criteria: string = this.rateObject[i].conditionQualifier;

        let step = {
          step_name: step_name,
          action: actionVal,
          criteria: (this.rateObject[i].conditionQualifier.toLowerCase() == 'all conditions should meet' ? '1'
            : (this.rateObject[i].conditionQualifier.toLowerCase() == 'one or more conditions should meet' ? '2'
              // : (this.rateObject[i].conditionQualifier.toLowerCase() == 'always true' ? '1' : this.rateObject[i].advanceCondition))),
              // Dilip 06/23/2020 COM-981
              : (this.rateObject[i].conditionQualifier.toLowerCase() == 'always true' ? '4' : this.rateObject[i].advanceCondition))),
          conditions: [],
          roundDepth: this.rateObject[i].roundInd ? this.rateObject[i].roundDepth : null
        }

        let conditions = [];
        for (let j: number = 0; j < this.rateObject[i].conditions.length; j++) {
          if (this.rateObject[i].conditions[j].isValid == true) {
            let operator: string = '';
            switch (this.rateObject[i].conditions[j].operator.toLowerCase()) {
              case 'less than':
                operator = '<';
                break;
              case 'greater than':
                operator = '>';
                break;
              case 'less than or equal':
                operator = "<=";
                break;
              case 'greater than or equal':
                operator = ">=";
                break;
              case 'equal':
                operator = '=';
                break;
              default:
                operator = ">";
                break;
            }
            let cond = {
              right_side: this.rateObject[i].conditions[j].condition2.name,
              left_side: this.rateObject[i].conditions[j].condition1.name,
              operators: operator
            }
            step.conditions.push(cond);
          }
        }
        steps.push(step);
      }

      if (!validateConditions) {
        return false
      }
      let payment_types_data = "", commission_types_data = "", trigger_types_data = "";
      let rule_type_id;
      let parent_ruletype_id;
      let apiUrl = "Rule"
      if (this.pageType != 'baseformula') {
        let childs_rule_types = $('#mySelect option:selected').attr('child_data')

        if (childs_rule_types == 'true') {
          rule_type_id = $('#child_rule_type_id option:selected').val()
          //parent_ruletype_id = this.createRuleForm.controls.rule_type_id.value; //parent_rule_id changes
        } else {
          rule_type_id = this.createRuleForm.controls.rule_type_id.value;
          parent_ruletype_id = 0; //parent_rule_id changes
        }

        payment_types_data = $('#mySelect option:selected').attr('payment_types_data')
        commission_types_data = $('#mySelect option:selected').attr('commission_types_data')
        trigger_types_data = $('#mySelect option:selected').attr('trigger_types_data')
      } else {
        rule_type_id = 0;
        parent_ruletype_id = 0; //parent_rule_id changes
        apiUrl = "BaseFormula"
      }

      if (!this.showBonusIncentive && !this.employeeIncentive || !this.bonusReclaimShow) {
        // this.createRuleForm.controls.noReclaim.setValue(false);
        // this.createRuleForm.controls.prompt_assign_plan.setValue(null);
      }
      // console.log("Quarter Data", this.createRuleForm.controls.startDate.value, this.calandarYearQuarters[this.createRuleForm.controls.startDate.value], this.createRuleForm.controls.endDate.value)
      let startDate = "", endDate = ""
      if (this.quarterDropdownShow && (this.ruleTypeName2 == 'Bonus Incentive Goal' || this.ruleTypeName2 == 'Rate Incentive Goal')) {
        if (!this.createRuleForm.controls.startDate.value) {
          this.toastMsg.error("Please select quarter", 'Error!')
          return;
        } else if (!this.createRuleForm.controls.endDate.value) {
          this.toastMsg.error("Please select year", 'Error!')
          return;
        }
      } else if (this.monthlyDropdownShow && (this.ruleTypeName2 == 'Bonus Incentive Goal' || this.ruleTypeName2 == 'Rate Incentive Goal')) {
        if (!this.createRuleForm.controls.startDate.value) {
          this.toastMsg.error("Please select Month", 'Error!')
          return;
        } else if (!this.createRuleForm.controls.endDate.value) {
          this.toastMsg.error("Please select year", 'Error!')
          return;
        }
      }
      else if (this.dateDropdownShow && (this.ruleTypeName2 == 'Bonus Incentive Goal' || this.ruleTypeName2 == 'Rate Incentive Goal')) {
        
        if (!this.createRuleForm.controls.startDate.value) {
          this.toastMsg.error("Please select Start Date", 'Error!')
          return;
        } else if (!this.createRuleForm.controls.endDate.value) {
          this.toastMsg.error("Please select End Date", 'Error!')
          return;
        }
      }
 
      if (this.quarterDropdownShow && this.createRuleForm.controls.startDate.value && this.createRuleForm.controls.endDate.value) {
        
        let quarterObj = this.calandarYearQuarters.filter(x => x.calandarYearQuarterName === this.createRuleForm.controls.startDate.value);
        
        for (let i = 0; i < quarterObj.length; i++) {
          if (quarterObj[i].calandarYearQuarterName === this.createRuleForm.controls.startDate.value) {
            startDate = this.createRuleForm.controls.endDate.value + '-' + quarterObj[i].quarterStartMonthNumber + '-' + quarterObj[i].quarterStartDateNumber;
            endDate = this.createRuleForm.controls.endDate.value + '-' + quarterObj[i].quarterEndMonthNumber + '-' + quarterObj[i].quarterEndDateNumber;
          }
        }
        
      } else if (this.monthlyDropdownShow) {
        let date = parseInt(this.createRuleForm.controls.startDate.value);
        date = date + 1;
        let lastday = this.lastday(this.createRuleForm.controls.endDate.value, this.createRuleForm.controls.startDate.value);
        let date1 = new Date(this.createRuleForm.controls.endDate.value + '-' + date.toString() + '-' + '1');
        let date2 = new Date(this.createRuleForm.controls.endDate.value + '-' + date.toString() + '-' + lastday.toString());
        let month = date1.getMonth();
        month = month + 1;
        startDate = date1.getFullYear() + '-' + month + '-' + date1.getDate();
        endDate = date2.getFullYear() + '-' + month + '-' + date2.getDate();
        
      } else if (this.dateDropdownShow) {
        startDate = this.createRuleForm.controls.startDate.value;
        endDate = this.createRuleForm.controls.endDate.value;
        
      }
      
      createRulePayload = {
        rule_type_id: rule_type_id,
        parent_ruletype_id: parent_ruletype_id, //parent_rule_id changes
        rule_name: this.createRuleForm.controls.rule_name.value,
        Description: this.createRuleForm.controls.Description.value,
        start_date: startDate,
        end_date: endDate,
        noReclaim: this.createRuleForm.controls.noReclaim.value,
        prompt_assign_plan: this.createRuleForm.controls.prompt_assign_plan.value,
        steps: steps,
        paymentDueDateMappingId: this.createRuleForm.controls.payment_due_date_mapping_id.value,
        createZeroCommission: this.createZeroCommission,
        numberOfBonuses: this.createRuleForm.controls.number_of_bonuses.value
      }
      let payment_type_id = ""
      let commission_type_id = ""
      let trigger_type_id = ""
      if (payment_types_data == 'true')
        createRulePayload["payment_rule_type_id"] = $('#payment_rule_type_id option:selected').val()

      if (commission_types_data == 'true')
        createRulePayload["commission_rule_type_id"] = $('#commission_rule_type_id option:selected').val()

      if (trigger_types_data == 'true')
        createRulePayload["trigger_rule_type_id"] = $('#trigger_rule_type_id option:selected').val()

      let redirectUrl = 'create', formName = "Rule"
      if (this.pageType == 'baseformula') {
        redirectUrl = 'baseformula'
        formName = "Base Formula"
      }
      
      this.apiService.post(apiUrl, createRulePayload)
        .subscribe(data => {
          if (data["statusCode"] === "200" || data["statusCode"] === "201") {
            this.toastMsg.success(formName + " has been created successfully", 'Success!')
            this.removeAllSteps()
            if (this.pageType == 'baseformula') {
              // this.getBaseFormulas()
            }
            setTimeout(() => {
              location.reload()
            }, 1000);
            this.router.navigate(['/ui/commissions/rule/create']);

          } else {
            this.invalidRule = true;
            this.toastMsg.error("Server", 'Error!')
          }
        }, (err: any) => {
          console.log(err);
          this.invalidRule = true;
          this.toastMsg.error(err, 'Error!')
        });
    }
  }

  enableField(stepId: number, criteriaId: number) {
    this.conditionalCriteria = true;
    if (criteriaId === 0) {
      this.advancedConditionArray[stepId].visable = false;
      // (<HTMLInputElement>document.getElementById(`step_${stepId}_criteria_text`)).disabled = true;
      for (let i: number = 0; i < this.rateObject[stepId].conditions.length; i++) {
        this.disableElements(false, stepId, i);
      }
    } else if (criteriaId === 1) {
      // (<HTMLInputElement>document.getElementById(`step_${stepId}_criteria_text`)).disabled = false;
      for (let i: number = 0; i < this.rateObject[stepId].conditions.length; i++) {
        this.disableElements(false, stepId, i);
      }
      this.advancedConditionArray[stepId].visable = true;
    } else if (criteriaId === 2) {
      this.advancedConditionArray[stepId].visable = false;
      for (let i: number = 0; i < this.rateObject[stepId].conditions.length; i++) {
        let currentCondition = this.rateObject[stepId].conditions[i];
        currentCondition.condition1 = { name: '1', metadata: 'numeric', identifier: '1' };
        currentCondition.condition2 = { name: '1', metadata: 'numeric', identifier: '1' };
        currentCondition.isValid = true;
        currentCondition.operator = 'Equal';
        this.disableElements(true, stepId, i);
      }
    }
  }
  disableElements(disable: boolean, stepId: number, conditionId: number): void {
    if (document.getElementById(`step_condition_right_${stepId}_${conditionId}`) != null) {
      (<HTMLInputElement>document.getElementById(`step_condition_right_${stepId}_${conditionId}`)).disabled = disable;
    }
    if (document.getElementById(`step_condition_left_${stepId}_${conditionId}`) != null) {
      (<HTMLInputElement>document.getElementById(`step_condition_left_${stepId}_${conditionId}`)).disabled = disable;
    }
    if (document.getElementById(`add_condition_${stepId}_${conditionId}`) != null) {
      (<HTMLInputElement>document.getElementById(`add_condition_${stepId}`)).disabled = disable;
    }
    if (document.getElementById(`step_${stepId}_operator_${conditionId}`) != null) {
      (<HTMLInputElement>document.getElementById(`step_${stepId}_operator_${conditionId}`)).disabled = disable;
    }
  }

  addAdvancedCondition(stepId: number) {
    this.rateObject[stepId].advanceCondition = ((<HTMLInputElement>document.getElementById(`step_${stepId}_criteria_text`)).value).trim();
  }

  /**
   * Validate conditions
   */
  validateConditions(left, right) {
    if (left.attr('dataType').toLowerCase() === right.attr('dataType').toLowerCase()) {
      return true
    } else {
      this.toastMsg.error('Invalid condition. Condition both side data types should be same', 'Error!')
      return false
    }
  }

  removeStep(stepId: number) {
    if (this.rateObject.length > 1) {
      this.rateObject.splice(stepId, 1);
    }
  }

  removeAllSteps() {

    this.rateObject = [{
      id: 1, step: 1, conditionName: "", conditions: [{ id: 1, condition1: { name: "", metadata: "", identifier: "" }, operator: "Less than", condition2: { name: "", metadata: "", identifier: "" }, isValid: false }],
      conditionQualifier: "", advanceCondition: "", action: [{ id: 1, action: "", identifier: "" }], validAction: false, invalidReasoning: "Action cannot be empty", roundInd: false, roundDepth: null, actionDisplay: [""]
    }];
  }

  removeTableTr(tr) {
    while ((tr.nodeName.toLowerCase()) != 'tr')
      tr = tr.parentNode;

    tr.parentNode.removeChild(tr);
  }

  resetForm() {
    this.removeAllSteps()
    this.initializeFormGroup();
  }

  /**
   * Initialize form group
   */
  initializeFormGroup() {
    var pattern;
    if (this.activeCreationType == "Base Formula") {
      // pattern = new RegExp('^[ a-zA-z0-9_.:\'@]*$');
      pattern = new RegExp('^[a-zA-Z0-9 _.:@]*(?![+\\-/%()])$');
    } else {
      pattern = new RegExp('^[ a-zA-z0-9-_.:/\'%()]*$()');
    }

    console.log(pattern);

    this.createRuleForm = this.formBuilder.group({
      // rule_name: ['', Validators.compose([Validators.required, Validators.pattern('^[ a-zA-Z0-9@_.:\']*$()')])],
      // rule_name: ['', Validators.compose([Validators.required, Validators.pattern('^[ a-zA-Z0-9@_.:/\'%]*$()')])],   // Dilip 05/28/2020 COM-871
      rule_name: ['', Validators.compose([Validators.required, Validators.pattern(pattern)])],
      Description: ['', [Validators.required, Validators.maxLength(200)]],
      rule_type_id: [this.defaultRultType, [Validators.required]],
      //bonus_incentive_frequency: [''],
      step_name_1: [''],
      step_name_2: [''],
      step_1_condition_left_1: [''],
      step_1_operator_1: ['<'],
      step_1_condition_right_1: [''],
      step_1_criteria: [''],
      step_1_criteria_text: [{ value: null, disabled: this.isDisabled }],
      step_1_action: [''],
      step_2_condition_left_1: [''],
      step_2_operator_1: [''],
      step_2_condition_right_1: [''],
      step_2_criteria: [''],
      step_2_criteria_text: [{ value: null, disabled: this.isDisabled }],
      step_2_action: [''],
      activeCreationType: [this.activeCreationType],
      payment_book_type: [''],
      weekly_pay: [''],
      overdraw_limit: [''],
      startDate: [this.startDate],
      endDate: [this.endDate],
      noReclaim: [false],
      effective_start_end_date_ind: [true],
      prompt_assign_plan: [true],
      payment_due_date_mapping_id: [''],
      number_of_bonuses: [null]
    });

    if (this.activeCreationType == "Base Formula") {
      this.createRuleForm.controls.rule_name.setValidators([Validators.required, Validators.pattern(pattern), baseFormulaFirstCharacter()])
      this.createRuleForm.controls.rule_name.setValue("@");
    }

    //Remove first step background css
    $('input[name="step_1_condition_left_1"]').css("background-color", "")
    $('input[name="step_1_condition_right_1"]').css("background-color", "")
    $('textarea[name="step_1_action"]').css("background-color", "")
    $('#step_1_condition_validate_1').html("Validate")
  }

  onStaticDataTrigger() {
    this.getStaticMetaData()
  }

  onGoBack() {
    if (confirm("Your unsaved progress will be deleted, do you wish to continue?")) {
      if (this.clone == true) {
        let href = localStorage.getItem('href').split('/#');
        this.router.navigate([href[1]]);
      } else {
        this.apiService.goBack();
      }
    } else
      return false

  }

  parseAction(actionString: string, stepId: number) {
    let arithmetic: string[] = actionString.split(/([-+*/)(])/);

    for (let i: number = 0; i < arithmetic.length; i++) {
      let currentActionItem: string = arithmetic[i];
      this.rateObject[stepId].actionDisplay.push(currentActionItem);
      if (currentActionItem == '(' || currentActionItem == ')' || currentActionItem == '%' || currentActionItem == '/' || currentActionItem == '*' || currentActionItem == '-' || currentActionItem == '+') {
        this.rateObject[stepId].action.push({ id: (this.rateObject[stepId].action[0].action == "" ? 0 : this.rateObject[stepId].action.length), action: currentActionItem, identifier: currentActionItem });
      } else {
        this.rateObject[stepId].action.push({ id: (this.rateObject[stepId].action[0].action == "" ? 0 : this.rateObject[stepId].action.length), action: currentActionItem, identifier: this.getTreeData(currentActionItem, 'identifier') });
      }
      //(<HTMLInputElement>document.getElementById(`actionbox_${stepId}`)).value = '';
      this.validateAction(stepId);
    }
  }

  prePopulateRuleData() {
    this.quarterDropdownShow = false;
    this.monthlyDropdownShow = false;
    this.dateDropdownShow = false;
    // console.log("Clone Rule", this.cloneRule);
    if (Object.keys(this.cloneRule).length > 0) {
      this.createRuleForm.patchValue({
        rule_name: this.cloneRule.rule_name ? this.cloneRule.rule_name : this.cloneRule.ruleName,
        Description: this.cloneRule.description,
      });
      if (this.cloneRule.steps) {
        for (let i: number = 0; i < this.cloneRule.steps.length; i++) {
          if (i !== 0) {
            this.addNewStep();
          }
          let currentStep = this.cloneRule.steps[i];
          this.rateObject[i].conditionName = currentStep.step_name;
          switch (currentStep.criteria) {
            case ('1'):
              this.rateObject[i].conditionQualifier = 'All conditions should meet';
              this.conditionalCriteria = true;
              break;
            case ('2'):
              this.rateObject[i].conditionQualifier = 'One or more conditions should meet';
              this.conditionalCriteria = true;
              break;
            case ('4'): // Dilip 06/23/2020 COM-981
              this.rateObject[i].conditionQualifier = 'Always true';
              break;
            default:
              break;
          }

          this.parseAction(currentStep.action, i);
          if (currentStep.roundDepth !== null && currentStep.roundDepth !== undefined) {
            this.rateObject[i].roundInd = true;
            this.rateObject[i].roundDepth = currentStep.roundDepth;
          }
          for (let j: number = 0; j < currentStep.conditions.length; j++) {
            let currentCondition = currentStep.conditions[j];
            if (j !== 0) {
              this.addNewCondition(i, j)
            }
            let operator = currentCondition.operators;
            switch (operator) {
              case ('<'):
                this.rateObject[i].conditions[j].operator = 'Less than';
                break;
              case ('>'):
                this.rateObject[i].conditions[j].operator = 'Greater than';
                break;
              case ('<='):
                this.rateObject[i].conditions[j].operator = 'Less than or equal';
                break;
              case ('>='):
                this.rateObject[i].conditions[j].operator = 'Greater than or equal';
                break;
              case ('='):
                this.rateObject[i].conditions[j].operator = 'Equal';
                break;
            }
            this.addCloneCondition(1, i, j, currentCondition.left_side, currentCondition.right_side);
          }
          if (currentStep.criteria != "1" && currentStep.criteria != "2" && currentStep.criteria != "4" && currentStep.criteria != "") {
            let criteria = currentStep.criteria;
            let max: number = 0;
            while (criteria != "") {
              max++
              criteria = criteria.trimStart();
              if (criteria.startsWith("(")) {
                this.addAdvancedConditionOption("(", i, 1);
                criteria = criteria.replace("(", "");
                continue;
              }
              if (criteria.startsWith(")")) {
                this.addAdvancedConditionOption(")", i, 1);
                criteria = criteria.replace(")", "");
                continue;
              }
              if (criteria.startsWith("AND")) {
                this.addAdvancedConditionOption("AND", i, 1);
                criteria = criteria.replace("AND", "");
                continue;
              }
              if (criteria.startsWith("OR")) {
                this.addAdvancedConditionOption("OR", i, 1);
                criteria = criteria.replace("OR", "");
                continue;
              }
              for (let j: number = currentStep.conditions.length; j >= 0; j--) {
                if (criteria.startsWith(j + "")) {
                  this.addAdvancedConditionOption(j - 1, i, 0);
                  criteria = criteria.replace(j + "", "");
                  break;
                }
              }
              if (max == 500) {
                // avoid browser crash
                break;
              }
            }
            this.rateObject[i].conditionQualifier = 'Advanced';
            this.enableField(i, 1)
          }
        }
      } else if (this.cloneRule.basePayStructures) {

      }
      if (this.cloneRule.rule_type_id > 0 && !(this.cloneRule.parent_ruletype_id > 0)) {
        this.ruleTypeName = this.ruleTypes.find(x => x.ruleTypeId == this.cloneRule.rule_type_id).ruleCd;
      } else if (this.cloneRule.rule_type_id > 0 && this.cloneRule.parent_ruletype_id > 0) {
        this.getCloneChildRuleType(this.cloneRule.parent_ruletype_id);
      }
      if (this.cloneRule.parent_ruletype_id > 0) {
        //this.createRuleForm.patchValue({child_rule_type_id: this.cloneRule.parent_ruletype_id.toString()})
        this.showChildRuleTypes = true
      } else {
        this.showChildRuleTypes = false
      }
      if (this.cloneRule.commission_rule_type_id > 0) {
        //this.createRuleForm.patchValue({commission_rule_type_id: this.cloneRule.commission_rule_type_id})
        this.commissionRuleShow = true
        $('#commission_rule_type_id').val(this.cloneRule.commission_rule_type_id.toString())
      } else {
        this.commissionRuleShow = false
      }
      if (this.cloneRule.payment_rule_type_id > 0) {
        //this.createRuleForm.patchValue({payment_rule_type_id: this.cloneRule.payment_rule_type_id})
        this.paymentRuleShow = true
        $('#payment_rule_type_id').val(this.cloneRule.payment_rule_type_id.toString())
      } else {
        this.paymentRuleShow = false
      }
      if (this.cloneRule.trigger_rule_type_id > 0) {
        //this.createRuleForm.patchValue({trigger_rule_type_id: this.cloneRule.trigger_rule_type_id})
        this.commissionTriggerRuleShow = true
        $('#trigger_rule_type_id').val(this.cloneRule.trigger_rule_type_id.toString())
      } else {
        this.commissionTriggerRuleShow = false
      }
      if (this.cloneRule.paymentDueDateMappingId > 0) {
        this.createRuleForm.patchValue({ payment_due_date_mapping_id: this.cloneRule.paymentDueDateMappingId.toString() })
        //this.showChildRuleTypes = true
      }

      if (this.cloneRule.noReclaim) {
        this.createRuleForm.patchValue({ noReclaim: this.cloneRule.noReclaim });
        this.reclaim = this.cloneRule.noReclaim;
      }
      
      if (this.childRuleTypes) {
        let item = this.childRuleTypes.filter(row => row.ruleCd == this.cloneRule.rule_type_name);
       
        if (item[0].frequency == "Quarterly") {
          this.quarterDropdownShow = true;
          this.monthlyDropdownShow = false;
          this.dateDropdownShow = false;
          this.getCalandarYearQuarters('clone');
        }
        else if (item[0].frequency == "Monthly") {
          this.quarterDropdownShow = false;
          this.monthlyDropdownShow = true;
          this.dateDropdownShow = false;
          if (this.cloneRule.start_date) {
            this.createRuleForm.patchValue({ startDate: new Date(this.cloneRule.start_date).getMonth() })
          }
          if (this.cloneRule.end_date) {
            this.createRuleForm.patchValue({ endDate: new Date(this.cloneRule.end_date).getFullYear() })
          }
        } else if (item[0].frequency == "Date") {
          this.quarterDropdownShow = false;
          this.monthlyDropdownShow = false;
          this.dateDropdownShow = true;
          if (this.cloneRule.start_date) {
            this.createRuleForm.patchValue({ startDate: this.apiService.dateFormat(this.cloneRule.start_date.toString(), 'yyyy-MM-dd') });
          }
          if (this.cloneRule.end_date) {
            this.createRuleForm.patchValue({ endDate: this.apiService.dateFormat(this.cloneRule.end_date.toString(), 'yyyy-MM-dd') });
          }
        }
      } else {
        let item = this.ruleTypes.filter(row => row.ruleCd == this.cloneRule.rule_type_name);
        if (item && item.length > 0 && item[0].frequency == "Date") {
          this.quarterDropdownShow = false;
          this.monthlyDropdownShow = false;
          this.dateDropdownShow = true;
          if (this.cloneRule.start_date) {
            this.createRuleForm.patchValue({ startDate: this.apiService.dateFormat(this.cloneRule.start_date.toString(), 'yyyy-MM-dd') });
          }
          if (this.cloneRule.end_date) {
            this.createRuleForm.patchValue({ endDate: this.apiService.dateFormat(this.cloneRule.end_date.toString(), 'yyyy-MM-dd') });
          }
        }
      }

      if (this.cloneRule.rule_type_id > 0 && !(this.cloneRule.parent_ruletype_id > 0)) {
        //this.createRuleForm.patchValue({rule_type_id: this.cloneRule.rule_type_id.toString()});
        $('#rule_type_id').val(this.cloneRule.rule_type_id.toString());
      } else if (this.cloneRule.rule_type_id > 0 && this.cloneRule.parent_ruletype_id > 0) {
        //console.log("Rule IDS",this.cloneRule.rule_type_id, this.cloneRule.parent_ruletype_id )
        //this.createRuleForm.patchValue({child_rule_type_id: this.cloneRule.rule_type_id.toString()});
        this.createRuleForm.patchValue({ rule_type_id: this.cloneRule.parent_ruletype_id.toString() });
        // $('#child_rule_type_id').val("15")
        //$('#rule_type_id').val(this.cloneRule.parent_ruletype_id.toString())
      }
      $('#child_rule_type_id').val(this.cloneRule.rule_type_id)
      // console.log(this.cloneRule);
      this.changeDetectorRef.detectChanges();
    }
  }

  getPromptAssignVal(val: any) {
    if (val == 'normal') {
      this.quarterDropdownShow = false;
    } else if (val == 'quarter') {
      this.quarterDropdownShow = true;
    }
  }

  openCreateStatic(): void {
    let dialogRef = this.dialog.open(CreateStaticComponent, {
      width: '50%',
      height: '50%'
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.getStaticMetaData();
      }, 3000)
    })
  }
}
