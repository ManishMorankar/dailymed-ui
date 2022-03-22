import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoBox } from './model/infobox.model';
import { ToastrService } from 'ngx-toastr';
import { stringify } from 'querystring';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { TableFilterPipe } from '../../pipe/table-filter.pipe';
import { DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { ExportService } from 'src/app/services/export.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { IDocumentNumberStyle } from '../../model/document-number-style';
import { ApiResponse } from '../../services/api.response';
import { environment } from '../../../environments/environment';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-legalAdmin-dashboard',
  templateUrl: './legalAdmin-dashboard.component.html',
  styleUrls: ['./legalAdmin-dashboard.component.css']
})
export class LegalAdminDashboardComponent implements OnInit {
  @ViewChild('table1', { read: MatSort, static: true }) sort1: MatSort;
  @ViewChild('table2', { read: MatSort, static: true }) sort2: MatSort;
  @ViewChild('table3', { read: MatSort, static: true }) sort3: MatSort;
  @ViewChild('table4', { read: MatSort, static: true }) sort4: MatSort;
  @ViewChild('table5', { read: MatSort, static: true }) sort5: MatSort;

  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('paginator3', { static: true }) paginator3: MatPaginator;
  @ViewChild('paginator4', { static: true }) paginator4: MatPaginator;
  @ViewChild('paginator5', { static: true }) paginator5: MatPaginator;
  @Input() loginUser: any = {}
  infoBox: InfoBox = {
    skyblueInfo: { name: "", number: 0 },
    blueInfo: { name: "", number: 0 },
    greenInfo: { name: "", number: 0 },
    greyInfo: { name: "", number: 0 }
  };

  tabPosition: number = 0;

  tabName: string = "Contributed Document";
  getRepsWithPlans: any;
  getRepsWithoutPlans: any;
  getPlans: any;
  originalRepsWithPlans: any;
  originalRepsWithoutPlans: any;
  originalPlans: any;
  dataSourceRepsWithPlans;
  dataSourceRepsWithoutPlans;
  dataSourcePlans;

  originalMyTaskList: any;
  originalContributorList: any;
  originalApproverList: any;
  originalReaderList: any;


  displayedColumnsMyTaskPlans = [];
  displayedColumnsRepsWithPlans = [];
  displayedColumnsRepsWithoutPlans = [];
  displayedColumnsApproverDoc = [];
  displayedColumnsReaderDoc = [];
  displayedColumnsPlans = [];

  columnNamesMyTaskDocument = [{
    id: "projectType",
    value: "Project Type"
  },
  {
    id: "projectNameId",
    value: "Project Name"
  }, {
    id: "projectOwnerId",
    value: "Project Owner"
  },

  {
    id: "documentTitle",
    value: "Document Title"
  },
  {
    id: "projectStartDate",
    value: "Project Start Date"
  },

  {
    id: "projectDueDate",
    value: "Project Due Date"
  },
  {
    id: "documentTypeId",
    value: "Document Type"
  },

  {
    id: "documentStartDate",
    value: "Document Start Date"
  },
  {
    id: "documentDueDate",
    value: "Document Due Date"
  },
  {
    id: "docId",
    value: "View"
  },
  {
    id: "docIdedit",
    value: "Action"
  }
  ];
  columnNamesContributorsDocument = [
    {
      id: "projectType",
      value: "Project Type"
    },
    {
      id: "projectNameId",
      value: "Project Name"
    }, {
      id: "projectOwnerId",
      value: "Project Owner"
    },
    {
      id: "documentTitle",
      value: "Document Title"
    },

    {
      id: "projectStartDate",
      value: "Project Start Date"
    },

    {
      id: "projectDueDate",
      value: "Project Due Date"
    },
    {
      id: "documentTypeId",
      value: "Document Type"
    },

    {
      id: "documentStartDate",
      value: "Document Start Date"
    },
    {
      id: "documentDueDate",
      value: "Document Due Date"
    },
    {
      id: "docId",
      value: "View"
    },
    {
      id: "docIdedit",
      value: "Action"
    }
  ];
  columnNamesApproversDocument = [{
    id: "projectType",
    value: "Project Type"
  },
  {
    id: "projectNameId",
    value: "Project Name"
  }, {
    id: "projectOwnerId",
    value: "Project Owner"
  },
  {
    id: "documentTitle",
    value: "Document Title"
  },
  {
    id: "projectStartDate",
    value: "Project Start Date"
  },

  {
    id: "projectDueDate",
    value: "Project Due Date"
  },
  {
    id: "documentTypeId",
    value: "Document Type"
  },
  {
    id: "documentStartDate",
    value: "Document Start Date"
  },
  {
    id: "documentDueDate",
    value: "Document Due Date"
  },
  {
    id: "departmentId",
    value: "Department"
  },
  {
    id: "docId",
    value: "View"
  },
  {
    id: "docIdedit",
    value: "Action"
  }

  ];
  columnNamesReaderDocument = [
    {
      id: "projectType",
      value: "Project Type"
    },
    {
      id: "projectNameId",
      value: "Project Name"
    }, {
      id: "projectOwnerId",
      value: "Project Owner"
    },

    {
      id: "documentTitle",
      value: "Document Title"
    },
    {
      id: "projectStartDate",
      value: "Project Start Date"
    },

    {
      id: "projectDueDate",
      value: "Project Due Date"
    },
    {
      id: "documentTypeId",
      value: "Document Type"
    },

    {
      id: "documentStartDate",
      value: "Document Start Date"
    },
    {
      id: "documentDueDate",
      value: "Document Due Date"
    },
    {
      id: "departmentId",
      value: "Department"
    },
    {
      id: "docId",
      value: "View"
    }
  ];
  mytaskDataSource: any;
  documentContributorsDataSource: any;
  documentApproversDataSource: any;
  documentReaderDataSource: any;
  dropdowns: any;


  constructor(public apiService: ApiService, private toastMsg: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private pipe: TableFilterPipe,
    private datePipe: DatePipe, private percentPipe: PercentPipe, private currencyPipe: CurrencyPipe, private exportService: ExportService, private http: HttpClient) {

    this.apiService.hideLoader = true;
    localStorage.setItem('href', window.location.href);

    this.infoBox = {
      skyblueInfo: { name: "", number: 0 },
      blueInfo: { name: "", number: 0 },
      greenInfo: { name: "", number: 0 },
      greyInfo: { name: "", number: 0 }
    };
  }

  ngOnInit() {
    this.getBoxValue();
    this.getDropdowns();
    //if (!this.apiService.checkPermission('ViewLegalDashboard')) {
    //  this.router.navigate(['/unauthorized']);
    //}
    // this.getData();
    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }
    this.getAllDocumentData();

    this.documentContributorsDataSource = new MatTableDataSource(this.documentContributorsDataSource);
    this.documentContributorsDataSource.paginator = this.paginator1;
    this.documentContributorsDataSource.sort = this.sort1;

    this.documentApproversDataSource = new MatTableDataSource(this.documentApproversDataSource);
    this.documentApproversDataSource.paginator = this.paginator2;
    this.documentApproversDataSource.sort = this.sort2;

    this.documentReaderDataSource = new MatTableDataSource(this.documentReaderDataSource);
    this.documentReaderDataSource.paginator = this.paginator3;
    this.documentReaderDataSource.sort = this.sort3;

    this.mytaskDataSource = new MatTableDataSource(this.mytaskDataSource);
    this.mytaskDataSource.paginator = this.paginator4;
    this.mytaskDataSource.sort = this.sort4;

  }
  getAllDocumentData() {
    let params = new HttpParams();
    params = params.append('EmpId', this.loginUser.empId + "");
    this.http.get<ApiResponse>(`${environment.apiBaseUrl}Dashboard/GetMyTaskDocument`, { params: params })
      .subscribe((response: any) => {
        let data = response.result
        this.infoBox.skyblueInfo.number = data ? data.length : 0;
        this.mytaskDataSource.data = data;
        this.mytaskDataSource.paginator = this.paginator4;
        this.displayedColumnsMyTaskPlans = this.columnNamesMyTaskDocument.map(x => x.id);
        this.createTableRepsWithPlansMyTask();

      }, err => {
        this.toastMsg.error(err, "Error!");
      });


    this.http.get<ApiResponse>(`${environment.apiBaseUrl}Dashboard/GetContributorDocument`, { params: params })
      .subscribe((response: any) => {
        let data = response.result
        this.infoBox.blueInfo.number = data ? data.length : 0;
        this.documentContributorsDataSource.data = data;
        this.documentContributorsDataSource.paginator = this.paginator1;
        this.displayedColumnsRepsWithPlans = this.columnNamesContributorsDocument.map(x => x.id);
        this.createTableRepsWithPlansContributor();

      }, err => {
        this.toastMsg.error(err, "Error!");
      });

    this.http.get<ApiResponse>(`${environment.apiBaseUrl}Dashboard/GetApproversDocument`, { params: params })
      .subscribe((response: any) => {
        let data = response.result
        this.infoBox.greenInfo.number = data ? data.length : 0;
        this.documentApproversDataSource.data = data;
        this.documentApproversDataSource.paginator = this.paginator2;
        this.displayedColumnsApproverDoc = this.columnNamesApproversDocument.map(x => x.id);
        this.createTableRepsWithPlansApprovers();

      }, err => {
        this.toastMsg.error(err, "Error!");
      });
    this.http.get<ApiResponse>(`${environment.apiBaseUrl}Dashboard/GetReaderDocument`, { params: params })
      .subscribe((response: any) => {
        let data = response.result;
        this.infoBox.greyInfo.number = data ? data.length : 0;
        this.documentReaderDataSource.data = data;
        this.documentReaderDataSource.paginator = this.paginator3;
        this.displayedColumnsReaderDoc = this.columnNamesReaderDocument.map(x => x.id);
        this.createTableRepsWithPlansReader();
      }, err => {
        this.toastMsg.error(err, "Error!");
      });
  }
  getBoxValue() {
    this.infoBox.skyblueInfo = { name: "My Task", number: 0 };
    this.infoBox.blueInfo = { name: "Contributed Document", number: 0 };
    this.infoBox.greenInfo = { name: "Document For Approveing", number: 0 };
    this.infoBox.greyInfo = { name: "Document For Reading", number: 0 };
  }

  viewDocument(event: any) {
    localStorage.setItem('ViewDocument', JSON.stringify(event))
    this.router.navigateByUrl(`/ui/view-document/${event.docId}`);
  }
  editDocument(event: any) {
    console.log("Evevent", event);
    console.log('docId', event)
    localStorage.setItem('EditDocument', JSON.stringify(event))
    this.router.navigateByUrl(`/ui/edit-document/${event.docId}`);
  }
  findProjectName(id: number) {
    var filter_array = this.dropdowns.projects.filter(x => x.id == id);
    return filter_array[0].code;
  }
  findDocumentType(id: number) {
    var filter_array = this.dropdowns.documentTypes.filter(x => x.id == id);
    return filter_array[0].code;
  }
  findDept(id: number) {
    var filter_array = this.dropdowns.Department.filter(x => x.id == id);
    return filter_array[0].code;
  }
  findUser(id: number) {
    var filter_array = this.dropdowns.users.filter(x => x.code == id);
    return filter_array[0].description;
  }
  getDropdowns() {
    this.apiService.get('document/dropdowns')
      .subscribe(data => {
        this.dropdowns = data;
      }, (err: any) => {
        this.toastMsg.error(err, 'Server Error!');
      });
  }

  createTableRepsWithPlansMyTask() {
    let tableArrTask: documentDTO[] = [];
    for (let i: number = 0; i <= this.documentContributorsDataSource.data.length; i++) {
      let currentRow = this.documentContributorsDataSource[i];
      tableArrTask.push({
        projectType: currentRow.projectType, projectNameId: currentRow.projectNameId, projectStartDate: currentRow.projectStartDate, projectDueDate: currentRow.projectDueDate, documentTypeId: currentRow.documentTypeId, documentStartDate: currentRow.documentStartDate, documentDueDate: currentRow.documentDueDate, departmentId: currentRow.departmentId, projectOwnerId: currentRow.projectOwnerId, docId: currentRow.docId, docIdedit: currentRow.docId, documentTitle: currentRow.documentTitle
      });
    }
    this.mytaskDataSource = new MatTableDataSource(tableArrTask);
    this.mytaskDataSource.sort = this.sort4;
    this.mytaskDataSource.paginator = this.paginator4;
    this.originalMyTaskList = tableArrTask;

  }
  createTableRepsWithPlansContributor() {
    let tableArr: documentDTO[] = [];
    for (let i: number = 0; i <= this.documentContributorsDataSource.data.length; i++) {
      let currentRow = this.documentContributorsDataSource[i];
      tableArr.push({
        projectType: currentRow.projectType, projectNameId: currentRow.projectNameId, projectStartDate: currentRow.projectStartDate, projectDueDate: currentRow.projectDueDate, documentTypeId: currentRow.documentTypeId, documentStartDate: currentRow.documentStartDate, documentDueDate: currentRow.documentDueDate, departmentId: currentRow.departmentId, projectOwnerId: currentRow.projectOwnerId, docId: currentRow.docId, docIdedit: currentRow.docId, documentTitle: currentRow.documentTitle
      });
    }
    this.documentContributorsDataSource = new MatTableDataSource(tableArr);
    this.documentContributorsDataSource.sort = this.sort1;
    this.documentContributorsDataSource.paginator = this.paginator1;
    this.originalContributorList = tableArr;

  }
  createTableRepsWithPlansApprovers() {
    let tableArr: documentDTO[] = [];
    this.infoBox.greenInfo.number = this.documentApproversDataSource.data.length;
    for (let i: number = 0; i <= this.documentApproversDataSource.data.length; i++) {
      let currentRow = this.documentApproversDataSource[i];
      tableArr.push({
        projectType: currentRow.projectType, projectNameId: currentRow.projectNameId, projectStartDate: currentRow.projectStartDate, projectDueDate: currentRow.projectDueDate, documentTypeId: currentRow.documentTypeId, documentStartDate: currentRow.documentStartDate, documentDueDate: currentRow.documentDueDate, departmentId: currentRow.departmentId, projectOwnerId: currentRow.projectOwnerId, docId: currentRow.docId, docIdedit: currentRow.docId, documentTitle: currentRow.documentTitle
      });
    }
    this.documentApproversDataSource = new MatTableDataSource(tableArr);
    this.documentApproversDataSource.sort = this.sort2;
    this.documentApproversDataSource.paginator = this.paginator2;
    this.originalApproverList = tableArr;
  }
  createTableRepsWithPlansReader() {
    let tableArrPlan: documentDTO[] = [];
    for (let i: number = 0; i <= this.documentReaderDataSource.data.length; i++) {
      let currentRow = this.documentReaderDataSource[i];
      tableArrPlan.push({
        projectType: currentRow.projectType, projectNameId: currentRow.projectNameId, projectStartDate: currentRow.projectStartDate, projectDueDate: currentRow.projectDueDate, documentTypeId: currentRow.documentTypeId, documentStartDate: currentRow.documentStartDate, documentDueDate: currentRow.documentDueDate, departmentId: currentRow.departmentId, projectOwnerId: currentRow.projectOwnerId, docId: currentRow.docId, docIdedit: currentRow.docId, documentTitle: currentRow.documentTitle
      });
    }
    this.documentReaderDataSource = new MatTableDataSource(tableArrPlan);
    this.documentReaderDataSource.paginator = this.paginator3;
    this.documentReaderDataSource.sort = this.sort3;
    this.originalReaderList = tableArrPlan;
  }

  moveToSelectedTab(tabName: string) {
    this.tabName = tabName;
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

}


export interface documentDTO {
  projectType: string;
  projectNameId: number;
  projectStartDate: DatePipe;
  projectDueDate: DatePipe;
  documentTypeId: number;
  documentStartDate: DatePipe;
  documentDueDate: DatePipe;
  departmentId: number;
  projectOwnerId: number;
  docId: number;
  docIdedit: number;
  documentTitle: string;
}


