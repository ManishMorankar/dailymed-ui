export interface IEmployeeIncentive {
    ruleId: number;
    ruleName: string;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    numberOfBonuses: number;
    offerAmount: number;
}