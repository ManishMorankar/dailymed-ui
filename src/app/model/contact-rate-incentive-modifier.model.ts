export interface IContactRateIncentiveModifier {
    commissionRuleName: string;
    amountGained: number;
    percentGained: number;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    activeInd: boolean;
}