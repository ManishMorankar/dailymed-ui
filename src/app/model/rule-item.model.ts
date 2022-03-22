import { IRuleInput } from './rule-input.model';

export interface IRuleItem {
    itemId?: number;
    ruleItemInputs: IRuleInput[];
}