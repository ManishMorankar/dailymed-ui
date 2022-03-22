import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ApiService } from '../services/api.service'
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private apiService: ApiService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log("Error Interceptor ", err)
            if (err.statusCode == 401 || err.status === 401) {
                // auto logout if 401 response returned from api
                //this.apiService.logout();
                // location.reload(true);
                //this.router.navigate(['/'])
                // if(this.apiService.getToken())
                //     this.apiService.openLogin()
                this.apiService.getLatestToken();
                return throwError("Token out of sync, please try again");
            }else{
                this.apiService.closeLogin()
            }
            //this.apiService.hideLoader = true;
            const error = err.error.message || err.error.title || err.statusText;
            return throwError(error);
        }))
    }
}