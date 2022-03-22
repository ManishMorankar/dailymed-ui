export interface IPaymentHistory {
    paymentType: string;
    paymentNumber: number;
    amount: number;
    paymentStatus: string;
    paymentDueDate: Date;
    paymentNote: string;
}