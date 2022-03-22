export interface IOutreachOpportunity {
  opportunityName: string;
  demoDate: Date;
  hireDate: Date;
  monthlyDemoNumber: number;
  leadGenerator: string;
  leadGeneratorPlanName: string;
  employeeStatus: string;
  contactId: number;
  opportunityId: number;
}

export class OutreachOpportunity {
  opportunityName: string;
  demoDate: Date;
  hireDate: Date;
  monthlyDemoNumber: number;
  leadGenerator: string;
  leadGeneratorPlanName: string;
  employeeStatus: string;
  contactId: number;
  opportunityId: number;
}
