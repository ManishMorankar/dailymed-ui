import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CreateRuleComponent } from '../create-rule/create-rule.component';
import { BasepayStructureComponent } from './basepay-structure/basepay-structure.component';
import { BonusIncentivesComponent } from './bonus-incentives/bonus-incentives.component';
import { RateIncentivesComponent } from './rate-incentives/rate-incentives.component';
import { PaymentBookComponent } from './payment-book/payment-book.component';
import { CreateRuleRoutingModule } from './create-rule-routing.module';
import { ViewRuleComponent } from './view-rule/view-rule.component';
import { ViewPlanComponent } from './view-plan/view-plan.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ViewBasePayStructureComponent } from './view-base-pay-structure/view-base-pay-structure.component';
import { ViewPayBookComponent } from './view-pay-book/view-pay-book.component';
import { CreateStaticComponent } from './create-static/create-static.component';
import { PayStreamItemComponent } from './basepay-structure/stage/pay-stream-item/pay-stream-item.component';
import { MatTooltipModule, MatCheckboxModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule, MatDialogModule, MatCardModule, MatSelectModule, MatIconModule, MatButtonModule, MatSnackBarModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import 'hammerjs';
import { ViewBaseFormulaComponent } from './view-base-formula/view-base-formula.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { CloneRuleComponent } from './clone-rule/clone-rule.component';
import { StageComponent } from './basepay-structure/stage/stage.component';
import { ValidateActionService } from './service/validate-action.service';
import { RestructureService } from './service/restructure.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AwardedIncentivesComponent } from './view-rule/awarded-incentives/awarded-incentives.component';
import { IncentiveComponent } from './view-rule/awarded-incentives/incentive/incentive.component';

@NgModule({
  declarations: [
    CreateRuleComponent,
    BasepayStructureComponent,
    BonusIncentivesComponent,
    RateIncentivesComponent,
    PaymentBookComponent,
    ViewRuleComponent,
    ViewPlanComponent,
    ViewBasePayStructureComponent,
    ViewPayBookComponent,
    CreateStaticComponent,
    PayStreamItemComponent,
    ViewBaseFormulaComponent,
    TreeViewComponent,
    CloneRuleComponent,
    StageComponent,
    AwardedIncentivesComponent,
    IncentiveComponent
  ],
  imports: [
    MatPaginatorModule,
    CommonModule,
    CreateRuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    MatTooltipModule,
    DragDropModule,
    MatRadioModule,
    MatCheckboxModule,
    NgxPaginationModule,
    SharedModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers: [ValidateActionService,
    RestructureService],
  entryComponents: [
    IncentiveComponent,
    CreateStaticComponent
  ]
})
export class CreateRuleModule { }
