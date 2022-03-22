export interface IPaymentBook {
    pbId: number;
    ruleId: number;
    ruleName: string;
    ruleType: number;
    ruleDescription: string;
    pbType: string;
    overdrawLimit: number;
    weeklyPay: number;
}

export interface IContactPaymentBook {
    contactName: string;
    paymentBookTypeId: number;
    paymentBookTypeName: string;
    weeklyPay: number;
    overdrawLimit: number;
}

export interface IPaymentBookTransaction {
    dateProcessed: Date;
    opportunityId: number;
    opportunityName: string;
    paymentTypeName: string;
    commissionTransactionTypeName: string;
    debitCredit: string;
    amount: number;
    commissionId: number;
}