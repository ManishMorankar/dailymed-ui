import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppComponent } from './app.component';
// import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { TokenInterceptor } from './services/interceptor';
import { ErrorInterceptor } from './services/error.interceptor';
import { HeaderComponent } from './header/header.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './guards/auth.guard';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NotfoundComponent } from './notfound/notfound.component';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule, MatPaginatorModule, MatSelectModule, MatInputModule, MatAutocompleteModule, MatToolbarModule } from '@angular/material';
import 'hammerjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MainPipeModule } from './pipe/main-pipe.module';
import { SharedModule } from './shared-module/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { SidenavService } from './services/sidenav.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SearchComponent } from './search/search.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { environment } from 'src/environments/environment';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { MsalUserService } from './services/msaluser.service';

export const protectedResourceMap: any =
  [
  ];
import { SharedSidebarService } from './shared/sidebar-icon';
import { NewNavigationComponent } from './new-navigation/new-navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ExportService } from './services/export.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    LogoutComponent,
    FooterComponent,
    NotfoundComponent,
    LoaderComponent,
    SidebarComponent,
    SearchComponent,
    NewNavigationComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DashboardModule,
    HttpClientModule,
    DragDropModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-full-width',
      preventDuplicates: true,
      maxOpened: 1
    }), // ToastrModule added

    // MsalModule.forRoot({
    //   clientID: environment.uiClienId,
    //   authority: 'https://login.microsoftonline.com/' + environment.tenantId,
    //   //cacheLocation: 'localStorage',
    //   protectedResourceMap: protectedResourceMap,
    //   redirectUri: environment.redirectUrl
    // }),

    MainPipeModule,
    SharedModule,
    MatSidenavModule,
    MatButtonModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatToolbarModule,
    LayoutModule,
    MatIconModule,
    MatListModule,
    NgSelectModule
  ],
  exports: [
    MatTooltipModule
  ],
  providers: [
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard,
    DatePipe,
    SidenavService,
    HttpClient,
    // MsalUserService,
    // {
    //   provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true
    // },
    SharedSidebarService,
    ExportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
