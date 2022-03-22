import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import { finalize } from "rxjs/operators";
import {Injectable} from "@angular/core";
import { ApiService } from "./api.service";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(private apiService: ApiService){}
  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
        this.requests.splice(i, 1);
    }
    this.apiService.hide();
  }
  /**
   * Handle all the Http requests headers data
   * @param req 
   * @param next 
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log("Req Url", req.method)
    let token = this.apiService.getToken();
    if(!req.url.includes('OnDemand')){
      this.apiService.show();
      this.requests.push(req);
    }
    
    if (token) {
      req = req.clone({
        setHeaders: {
          token: token
        }
      });
    }
    return next.handle(req).pipe(finalize(() => {
      if(!req.url.includes('OnDemand')){
        this.removeRequest(req);
      }
    }));
  }
}
