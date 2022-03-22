export interface IPaycomHistory {
    commissionTransactionId: number;
    dateProcessed: Date;
    numberOfWithdrawals: number;
    totalAmountWithdrawn: number;
    transactionName: string;
}