export class MetadataRestructure {
    tableName: string;
    Content: MetadataContent[];
}
export class MetadataContent {
    Identifier: string;
    DisplayName: string;
    dataType: string;
}

export class DragDropRestructure {
    tableName: string;
    content: DragDropContent[];
}

export class DragDropContent {
    identifier: string;
    displayName: string;
    dataType: string;
}