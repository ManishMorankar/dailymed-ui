export interface IRuleData {
    ruleType: string;
    ruleTypeId: string;
    data: IRuleDataRule[];
    children: IRuleData[]
}

export interface IRuleDataRule {
    ruleId: number;
    ruleName: string;
}