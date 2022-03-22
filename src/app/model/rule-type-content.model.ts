export interface IRuleTypeContent {
    ruleTypeId: number;
    ruleCd: string;
    description: string;
    activeInd: string;
    planLimitation: number;
    isParent: boolean;
    hasCommissionType: boolean;
    hasPaymentType: boolean;
    hasCommissionRuleTrigger: boolean;
    frequency: string;
}