import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit,SimpleChanges, ViewChildren, QueryList } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from "ngx-toastr";
import { IPaymentType } from 'src/app/model/payment-type.model';
import { StageComponent } from './stage/stage.component';
import { Router, ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef } from '@angular/core';
declare var $: any;

@Component({
  selector: ".app-basepay-structure",
  templateUrl: "./basepay-structure.component.html",
  styleUrls: ["./basepay-structure.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class BasepayStructureComponent implements OnInit, AfterViewInit {
  @ViewChildren(StageComponent) stageComponents !: QueryList<StageComponent>;
  @Input() showBasePayStructure: boolean;
  @Input() cloneRule: any = {};
  
  paymentTypes: IPaymentType[];
  numberOfStages: number = 1;
  errors: boolean = false;
  disabled: boolean = false;

  constructor(private apiService: ApiService, private toastMsg: ToastrService, private router: Router,
    private cdref: ChangeDetectorRef) {
    this.apiService.hideLoader = true;
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cloneRule&&Object.keys(changes.cloneRule).length > 0) {
      this.prePopulateRuleData();
    }
  }

  ngAfterViewInit() {

    if (this.stageComponents && this.stageComponents.length > 0 && (<any>this.stageComponents)._results && (<any>this.stageComponents)._results.length > 0) {
      this.disabled = (<any>this.stageComponents)._results[0].disabled;
    }
    (<any>this.stageComponents).changes.subscribe(change => {
      this.getBasePayStructures();
    })

    this.getBasePayStructures();
  }

  getBasePayStructures() {
    setTimeout(() => {
      //this.basePayStructures = this.stageComponents.map(p => p.basePayStructure);
    }, 1000);
  }

  submitBasePayStructure() {
    this.getBasePayStructures();

    if ($("input[name='rule_name']").val().trim() == "") {
      this.toastMsg.error("Please enter a rule name", "Error");
      return;
    }
    if ($("input[name='Description']").val().trim() == "") {
      this.toastMsg.error("Please enter a rule description", "Error");
      return;
    }
    if ($("select[name='rule_type_id']").val().trim() == "") {
      this.toastMsg.error("Please select a rule type", "Error");
      return;
    }

    let formBasePayStructures = [];

    this.errors = false;



    

    if (this.errors) return;

    let formData = {
      ruleTypeId: $("select[name='rule_type_id']").val(),
      ruleName: $("input[name='rule_name']").val(),
      description: $("input[name='Description']").val(),
      numberOfStages: this.numberOfStages,
      //promptAssignPlan: this.basePayStructure.promptAssignPlan,
      basePayStructures: formBasePayStructures
    };
    this.cdref.detectChanges();


    this.apiService.post("BasePayStructures", formData).subscribe(
      data => {
        if (data["statusCode"] === "200" || data["statusCode"] === "201") {
          this.toastMsg.success(
            "Base pay structure has been created successfully",
            "Success!"
          );
          setTimeout(() => {
            location.reload()
          }, 1000);
          this.router.navigate(['/ui/commissions/rule/create']);
         
        } else {
          this.toastMsg.error("Server", "Error!");
        }
      },
      (err: any) => {
        this.toastMsg.error(err, "Error!");
      }
    );
  }

  forLoop(n: number) {
    let arr = [];

    for (let i = 0; i < n; i++) {
      arr.push(i + 1);
    }

    return arr;
  }

  /**
   * Pre-populate clone data
   */
  prePopulateRuleData() {
    if (Object.keys(this.cloneRule).length > 0) {
      this.numberOfStages = this.cloneRule.numberOfStages;
      this.cdref.detectChanges();
    }
  }


  onGoBack() {
    if (confirm("Your unsaved progress will be deleted, do you wish to continue?")) {
      this.router.navigate(['/ui/commissions'])
    } else
      return false

  }

  resetForm() {
    $("input[name='rule_name']").val(""),
      $("input[name='Description']").val("")
    this.numberOfStages = 1

  }

}
