export interface IBasePayStructureForm {
  ruleId: number;
  ruleName: string;
  ruleTypeId: number;
  description: string;
  promptAssignPlan: boolean;
  numberOfStages: number;
  basePayStructures: IBasePayStructure[];
}

export interface IBasePayStructure {
  basePayStructureId: number;
  basePayStructureName: string;
  ruleId: number;
  ruleName: string;
  ruleTypeId: number;
  numberOfPayments: number;
  promptAssignPlan: boolean;
  startDate: string;
  endDate: Date;
  defaultStage: string;
  fallbackRuleId: number;
  payStream: IPayStreamItem[];
}

export interface IContactBasePayStructureForm {
  ruleId: number;
  ruleName: string;
  ruleTypeId: number;
  description: string;
  numberOfStages: number;
  contactBasePayStructures: IContactBasePayStructure[];
}

export interface IContactBasePayStructure {
  contactBasePayStructureId: number;
  contactBasePayStructureName: string;
  contactPlanId: number;
  ruleId: number;
  numberOfPayments: number;
  startDate: Date;
  endDate?: Date;
  payStream: IPayStreamItem[];
}

export interface IPayStreamItem {
  paymentNumber: number;
  percentage: number;
  stage: string;
  paymentDueDateMappingId: number;
  daysInAdvance: number;
  paymentTypeId: number;
  payBasedOn: string;
}

export interface IContactBasePayStructureUpdate {
  contactPlanId: number;
  contactBasePayStructures: IContactBasePayStructure[];
}