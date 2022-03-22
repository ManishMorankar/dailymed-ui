import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../../services/api.service";
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../services/api.response';
import { dailyMedData } from '../../../model/dailyMed-data.model'
import { environment } from '../../../environments/environment';
//import { DailyMedDataService } from 'src/app/services/dailyMed.service'
import * as FileSaver from 'file-saver';
import { DailymedDataDialogComponent } from '../daily-med-data-dialog/daily-med-data-dialog.component';

@Component({
  selector: 'app-daily-med-report',
  templateUrl: './daily-med-report-component.html',
  styleUrls: ['./daily-med-report-component.css']
})
export class DailyMedReportComponent implements OnInit {
  ResultSkipedRows: string = '0'
  TotalCount: string = '0'
  fromVal: string = null;
  toVal: string = null;
  patentExpirationDateVal: string = null;
  patentExclusivityDateVal: string = null;
  typeOfReleaseVal: string = null;
  applicationTypeVal: string = null;
  applicationNoVal: string = null;
  activeIngredientVal: string = null;
  activeStrengthVal: string = null;
  activeUniiVal: string = null;
  inActiveIngredientVal: string = null;
  inActiveStrengthVal: string = null;
  inActiveUniiVal: string = null;
  routeOfAdministrationVal: string = null;
  dosageFormVal: string = null;
  marketingStatusVal: string = null;
  manufacureNameVal: string = null;
  manufacureCountryVal: string = null;
  brandNameVal: string = null;
  ndcCodeVal: string = null;
  categoryVal: string = null;
  packagingVal: string = null;
  submissionVal: string = null;
  submissionTypeVal: string = null;
  submissionStatusVal: string = null;
  patentNoVal: string = null;
  therapeuticCategoryVal: string = null;
  companyNameVal: string = null;
  numberOfRows: string = '';

  addInd: boolean = false;
  addbtn: boolean = true;
  cancelbtn: boolean = false;
  DailyMedReportForm: FormGroup;
  projectDropdowns: any;
  documentTypesDropdowns: any;
  pageSizeOptions: number[] = [500, 1000, 1500];
  exportButton: boolean = false;

  resultDataSource: any = new MatTableDataSource([]);
  selected: any = [];
  selectedtypeOfRelease: any;
  selectedapplicationType: any;
  //selectedapplicationNo: any;
  selecteddosageForm: any;
  selectedmarketingStatus: any;
  resultCols: string[] = ["year", "approvalDate", "NDAANDABLA", "applicationNumber", "therapeuticEquivalents", "brandName", "routeOfAdministration","subRouteOfAdministration", "dosage", "typeofDosageForm", "typeOfRelease", "activeIngredient", "activeUnii", "activeStrength", "inActiveIngredient", "inActiveUnii", "inActiveStrength", "therapeuticCategory", "subcategory", "marketingStatus", "marketingStartDate", "category", "submission", "submissionType", "submissionStatus", "dunsNumber", "companyName", "subsidiaries", "repackager", "registrantName", "labelerName", "manufacureName", "manufacureAddress", "manufacureCountry", "patentNo", "expirationDate", "exclusivityDate", "ndcCode", "packaging", "imageName", "imageUrl", "country", "sector", "intStrength", "intPack", "patentExpiryDate", "countingUnits2016", "usDollarMnf2016", "countingUnits2017", "usDollarMnf2017", "countingUnits2018", "usDollarMnf2018"];
  filter: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public apiService: ApiService, private toastMsg: ToastrService, private formBuilder: FormBuilder, private pipe: TableFilterPipe, private http: HttpClient,
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private dialog: MatDialog) {
  }
  @Input() loginUser: any = {}
  applicationTypeList = [
    { id: 1, applicationType: 'NDA' },
    { id: 2, applicationType: 'ANDA' },
    { id: 3, applicationType: 'BLA' },
    { id: 4, applicationType: 'NADA' },
    { id: 5, applicationType: 'ANADA' }
  ];

  dosageFormList = [
    { id: 1, dosageForm: 'Coated' },
    { id: 2, dosageForm: 'Chewing' },
    { id: 3, dosageForm: 'FILM COATED' },
    { id: 4, dosageForm: 'FOR SUSPENSION' },
    { id: 5, dosageForm: 'GELATIN COATED' },
    { id: 6, dosageForm: 'LIQUID FILLED' }
  ];

  typeOfRelaseList = [
    { id: 1, typeOfRelease: 'DELAYED RELEASE' },
    { id: 2, typeOfRelease: 'DELAYED RELEASE PELLETS' },
    { id: 3, typeOfRelease: 'EXTENDED RELEASE' }
  ];

  marketingStatusList = [
    { id: 1, marketingStatus: 'Discontinued' },
    { id: 2, marketingStatus: 'Over-the-counter' },
    { id: 3, marketingStatus: 'Prescription' }
  ];
  ngOnInit() {

    //this.getApplicationNoDropdowns();

    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }
    this.DailyMedReportForm = this.formBuilder.group({
      From: [''],
      To: [''],
      patentExpirationDate: [''],
      patentExclusivityDate: [''],
      typeOfReleasedropdown: [],
      typeOfApplicationdropdown: [],
      applicationNodropdown: [],
      activeIngredientdropdown: [],
      activeStrengthdropdown: [],
      activeUniidropdown: [],
      inActiveIngredientdropdown: [],
      inActiveStrengthdropdown: [],
      inActiveUniidropdown: [],
      routeOfAdministrationdropdown: [],
      dosageFormdropdown: [],
      marketingStatusdropdown: [],
      manufacureNamedropdown: [],
      manufacureCountrydropdown: [],
      brandNamedropdown: [],
      ndcCodedropdown: [],
      packagingdropdown: [],
      categorydropdown: [],
      submissiondropdown: [],
      submissionTypedropdown: [],
      submissionStatusdropdown: [],
      patentNodropdown: [],
      therapeuticCategory: [],
      companyName: [],
    });
    this.getResult();
  }



  addClick() {
    this.addInd = true;
    this.addbtn = false;
    this.cancelbtn = true;
  }
  cancelClick() {
    this.addInd = false;
    this.addbtn = true;
    this.cancelbtn = false;
  }


  //getApplicationNoDropdowns() {
  //  this.http.get<ApiResponse>(`${environment.apiBaseUrl}home/applicationsNo/`, {})
  //    .subscribe(data => {
  //      if (data.statusCode === "200" && data.result) {
  //        this.applicationNoList = data.result;
  //      } else {
  //        this.toastMsg.error(data.message, "Error!")
  //      }
  //    }, (err: any) => {
  //      this.toastMsg.error(err, "Error!")
  //    });

  //}

  limitDailyMedData(name: string) {
    if (name != null) {
      var nameLenght = '';
      if (name.length > 30) {
        nameLenght = name.substring(0, 30);
        return nameLenght + "...";
      }
      else {
        return name;
      }
    }
    else {
      nameLenght = '';
      return nameLenght;
    }

  }


  resetClick() {
    this.DailyMedReportForm.reset();
    //this.DocumentStatusReportForm.controls.projectType.setValue("");
    //this.DocumentStatusReportForm.controls.projectNameId.setValue("0");
    //this.DocumentStatusReportForm.controls.documentTypeId.setValue("0");
    //this.DocumentStatusReportForm.controls.documentStatus.setValue("");
    //this.DocumentStatusReportForm.controls.documentId.setValue("");
  }
  returnUrl(fileLink: String) {
    return fileLink;
  }
  downloadOption(fileLink: String) {
    if (fileLink == "") {
      return false;
    }
    return true;
  }

  rowClick(row: any) {
    var year = row.year;
    var approvalDate = row.approvalDate;
    var applicationType = row.NDAANDABLA;
    var applicationNumber = row.applicationNumber;
    var therapeuticEquivalents = row.therapeuticEquivalents;
    var brandName = row.brandName;
    var routeOfAdministration = row.routeOfAdministration;
    var dosage = row.dosage;
    var typeofDosageForm = row.typeofDosageForm;
    var typeOfRelease = row.typeOfRelease;
    var activeIngredient = row.active_Ingredient;
    var activeUNIINumber = row.active_UNII_Number;
    var activeStrength = row.active_Strength;
    var inactiveIngredient = row.inactive_Ingredient;
    var inctiveUNIINumber = row.inctive_UNII_Number;
    var inactiveStrength = row.inactive_Strength;
    var therapeuticCategory = row.therapeuticCategory;
    var marketingStatus = row.marketingStatus;
    var marketingStartDate = row.marketing_Start_Date;
    var category = row.category;
    var submission = row.submission;
    var submissionType = row.submission_Type;
    var submissionStatus = row.submission_Status;
    var dunsNumber = row.duns_Number;
    var companyName = row.company_Name;
    var subsidiaries = row.subsidiaries;
    var repackager = row.repackager;
    var registrantName = row.registrant_Name;
    var labelerName = row.labeler_Name;
    var manufacureName = row.manufacure_Name;
    var manufacureAddress = row.manufacure_Address;
    var manufacureCountry = row.manufacure_Country;
    var patenNo = row.patent_No;
    var expirationDate = row.expiration_Date;
    var exclusivityDate = row.exclusivity_Date;
    var ndcCode = row.ndc_Code;
    var packaging = row.packaging;
    var imageName = row.imageName;
    var imageUrl = row.imageUrl;


    const dialogRef = this.dialog.open(DailymedDataDialogComponent, {
      data: {
        Year: year,
        ApprovalDate: approvalDate,
        ApplicationType: applicationType,
        ApplicationNumber: applicationNumber,
        TherapeuticEquivalents: therapeuticEquivalents,
        BrandName: brandName,
        RouteOfAdministration: routeOfAdministration,
        Dosage: dosage,
        TypeofDosageForm: typeofDosageForm,
        TypeOfRelease: typeOfRelease,
        ActiveIngredient: activeIngredient,
        ActiveUNIINumber: activeUNIINumber,
        ActiveStrength: activeStrength,
        InactiveIngredient: inactiveIngredient,
        InctiveUNIINumber: inctiveUNIINumber,
        InactiveStrength: inactiveStrength,
        TherapeuticCategory: therapeuticCategory,
        MarketingStatus: marketingStatus,
        MarketingStartDate: marketingStartDate,
        Category: category,
        Submission: submission,
        SubmissionType: submissionType,
        SubmissionStatus: submissionStatus,
        DunsNumber: dunsNumber,
        CompanyName: companyName,
        Subsidiaries: subsidiaries,
        Repackager: repackager,
        RegistrantName: registrantName,
        LabelerName: labelerName,
        ManufacureName: manufacureName,
        ManufacureAddress: manufacureAddress,
        ManufacureCountry: manufacureCountry,
        PatenNo: patenNo,
        ExpirationDate: expirationDate,
        ExclusivityDate: exclusivityDate,
        NdcCode: ndcCode,
        Packaging: packaging,
        ImageName: imageName,
        ImageUrl: imageUrl
      }
    })
  }



  previousResult() {
    this.ResultSkipedRows = (parseInt(this.ResultSkipedRows) - 250).toString()
    this.getResult()
  }
  nextResult() {
    this.ResultSkipedRows = (parseInt(this.ResultSkipedRows) + 250).toString()
    this.getResult()
  }

  getResult() {
    this.PrepareFilterQuery()
    const Payload = {
      fromApprovalDate: this.fromVal,
      toApprovalDate: this.toVal,
      patentExpirationDate: this.patentExpirationDateVal,
      patentExclusivityDate: this.patentExclusivityDateVal,
      typeOfRelease: this.typeOfReleaseVal,
      applicationType: this.applicationTypeVal,
      applicationNo: this.applicationNoVal,
      activeIngredient: this.activeIngredientVal,
      activeStrength: this.activeStrengthVal,
      activeUNIINumber: this.activeUniiVal,
      inActiveIngredient: this.inActiveIngredientVal,
      inActiveStrength: this.inActiveStrengthVal,
      inActiveUNIINumber: this.inActiveUniiVal,
      routeOfAdministration: this.routeOfAdministrationVal,
      dosageForm: this.dosageFormVal,
      marketingStatus: this.marketingStatusVal,
      manufacureName: this.manufacureNameVal,
      manufacureCountry: this.manufacureCountryVal,
      brandName: this.brandNameVal,
      ndcCode: this.ndcCodeVal,
      category: this.categoryVal,
      packaging: this.packagingVal,
      submission: this.submissionVal,
      submissionType: this.submissionTypeVal,
      submissionStatus: this.submissionStatusVal,
      patentNo: this.patentNoVal,
      therapeuticCategory: this.therapeuticCategoryVal,
      companyName: this.companyNameVal,
      resultSkipedRows: this.ResultSkipedRows
    }



    this.apiService.ssoPost('home/filter', Payload)
      .subscribe((data: any) => {
        if (data.statusCode === "200" && data.result) {
          this.resultDataSource.data = data.result;
          this.TotalCount = data.TotalCount;
          this.resultDataSource.paginator = this.paginator;
          this.resultDataSource.sort = this.sort;
          this.exportButton = true;
          this.addInd = false;
          this.cancelbtn = false;
          this.addbtn = true;
        } else {
          this.toastMsg.error(data.message, "Error!")
        }
      }, (err: any) => {
        // console.log(err)
        this.toastMsg.error(err, "Error!")
      });

  }

  PrepareFilterQuery() {



    if (this.DailyMedReportForm.controls.From.value == null || this.DailyMedReportForm.controls.From.value == undefined) {
      this.fromVal = '';
    }
    else {
      this.fromVal = this.DailyMedReportForm.controls.From.value;
    }
    if (this.DailyMedReportForm.controls.To.value == null || this.DailyMedReportForm.controls.To.value == undefined) {
      this.toVal = '';
    }
    else {
      this.toVal = this.DailyMedReportForm.controls.To.value;
    }

    if (this.DailyMedReportForm.controls.patentExpirationDate.value == null || this.DailyMedReportForm.controls.patentExpirationDate.value == undefined) {
      this.patentExpirationDateVal = '';
    }
    else {
      this.patentExpirationDateVal = this.DailyMedReportForm.controls.patentExpirationDate.value;
    }

    if (this.DailyMedReportForm.controls.patentExclusivityDate.value == null || this.DailyMedReportForm.controls.patentExclusivityDate.value == undefined) {
      this.patentExclusivityDateVal = '';
    }
    else {
      this.patentExclusivityDateVal = this.DailyMedReportForm.controls.patentExclusivityDate.value;
    }

    if (this.DailyMedReportForm.controls.typeOfReleasedropdown.value == null || this.DailyMedReportForm.controls.typeOfReleasedropdown.value == undefined) {
      this.typeOfReleaseVal = '';
    }
    else {
      var input = this.DailyMedReportForm.controls.typeOfReleasedropdown.value[0].typeOfRelease;
      for (var i = 1; i < this.DailyMedReportForm.controls.typeOfReleasedropdown.value.length; i++) {
        input = input + ',' + this.DailyMedReportForm.controls.typeOfReleasedropdown.value[i].typeOfRelease
      }
      this.typeOfReleaseVal = input;
    }

    if (this.DailyMedReportForm.controls.typeOfApplicationdropdown.value == null || this.DailyMedReportForm.controls.typeOfApplicationdropdown.value == undefined) {
      this.applicationTypeVal = '';
    }
    else {
      var input = this.DailyMedReportForm.controls.typeOfApplicationdropdown.value[0].applicationType;
      for (var i = 1; i < this.DailyMedReportForm.controls.typeOfApplicationdropdown.value.length; i++) {
        input = input + ',' + this.DailyMedReportForm.controls.typeOfApplicationdropdown.value[i].applicationType
      }
      this.applicationTypeVal = input;
    }

    if (this.DailyMedReportForm.controls.applicationNodropdown.value == null || this.DailyMedReportForm.controls.applicationNodropdown.value == undefined) {
      this.applicationNoVal = '';
    }
    else {
      this.applicationNoVal = this.DailyMedReportForm.controls.applicationNodropdown.value;
    }

    if (this.DailyMedReportForm.controls.activeIngredientdropdown.value == null || this.DailyMedReportForm.controls.activeIngredientdropdown.value == undefined) {
      this.activeIngredientVal = '';
    }
    else {
      this.activeIngredientVal = this.DailyMedReportForm.controls.activeIngredientdropdown.value;
    }

    if (this.DailyMedReportForm.controls.activeStrengthdropdown.value == null || this.DailyMedReportForm.controls.activeStrengthdropdown.value == undefined) {
      this.activeStrengthVal = '';
    }
    else {
      this.activeStrengthVal = this.DailyMedReportForm.controls.activeStrengthdropdown.value;
    }

    if (this.DailyMedReportForm.controls.activeUniidropdown.value == null || this.DailyMedReportForm.controls.activeUniidropdown.value == undefined) {
      this.activeUniiVal = '';
    }
    else {
      this.activeUniiVal = this.DailyMedReportForm.controls.activeUniidropdown.value;
    }

    if (this.DailyMedReportForm.controls.inActiveIngredientdropdown.value == null || this.DailyMedReportForm.controls.inActiveIngredientdropdown.value == undefined) {
      this.inActiveIngredientVal = '';
    }
    else {
      this.inActiveIngredientVal = this.DailyMedReportForm.controls.inActiveIngredientdropdown.value;
    }

    if (this.DailyMedReportForm.controls.inActiveStrengthdropdown.value == null || this.DailyMedReportForm.controls.inActiveStrengthdropdown.value == undefined) {
      this.inActiveStrengthVal = '';
    }
    else {
      this.inActiveStrengthVal = this.DailyMedReportForm.controls.inActiveStrengthdropdown.value;
    }

    if (this.DailyMedReportForm.controls.inActiveUniidropdown.value == null || this.DailyMedReportForm.controls.inActiveUniidropdown.value == undefined) {
      this.inActiveUniiVal = '';
    }
    else {
      this.inActiveUniiVal = this.DailyMedReportForm.controls.inActiveUniidropdown.value;
    }

    if (this.DailyMedReportForm.controls.routeOfAdministrationdropdown.value == null || this.DailyMedReportForm.controls.routeOfAdministrationdropdown.value == undefined) {
      this.routeOfAdministrationVal = '';
    }
    else {
      this.routeOfAdministrationVal = this.DailyMedReportForm.controls.routeOfAdministrationdropdown.value;
    }

    if (this.DailyMedReportForm.controls.dosageFormdropdown.value == null || this.DailyMedReportForm.controls.dosageFormdropdown.value == undefined) {
      this.dosageFormVal = '';
    }
    else {
      var input = this.DailyMedReportForm.controls.dosageFormdropdown.value[0].dosageForm;
      for (var i = 1; i < this.DailyMedReportForm.controls.dosageFormdropdown.value.length; i++) {
        input = input + ',' + this.DailyMedReportForm.controls.dosageFormdropdown.value[i].dosageForm
      }
      this.dosageFormVal = input;
    }

    if (this.DailyMedReportForm.controls.marketingStatusdropdown.value == null || this.DailyMedReportForm.controls.marketingStatusdropdown.value == undefined) {
      this.marketingStatusVal = '';
    }
    else {
      var input = this.DailyMedReportForm.controls.marketingStatusdropdown.value[0].marketingStatus;
      for (var i = 1; i < this.DailyMedReportForm.controls.marketingStatusdropdown.value.length; i++) {
        input = input + ',' + this.DailyMedReportForm.controls.marketingStatusdropdown.value[i].marketingStatus
      }
      this.marketingStatusVal = input;
    }

    if (this.DailyMedReportForm.controls.manufacureNamedropdown.value == null || this.DailyMedReportForm.controls.manufacureNamedropdown.value == undefined) {
      this.manufacureNameVal = '';
    }
    else {
      this.manufacureNameVal = this.DailyMedReportForm.controls.manufacureNamedropdown.value;
    }

    if (this.DailyMedReportForm.controls.manufacureCountrydropdown.value == null || this.DailyMedReportForm.controls.manufacureCountrydropdown.value == undefined) {
      this.manufacureCountryVal = '';
    }
    else {
      this.manufacureCountryVal = this.DailyMedReportForm.controls.manufacureCountrydropdown.value;
    }

    if (this.DailyMedReportForm.controls.brandNamedropdown.value == null || this.DailyMedReportForm.controls.brandNamedropdown.value == undefined) {
      this.brandNameVal = '';
    }
    else {
      this.brandNameVal = this.DailyMedReportForm.controls.brandNamedropdown.value;
    }

    if (this.DailyMedReportForm.controls.ndcCodedropdown.value == null || this.DailyMedReportForm.controls.ndcCodedropdown.value == undefined) {
      this.ndcCodeVal = '';
    }
    else {
      this.ndcCodeVal = this.DailyMedReportForm.controls.ndcCodedropdown.value;
    }

    if (this.DailyMedReportForm.controls.categorydropdown.value == null || this.DailyMedReportForm.controls.categorydropdown.value == undefined) {
      this.categoryVal = '';
    }
    else {
      this.categoryVal = this.DailyMedReportForm.controls.categorydropdown.value;
    }

    if (this.DailyMedReportForm.controls.packagingdropdown.value == null || this.DailyMedReportForm.controls.packagingdropdown.value == undefined) {
      this.packagingVal = '';
    }
    else {
      this.packagingVal = this.DailyMedReportForm.controls.packagingdropdown.value;
    }

    if (this.DailyMedReportForm.controls.submissiondropdown.value == null || this.DailyMedReportForm.controls.submissiondropdown.value == undefined) {
      this.submissionVal = '';
    }
    else {
      this.submissionVal = this.DailyMedReportForm.controls.submissiondropdown.value;
    }

    if (this.DailyMedReportForm.controls.submissionTypedropdown.value == null || this.DailyMedReportForm.controls.submissionTypedropdown.value == undefined) {
      this.submissionTypeVal = '';
    }
    else {
      this.submissionTypeVal = this.DailyMedReportForm.controls.submissionTypedropdown.value;
    }

    if (this.DailyMedReportForm.controls.submissionStatusdropdown.value == null || this.DailyMedReportForm.controls.submissionStatusdropdown.value == undefined) {
      this.submissionStatusVal = '';
    }
    else {
      this.submissionStatusVal = this.DailyMedReportForm.controls.submissionStatusdropdown.value;
    }

    if (this.DailyMedReportForm.controls.patentNodropdown.value == null || this.DailyMedReportForm.controls.patentNodropdown.value == undefined) {
      this.patentNoVal = '';
    }
    else {
      this.patentNoVal = this.DailyMedReportForm.controls.patentNodropdown.value;
    }


    if (this.DailyMedReportForm.controls.therapeuticCategory.value == null || this.DailyMedReportForm.controls.therapeuticCategory.value == undefined) {
      this.therapeuticCategoryVal = '';
    }
    else {
      this.therapeuticCategoryVal = this.DailyMedReportForm.controls.therapeuticCategory.value;
    }

    if (this.DailyMedReportForm.controls.companyName.value == null || this.DailyMedReportForm.controls.companyName.value == undefined) {
      this.companyNameVal = '';
    }
    else {
      this.companyNameVal = this.DailyMedReportForm.controls.companyName.value;
    }



  }

  RowsValue(numRows: string) {
    this.numberOfRows = numRows
  }

  syncOfflineData() {
    this.http.post(`${environment.apiBaseUrl}home/syncOfflineData`, null)
      .subscribe(data => {
        this.toastMsg.success(data['message']);
        this.getResult();
      }, err => {
        this.toastMsg.error(err, "Error!");
      });
  }

  exportResult() {

    this.PrepareFilterQuery()
    const Payload = {
      fromApprovalDate: this.fromVal,
      toApprovalDate: this.toVal,
      patentExpirationDate: this.patentExpirationDateVal,
      patentExclusivityDate: this.patentExclusivityDateVal,
      typeOfRelease: this.typeOfReleaseVal,
      applicationType: this.applicationTypeVal,
      applicationNo: this.applicationNoVal,
      activeIngredient: this.activeIngredientVal,
      activeStrength: this.activeStrengthVal,
      activeUNIINumber: this.activeUniiVal,
      inActiveIngredient: this.inActiveIngredientVal,
      inActiveStrength: this.inActiveStrengthVal,
      inActiveUNIINumber: this.inActiveUniiVal,
      routeOfAdministration: this.routeOfAdministrationVal,
      dosageForm: this.dosageFormVal,
      marketingStatus: this.marketingStatusVal,
      manufacureName: this.manufacureNameVal,
      manufacureCountry: this.manufacureCountryVal,
      brandName: this.brandNameVal,
      ndcCode: this.ndcCodeVal,
      category: this.categoryVal,
      packaging: this.packagingVal,
      submission: this.submissionVal,
      submissionType: this.submissionTypeVal,
      submissionStatus: this.submissionStatusVal,
      patentNo: this.patentNoVal,
      therapeuticCategory: this.therapeuticCategoryVal,
      companyName: this.companyNameVal,
      numberOfRows: '',
      skipRows: '',
    }

    if (this.numberOfRows != '' && parseInt(this.TotalCount) > parseInt(this.numberOfRows)) {
      for (var i = 0; i <= parseInt(this.TotalCount); i = i + parseInt(this.numberOfRows)) {
        Payload.numberOfRows = this.numberOfRows;
        Payload.skipRows = i.toString();
        if (i < parseInt(this.TotalCount)) {
          this.http.post(`${environment.apiBaseUrl}home/export`, Payload, { responseType: 'blob' })
            .subscribe(data => {
              this.downLoadFile(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8");
            }, err => {
              this.toastMsg.error(err, "Error!");
            });
        }
      }
    }
    else {
      this.http.post(`${environment.apiBaseUrl}home/export`, Payload, { responseType: 'blob' })
        .subscribe(data => {
          this.downLoadFile(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8");
        }, err => {
          this.toastMsg.error(err, "Error!");
        });
    }
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let date: Date = new Date();

    FileSaver.saveAs(blob, `DailyMedData.xlsx`);
  }
}


//const ELEMENT_DATA: PeriodicElement[] = [
//  { year: '2019', approvalDate: '20/5/2019', NDAANDABLA: 'NDA', applicationNumber: 234566, brandName: 'DRISDOL', routeOfAdministration: 'ORAL', dosage: 'CAPSULE', typeofDosageForm: 'FOR SUSPENSION', typeOfRelease: 'EXTENDED RELEASE', therapeuticCategory: 'Promethazine hydrochloride and phenylephrine hydrochloride syrup', marketingStatus: 'Prescription'},
//  { year: '2020', approvalDate: '20/5/2020', NDAANDABLA: 'ANDA', applicationNumber: 890076, brandName: 'Artesunate', routeOfAdministration: 'TOPICAL', dosage: 'CREAM', typeofDosageForm: 'FILM COATED', typeOfRelease: 'DELAYED RELEASE', therapeuticCategory: 'Promethazine hydrochloride and phenylephrine hydrochloride syrup', marketingStatus: 'Over-the-counter'},
//  { year: '2021', approvalDate: '20/5/2021', NDAANDABLA: 'BLA', applicationNumber: 234588, brandName: 'Nabumetone', routeOfAdministration: 'PARENTERAL', dosage: 'KIT', typeofDosageForm: 'FILM COATED', typeOfRelease: 'EXTENDED RELEASE', therapeuticCategory: 'Promethazine hydrochloride and phenylephrine hydrochloride syrup', marketingStatus: 'Prescription'},
//];

