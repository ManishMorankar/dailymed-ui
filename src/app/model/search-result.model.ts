export interface ISearchResult {
    objectId: number;
    objectType: string;
    objectName: string;
    ruleType: string;
    stage: string;
    stageStatus: string;
}

export interface ISearchValue {
    type: string;
    values: ISearchResult[];
}