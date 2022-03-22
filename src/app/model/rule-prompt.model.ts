import { IRuleItem } from './rule-item.model';

export interface IRulePrompt {
    commissionRuleId: number;
    ruleItems: IRuleItem[];
}