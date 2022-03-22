export interface ILeadSource {
  selected?: boolean;
  leadSourceId: number;
  leadSource: string;
}

export class LeadSource {
  selected: boolean;
  leadSourceId: number;
  leadSource: string;
}
