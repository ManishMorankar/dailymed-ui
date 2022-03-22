import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MsalUserService } from './msaluser.service';
import { dailyMedData } from '../model/dailyMed-data.model';
import { ApiResponse } from './api.response';
export class DailyMedDataService {
  //private url = environment.pythonbaseUrl;
  
    constructor(private http: HttpClient) { }
    //getDailyMedData(): Observable<ApiResponse> {
    //return this.http.get<ApiResponse>(this.url + 'home/index/');
   //}
  





















}
