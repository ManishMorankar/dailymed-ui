export class InfoBox {
  skyblueInfo: InfoBoxContent;
  blueInfo: InfoBoxContent;
  greenInfo: InfoBoxContent;
  greyInfo: InfoBoxContent;
}

export class InfoBoxContent {
    name: string;
    number: any;
}

export class TabSection {
    newTab: NewTab[];
}

export class NewTab {
    title: string;
    tabContent: TabContent;
}

export class TabContent {
    columnNames: string[];
    columnData: TabData[];
}

export class TabData {
    position: number;
    data: any[]
}
