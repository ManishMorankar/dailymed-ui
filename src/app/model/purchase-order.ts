export interface IPurchaseOrder {
  selected?: boolean;
  purchaseOrderId: number;
  poNumber: string;
  contactNumber: string;  
  vendorId: number;  
}

export class PurchaseOrder {
  selected?: boolean;
  purchaseOrderId: number;
  poNumber: string;
  contactNumber: string;
  vendorId: number;  
}
