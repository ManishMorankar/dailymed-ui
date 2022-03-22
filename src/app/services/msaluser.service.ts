import { Injectable } from '@angular/core';
import * as Msal from 'msal';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class MsalUserService {
    private accessToken: any;
    public clientApplication: Msal.UserAgentApplication = null;
    constructor() {
        // this.clientApplication = new Msal.UserAgentApplication(
        //     environment.uiClienId, 
        //     'https://login.microsoftonline.com/' + environment.tenantId,
        //     this.authCallback,
        //     {
        //         storeAuthStateInCookie: true,

        //         cacheLocation: 'localStorage' ,
        //     });            
    }

    public GetAccessToken(): Observable<any> {
        if (sessionStorage.getItem('msal.idtoken') !== undefined && sessionStorage.getItem('msal.idtoken') != null) {
            this.accessToken = sessionStorage.getItem('msal.idtoken');
        }
        return this.accessToken;
    }

    public authCallback(errorDesc, token, error, tokenType) {
        if (token) {
            localStorage.setItem('ADtoken', sessionStorage.getItem('msal.idtoken'));
            localStorage.setItem('IsLogout', 'NO');
        } else {
            console.log(error + ':' + errorDesc);
        }
    }

    public getCurrentUserInfo() {

        if (this.clientApplication.getUser() != null) {
            // const user = this.clientApplication.getUser();        
            // alert(user.displayableId);
            localStorage.setItem('UserID', this.clientApplication.getUser().displayableId);
            localStorage.setItem('IsLogout', 'NO');
        }
    }

    public logout() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("UserID");
        localStorage.removeItem("ADtoken");
        localStorage.clear();
        localStorage.setItem('IsAD', 'NO');
        localStorage.setItem('IsLogout', 'YES');
        // alert(localStorage.getItem("token"));
        this.clientApplication.logout();
    }
}


