export interface ISalesRepPayment {
    paymentStatus: string;
    paymentStatusId: number;
    paymentType: string;
    paymentTypeId: number;
    paymentFor: string;
    dateProcessed: Date;
    systemSize?: number;
    amount: number;
}