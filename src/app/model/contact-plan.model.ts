export interface IContactPlan {
    contactPlanId: number;
    contactId: number;
    planHeaderId: number;
    planName?: string;
    contactPlanStartDate: Date;
    contactPlanEndDate?: Date;
    contactPlanComments: string;
}