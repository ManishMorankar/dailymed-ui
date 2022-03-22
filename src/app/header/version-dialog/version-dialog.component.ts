import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-version-dialog',
  templateUrl: './version-dialog.component.html',
  styleUrls: ['./version-dialog.component.css']
})
export class VersionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VersionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IVersionDialogData) { }

  ngOnInit() {
  }

}

export interface IVersionDialogData {
  version: number;
  lastSyncDate: Date;
  lastSyncDateUtc: Date;
}