import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFilterPipe } from './table-filter.pipe';

@NgModule({
  declarations: [
    TableFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TableFilterPipe
  ]
})
export class MainPipeModule { }
