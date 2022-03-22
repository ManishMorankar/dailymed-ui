export interface IPayment {
    paymentId: number;
    contactId: number;
    contactName: string;
    opportunityId: number;
    opportunityName: string;
    paymentTypeId: number;
    paymentTypeName: string;
    amount: number;
    commissionTransactionId: number;
    paymentNumber: number;
    salesDivision: string;
    salesOffice: string;
    commissionTypeName: string;
    actualInstallDate: Date;
    dateContractSigned: Date;
    paymentStatus: IPaymentStatus;
    paymentDueDate: Date;
    processedDate?: Date;
    paymentNote: string;
    selected?: boolean;
    commissionRuleName: string;
    planName: string;
    appointmentSetting: string;
}

export class Payment {
    selected: boolean;
    paymentId: number;
    contactId: number;
    contactName: string;
    opportunityId: number;
    opportunityName: string;
    paymentTypeId: number;
    paymentTypeName: string;
    amount: number;
    commissionTransactionId: number;
    paymentNumber: number;
    salesDivision: string;
    salesOffice: string;
    commissionTypeName: string;
    actualInstallDate: Date;
    dateContractSigned: Date;
    paymentStatus: IPaymentStatus;
    paymentDueDate: Date;
    processedDate?: Date;
    paymentNote: string;
}

export interface IPaymentStatus {
    paymentStatusId: number;
    paymentStatusName: string;
}

export interface IPaymentBookBalance {
    contactId: number;
    contactName: string;
    paymentBookTypeName: string;
    balance: number;
    weeklyPay: number;
    overdrawLimit: number;
    withdrawalAmount: number;
    salesDivision: string;
    salesOffice: string;
    lastWithdrawalDate: Date;
    selected?: boolean;
    processDate?: Date;
}

export class PaymentBookBalance {
    selected: boolean;
    contactId: number;
    contactName: string;
    paymentBookTypeName: string;
    balance: number;
    weeklyPay: number;
    overdrawLimit: number;
    withdrawalAmount: number;
    salesDivision: string;
    salesOffice: string;
    lastWithdrawalDate: Date;
}

// Dilip 05/25/2020
export class UpdatePaymentApproval {    
    updatePaymentStatus: UpdatePaymentStatus[];
    processDate: Date;
}

export class UpdatePaymentStatus {
    paymentId: number;
    paymentStatusId: number;
    processDate: Date;
    notes: string;
}

export class PaymentPayload {
    withdrawalName: string;
    paymentContact: PaymentContact[];
    allowUsersOverride:boolean;
}

export class PaymentContact {
    contactId: number;
}

export interface IPaymentElement {
    paymentId: number;
    paymentTypeName: string;
    commissionTypeName: string;
    amount: number;
    paymentStatusName: string;
    paymentDueDate: Date;
}