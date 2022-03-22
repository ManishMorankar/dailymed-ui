import { IRule } from './rule.model';

export interface IPlanDetails {
    contactPlanId: number;
    planId: number;
    planName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    planDetails: IPlanRule[];
}

export interface IPlanRule {
    ruleTypeName: string;
    rules: IRule[];
}