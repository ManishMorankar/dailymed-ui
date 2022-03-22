export interface IOrganization {
  selected?: boolean;
  organizationId: number;
  organizationCode: string;
  organizationName: string;  
}

export class Organization {
  selected: boolean;
  organizationId: number;
  organizationCode: string;
  organizationName: string;
}
