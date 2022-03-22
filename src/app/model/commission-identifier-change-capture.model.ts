export interface ICommissionIdentifierChangeCapture {
    commissionIdentifierChangeCaptureId: number;
    commissionId: number;
    commissionTransactionId: number;
    applicationMetaDataIdentifier: string
    applicationMetadataDisplayName: string
    oldValue: string;
    newValue: string;
}