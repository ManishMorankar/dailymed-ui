export interface IJob {
    diJobId: number;
    diJobTypeName: string;
    jobStartTimestamp: Date;
    jobEndTimestamp?: Date;
    jobStatus: string;
}