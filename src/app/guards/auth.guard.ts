import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service'
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private apiService: ApiService, private dataService: DataService
) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean { {
    if (this.apiService.isLoggedIn()) {
        // authorised so return true
        return true;
    }
      // not logged in so redirect to login page with the return url
      // this.router.navigate(['login']);
      this.dataService.logout();
      return false;
    }
  }
}

