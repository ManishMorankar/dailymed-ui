export interface IOpportunity {
    opportunityId?: number;
    opportunityName?: string;
    leadSource?: string;
    projectStatus?: string;
    permitPayer?: string;
    salesTerritory?: string;
    utilityCompany?: string;
    stage?: string;
    stageStatus?: string;
    opportunityType?: string;
    appointmentTerritory?: string;
    directSalesOffice?: string;
    territorySalesOffice?: string;
    county?: string;
    leadGeneratorOffice?: string;
    iosTrack?: string;
    appointmentCompleted?: boolean;
    insideSalesCampaignId?: number;
    insideSalesCampaignName?: string;
    opportunityFinalized?: boolean;
    
    trinitySalespersonName?: string;
    trinitySalespersonId?: number;
    leadGeneratorName?: string;
    leadGeneratorId?: number;
    sdrInsideSalesName?: string;
    sdrInsideSalesId?: number;
    salesSuccessRepresentativeName?: string;
    salesSuccessRepresentativeId?: number;
    primaryContactName?: string;
    primaryContactId?: number;
    previousTrinitySalesperson?: string;
    accountExecutiveName?: string;
    accountExecutiveId?: number;

    
    dateOfFirstAppointment?: Date;
    dateContractSigned?: Date;
    actualInstallDate?: Date;
    dateLoiSigned?: Date;
    winBackDate?: Date;
    actualInstallCompleteDate?: Date;
    scheduledInstallDate?: Date;
    demoDate?: Date;
    opportunityCreatedDate?: Date;

    systemSizeKWdc?: number;
    moduleType?: string;
    inverterType?: string;
    inverterType2?: string;
    inverterType3?: string;
    inverterType4?: string;
    installationType?: string;


    opportunityAmount?: number;
    ppaRate?: number;
    ppaRateEscalator?: number;
    pricePerWatt?: number;
    purchaseMethod?: string;
    partner?: string;
    salesChargeBackAmount?: number;
    amountForReduction?: number;
    permitAmount?: number;
}