export interface IStep {
    stepName: string;
    stepId: number;
    action: string;
    criteria: string;
    comment: string;
    roundDepth: number;
    conditions: ICondition[];
}

export interface ICondition {
    rightSide: string;
    leftSide: string;
    operators: string;
    action: string;
}