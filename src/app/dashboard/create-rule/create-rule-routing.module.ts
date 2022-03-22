import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRuleComponent } from '../create-rule/create-rule.component'
import { AuthGuard } from '../../guards/auth.guard';
import { ViewRuleComponent } from './view-rule/view-rule.component';
import { ViewPlanComponent } from './view-plan/view-plan.component';
import { ViewBasePayStructureComponent } from './view-base-pay-structure/view-base-pay-structure.component';
import { ViewPayBookComponent } from './view-pay-book/view-pay-book.component';
import { ViewBaseFormulaComponent } from './view-base-formula/view-base-formula.component';
import { CloneRuleComponent } from './clone-rule/clone-rule.component'

const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full'},
  { path: 'create', component: CreateRuleComponent, canActivate:[AuthGuard] },
  { path: 'baseformula', component: CreateRuleComponent, canActivate:[AuthGuard] },
  { path: 'commissions/viewRule/:id', component: ViewRuleComponent, canActivate:[AuthGuard] },
  { path: 'commissions/viewPlan/:id', component: ViewPlanComponent, canActivate:[AuthGuard] },
  { path: 'commissions/viewBasePayStructure/:id', component: ViewBasePayStructureComponent, canActivate:[AuthGuard] },
  { path: 'commissions/viewPaymentBook/:id', component: ViewPayBookComponent, canActivate:[AuthGuard] },
  { path: 'commissions/viewBaseFormula/:id', component: ViewBaseFormulaComponent, canActivate:[AuthGuard] },
  { path: 'clone-rule/:rule_id', component: CloneRuleComponent, canActivate:[AuthGuard] },
  { path: 'clone-baseformula/:rule_id', component: CloneRuleComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRuleRoutingModule { }
