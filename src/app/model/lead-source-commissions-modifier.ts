export interface ILeadSourceCommisionModfier {
  selected?: boolean;
  leadSourceCommissionsModifierId: number;
  leadSource: string;
  leadSourceModifierType: string;  
}

export class LeadSourceCommisionModfier {
    selected: boolean;
    leadSourceCommissionsModifierId: number;
    leadSource: string;
    leadSourceModifierType: string;
}
