import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-daily-med-data-dialog',
  templateUrl: './daily-med-data-dialog.component.html',
  styleUrls: ['./daily-med-data-dialog.component.css']
})
export class DailymedDataDialogComponent implements OnInit {

  dailymedForm: FormGroup;
    Year: any;
    ApprovalDate: any;
    ApplicationType: any;
    ApplicationNumber: any;
    BrandName: any;
    RouteOfAdministration: any;
    Dosage: any;
    TypeofDosageForm: any;
    TypeOfRelease: any;
    ActiveIngredient: any;
    ActiveUNIINumber: any;
    ActiveStrength: any;
    InactiveIngredient: any;
    InctiveUNIINumber: any;
    InactiveStrength: any;
    TherapeuticCategory: any;
    MarketingStatus: any;
    MarketingStartDate: any;
    Category: any;
    Submission: any;
    SubmissionType: any;
    SubmissionStatus: any;
    CompanyName: any;
    Subsidiaries: any;
    Repackager: any;
    DunsNumber: any;
    ManufacureCountry: any;
    ManufacureAddress: any;
    ManufacureName: any;
    LabelerName: any;
    RegistrantName: any;
    ExpirationDate: any;
    ExclusivityDate: any;
    NdcCode: any;
    PatenNo: any;
    Packaging: any;
    ImageName: any;
    ImageUrl: any;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DailymedDataDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IDailymedDataDialog) { }

  ngOnInit() {
    this.dailymedForm = this.formBuilder.group({
      Year: [this.Year],
      ApprovalDate: [this.ApprovalDate],
      ApplicationType: [this.ApplicationType],
      ApplicationNumber: [this.ApplicationNumber],
      BrandName: [this.BrandName],
      RouteOfAdministration: [this.RouteOfAdministration],
      Dosage: [this.Dosage],
      TypeofDosageForm: [this.TypeofDosageForm],
      TypeOfRelease: [this.TypeOfRelease],
      ActiveIngredient: [this.ActiveIngredient],
      ActiveUNIINumber: [this.ActiveUNIINumber],
      ActiveStrength: [this.ActiveStrength],
      InactiveIngredient: [this.InactiveIngredient],
      InctiveUNIINumber: [this.InctiveUNIINumber],
      InactiveStrength: [this.InactiveStrength],
      TherapeuticCategory: [this.TherapeuticCategory],
      MarketingStatus: [this.MarketingStatus],
      MarketingStartDate: [this.MarketingStartDate],
      Category: [this.Category],
      Submission: [this.Submission],
      SubmissionType: [this.SubmissionType],
      SubmissionStatus: [this.SubmissionStatus],
      DunsNumber: [this.DunsNumber],
      CompanyName: [this.CompanyName],
      Subsidiaries: [this.Subsidiaries],
      Repackager: [this.Repackager],
      RegistrantName: [this.RegistrantName],
      LabelerName: [this.LabelerName],
      ManufacureName: [this.ManufacureName],
      ManufacureAddress: [this.ManufacureAddress],
      ManufacureCountry: [this.ManufacureCountry],
      PatenNo: [this.PatenNo],
      ExpirationDate: [this.ExpirationDate],
      ExclusivityDate: [this.ExclusivityDate],
      NdcCode: [this.NdcCode],
      Packaging: [this.Packaging],
      ImageName: [this.ImageName],
      ImageUrl: [this.ImageUrl],
    });
  }


  closedClick() {
    this.dialogRef.close();
  }
}

export interface IDailymedDataDialog {
  Year: any;
  ApprovalDate: any;
  ApplicationType: any;
  ApplicationNumber: any;
  BrandName: any;
  RouteOfAdministration: any;
  Dosage: any;
  TypeofDosageForm: any;
  TypeOfRelease: any;
  ActiveIngredient: any;
  ActiveUNIINumber: any;
  ActiveStrength: any;
  InactiveIngredient: any;
  InctiveUNIINumber: any;
  InactiveStrength: any;
  TherapeuticCategory: any;
  MarketingStatus: any;
  MarketingStartDate: any;
  Category: any;
  Submission: any;
  SubmissionType: any;
  SubmissionStatus: any;
  CompanyName: any;
  Subsidiaries: any;
  Repackager: any;
  DunsNumber: any;
  ManufacureCountry: any;
  ManufacureAddress: any;
  ManufacureName: any;
  LabelerName: any;
  RegistrantName: any;
  ExpirationDate: any;
  ExclusivityDate: any;
  NdcCode: any;
  PatenNo: any;
  Packaging: any;
  ImageName: any;
  ImageUrl: any;
}
