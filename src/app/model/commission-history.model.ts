export interface ICommissionHistory {
    userModifiedTimestamp: Date;
    commissionAmount: number;
    commissionFinalized: boolean;
    commissionOverriden: boolean;
    commissionNote: string;
}