import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {
  months = ["jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  constructor(private date: DatePipe) {}

  transform(group: any[], searchText: string): any {
    let newGroup = group.filter(item => Object.values(item).filter(x => x != null && (x.toString().includes(searchText) ||((this.months.filter(x => searchText.toLowerCase().includes(x)).length > 0) &&x.toString().length == 19 &&new Date(x.toString()).toString() != "Invalid Date" &&this.date.transform(new Date(x.toString())).includes(searchText)))).length > 0);

    if (newGroup.length == 0) {
      newGroup = group.filter(item => Object.values(item).filter(x => x != null && ( x.toString().toLowerCase().includes(searchText.toLowerCase()) || ((this.months.filter(x => searchText.toLowerCase().includes(x)).length > 0) && x.toString().length == 19 && new Date(x.toString()).toString() != "Invalid Date" && this.date.transform(new Date(x.toString())).toLowerCase().includes(searchText.toLowerCase())))).length > 0);
    }

    return newGroup;
  }

}