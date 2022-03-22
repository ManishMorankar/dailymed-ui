import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IConfirmationDialogData, private dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
  }

}

export interface IConfirmationDialogData {
  message: string;
}