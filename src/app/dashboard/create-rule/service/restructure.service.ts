import { Injectable } from '@angular/core';
import { StaticRestructure } from '../model/static.model';
import { ToastrService } from 'ngx-toastr';
import { MetadataRestructure } from '../model/aggregate.model';

@Injectable()

export class RestructureService {
  constructor(private toastMsg: ToastrService) { }

  restructureStatic(staticStructure: StaticRestructure[], staticMetaData: { identifier: string, tableName: string, displayName: string, dataType: string }[]): StaticRestructure[] {
    staticMetaData = staticMetaData.sort(this.sortAlphabetical);

    for (let i: number = 0; i < staticMetaData.length; i++) {
      const currentContent: any = staticMetaData[i];
      switch (currentContent.dataType.toLowerCase()) {
        case 'numeric':
          staticStructure[0].content.push({ displayName: currentContent.displayName });
          break;
        case 'string':
          staticStructure[1].content.push({ displayName: currentContent.displayName });
          break;
        case 'date':
          staticStructure[2].content.push({ displayName: currentContent.displayName });
          break;
        case 'boolean':
          staticStructure[3].content.push({ displayName: currentContent.displayName })
          break;
        default:
          this.toastMsg.error("Error retrieving data types");
          break;
      }
    }
    return staticStructure;
  }

  sortAlphabetical = (a, b) => {
    if (a.displayName > b.displayName) {
      return 1;
    }
    if (b.displayName > a.displayName) {
      return -1;
    }
    return 0;
  }
}