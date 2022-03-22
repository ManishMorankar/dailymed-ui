import { IRule } from './rule.model';

export interface IBasicPlan {
    parent: string;
    child: IRule[];
}