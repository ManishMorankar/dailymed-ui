import { IPrompt } from './prompt.model';

export interface IRule {
    ruleId: number;
    ruleName: string;
    promptAssignPlan: boolean;
    ruleTypeId: number;
    ruleTypeName: string;
    description: string;
    formulaId: number;
    metadataTypeId: number;
    tableSchema: string;
    identifier: string;
    tableName: string;
    columnName: string;
    displayName: string;
    noReclaim: boolean;
    effectiveStartDate: any;
    effectiveEndDate: any;
    paymentRuleTypeId: number;
    triggerRuleTypeId: number;
    sqlQuery: string;
    paymentBookTypeId: number;
    overdrawLimit: number;
    weeklyPay: number;
    fallbackRuleId: number;
    prompts: IPrompt[];
    steps: IStep[];
    numberOfBonuses: number;
}

export interface IStep {
    stepName: string;
    action: string;
    criteria: string;
    comment: string;
    roundDepth: number;
    conditions: ICondition[];
}

export interface ICondition {
    rightSide: string;
    leftSide: string;
    operators: string;
    action: string;
}
