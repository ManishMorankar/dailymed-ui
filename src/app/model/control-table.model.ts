export interface IControlTable {
    rows: IControlTableRow[];
}

export interface IControlTableRow {
    displayName: string;
    value: any;
}