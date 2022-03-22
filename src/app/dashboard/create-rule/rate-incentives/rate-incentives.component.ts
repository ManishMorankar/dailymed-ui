import { Component, OnInit,Input ,ElementRef } from '@angular/core';
import {ApiService} from "../../../services/api.service";

@Component({
  selector: '.app-rate-incentives',
  templateUrl: './rate-incentives.component.html',
  styleUrls: ['./rate-incentives.component.css']
})
export class RateIncentivesComponent implements OnInit {
@Input() showRateIncentive : boolean;
hElement: HTMLElement;
count: number = 2;
constructor(private elementRef:ElementRef,private apiService: ApiService) {
  this.apiService.hideLoader = true;
  this.hElement = this.elementRef.nativeElement;
}

  ngOnInit() {
  }

  addStep(){
    this.count++;
    let inc = this.count;
    let dom = this.hElement.querySelector('.tbl tbody');
    dom.insertAdjacentHTML('beforeend', '<tr><td><div class="row"><div class="col-md-6 border-right"><form><fieldset><legend>Step '+inc+' : Enter Step Name</legend><h6>Conditions</h6><table id="inputbox_table_'+inc+'" class="table inputbox_table_'+inc+'"><tbody><tr><td><input type="text" name="" class="form-control" laceholder="Commissonable PPW"></td><td><input type="text" name=""  class="form-control" placeholder="<"></td><td><input type="text" name=""  class="form-control" placeholder="Territory Base Rate"></td></tr>				</tbody></table><button type="button" class="btn add_condition_'+inc+'" (click)="addCondition('+inc+')"> <i class="material-icons">add</i> Add ondition</button><table><tr><td><div class="form-check"><label class="form-check-label"><input class="form-check-input" type="checkbox" value=""><span class="form-check-sign"><span class="check"></span></span></label></div></td><td> All conditions should meet</td></tr><tr><td><div class="form-check"><label class="form-check-label"><input class="form-check-input" type="checkbox" value=""><span class="form-check-sign"><span class="check"></span></span></label></div></td><td>One or more conditions should meet</td></tr><tr><td> <div class="form-check"><label class="form-check-label"><input class="form-check-input" type="checkbox" value=""><span class="form-check-sign"><span class="check"></span></span></label></div></td><td> Advance</td></tr><tr><td colspan="2"><div class="form-group"><label class="bmd-label-floating ">Advance Condition</label><input type="text" name=""  class="form-control" disabled ></div></td></tr></table></fieldset></form></div><div class="col border-left">						<h6 class="mt-5">Action</h6><input type="text" class="form-control" value="Commsion On Watts - Solar pro deductions"></div></div></td></tr>');
    let createdEle = this.hElement.querySelector('.add_condition_'+inc);
    createdEle.addEventListener('click', (event) => this.addCondition(inc));
  }


  addCondition(count: number){
    let dom = this.hElement.querySelector('.inputbox_table_'+count+' tbody');
    if(dom){
      dom.insertAdjacentHTML('beforeend', '<tr><td><input type="text" name="" class="form-control"></td><td><input type="text" name=""  class="form-control"></td><td><input type="text" name=""  class="form-control"></td></tr>');
    }
  }

}
