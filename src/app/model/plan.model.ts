import { IRule } from './rule.model';

export interface IPlan {
    planId: number;
    planName: string;
    contactPlanId: number;
    description: string;
    startDate: Date;
    endDate: Date;
    planDetails: IPlanDetail[];
}

export interface IPlanDetail {
    ruleTypeName: string;
    rules: IRule[];
}