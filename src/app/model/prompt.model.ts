export interface IPrompt {
    ruleId: number;
    schema: string;
    tableName: string;
    columnName: string;
    displayName: string;
}

export class Prompt {
    ruleId: number;
    schema: string;
    tableName: string;
    columnName: string;
    displayName: string;
    value: any;
}