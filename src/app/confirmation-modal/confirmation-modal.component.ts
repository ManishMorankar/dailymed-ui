import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationModalData) { }

  ngOnInit() {
  }

  onConfirm() {
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

export interface IConfirmationModalData {
  message: string;
}