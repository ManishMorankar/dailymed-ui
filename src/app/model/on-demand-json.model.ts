export interface IOnDemandJson {
    contactId: number;
    contactName: string;
    ruleName: string;
    ruleId: number;
    stepName: string;
    stepId: number;
    actionValue: string;
    metaDatas: IOnDemandJsonMetadata[];
}

export interface IOnDemandJsonMetadata {
    identifier: string;
    displayName: string;
    value: string;
}