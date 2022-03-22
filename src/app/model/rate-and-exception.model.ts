export interface IRateAndException {
    contactRateAndExceptionId: number;
    contactId: number;
    contactRateAndExceptionTypeId: number;
    contactRateAndExceptionTypeName: string;
    rateOrExceptionAmount: number;
    rateOrExceptionPercentage: number;
    rateOrExceptionNumber: number;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    inputType: string;
    value: number;
}