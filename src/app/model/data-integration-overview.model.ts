export interface IDataIntegrationOverview {
    diJobExtractComponentId: number;
    diJobId: number;
    diExtractComponentName: string;
    jobComponentStartTimestamp: Date;
    jobComponentEndTimestamp: Date;
    jobComponentStatus: string;
    batchCount: number;
}