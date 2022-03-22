import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs/index";
import { ApiResponse } from "../services/api.response";
import { environment } from "../../environments/environment"
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { DatePipe, Location } from '@angular/common';
import { Cacheable } from 'ngx-cacheable';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './data.service';

@Injectable()
export class ApiService {

  hideLoader: boolean = false;
  //title: String = 'Welcome Trinity Central Systems';

  /**
   * Handle global loading spinner when Http request happen
   */
  isLoading = new Subject<boolean>();
  show() {
    this.isLoading.next(true);
  }
  hide() {
    this.isLoading.next(false);
  }

  /**
   * Token Expired
   */
  isTokenExpired = new BehaviorSubject(false);
  openLogin() {
    this.isTokenExpired.next(true);
  }
  closeLogin() {
    this.isTokenExpired.next(false);
  }

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe, private location: Location, private toastMsg: ToastrService, private dataService: DataService) { }
  //Commission system rest api base url
  baseUrl: string = environment.apiBaseUrl;
  //SSO rest api base url
  ssoBaseUrl: string = environment.ssoBaseUrl;
  workflowBaseUrl: string = environment.workflowBaseUrl;

  /**
   * Handle all the POST requests
   * @param url
   * @param postBody
   */
  post(url: any, postBody: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl + url, postBody)
  }

  /**
   * Handle all the PUT requests
   * @param url
   * @param postBody
   */
  put(url: any, postBody: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + url, postBody)
  }

  /**
   * Handle all the GET requests
   * @param url
   */
  // @Cacheable()
  get(url: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + url)
  }


  /**
   * Handle all the DELETE requests
   * @param url
   */
  delete(url: any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + url)
  }

  /**
   * Handle SSO POST requests
   * @param url
   * @param postBody
   */
  ssoPost(url: any, postBody: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.ssoBaseUrl + url, postBody)
  }

  /**
   * Handle SSO GET requests
   * @param url
   */
  ssoGet(url: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.ssoBaseUrl + url)
  }

  /**
   * Handle SSO PUT requests
   * @param url
   * @param postBody
   */
  ssoPut(url: any, postBody: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.ssoBaseUrl + url, postBody)
  }

  /**
   * Get the auth token
   */
  getToken() {
    return localStorage.getItem("token")
  }

  /**
   * Get the show menu 
   */
  showMenu() {
    if (localStorage.getItem("showMenu") == "true") {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get the authenticated user name
   */
  getUserName() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser != null) {
      return currentUser.userName;
    }
  }

  /**
   * Returns the user logged in or not
   */
  isLoggedIn() {
    return this.getToken() !== null;
  }

  /**
   * Get the authenticated user data
   */
  getUserObj() {
    return JSON.parse(localStorage.getItem("currentUser"))
  }

  /**
   * Get the authenticated user Role
   */
  getRole() {
    return localStorage.getItem('role');
  }

  getLatestToken() {
    this.get(`Authentication/Token/${localStorage.getItem('UserID')}`)
      .subscribe(data => {
        if (data && data.result) {
          localStorage.setItem('token', data.result);
        }
      }, (err: any) => {
          this.toastMsg.error("Incorrect username or password.", "Error");
      })
  }

  /**
   * Clear all the local storage information
   */
  logout() {
    const body = {
      email: localStorage.getItem("UserID")
    };

    this.post('auth/logout', body)
      .subscribe(data => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("UserID");
        localStorage.clear();
        this.dataService.logout();
        this.router.navigate(['/login']);
      }, err => {
        this.toastMsg.error("There was an error while logging out.", "Error");
      })
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    localStorage.clear();
  }

  /**
   * Make the string first letter as capitalize
   * @param str
   */
  capitalize(str: String) {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * Date format
   */
  dateFormat(dateStr: string, format = "M/dd/yyyy") {
    return this.datePipe.transform(dateStr, format);
  }

  /**
   * Encypted
   */
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.secretKey).toString();
    } catch (e) {
      // console.log(e);
    }
  }

  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, environment.secretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      // console.log(e);
    }
  }

  /**
   * Check module level permission
   */
  checkPermission(feature: string) {
    let capabilities = localStorage.getItem('permissions')
    let decryptCaps = this.decryptData(capabilities)
    // console.log("Permission", feature, decryptCaps);
    if (decryptCaps && decryptCaps.indexOf(feature) !== -1) {
      return true
    } else {
      return false
    }
  }

  /**
   * Get Contact ID
   */
  getContactId() {
    return localStorage.getItem("cid")
  }

  goBack() {
    this.location.back();
  }

}
