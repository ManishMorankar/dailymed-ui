export class RateObject {
    id: number;
    step: number;
    conditionName: string;
    conditions: ConditionObject[];
    conditionQualifier: string;
    advanceCondition: string;
    action: ActionObject[];
    roundInd: boolean;
    roundDepth?: number;
    validAction: boolean;
    invalidReasoning: string;
    actionDisplay: string[];
    constructor() {
        this.validAction= false;
        this.invalidReasoning= "Action cannot be empty";
        this.actionDisplay = [];
    }
}

export class ConditionObject {
    id: number;
    condition1: ConditionMetadata;
    operator: string;
    condition2: ConditionMetadata;
    isValid: boolean;

    constructor() {
        this.operator = "Less than";
        this.isValid = false;
    }
}

export class ActionObject {
    id: number;
    action: string;
    identifier: string;

    constructor() {
        this.action = "";
        this.identifier = "";
    }
}

export class ConditionMetadata {
    name: string;
    metadata: string;
    identifier: string;

    constructor() {
        this.name = "";
        this.metadata = "";
        this.identifier = "";
    }
}

