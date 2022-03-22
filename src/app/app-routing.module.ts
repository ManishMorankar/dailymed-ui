import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { NotfoundComponent } from './notfound/notfound.component';

import { AppComponent } from './app.component';
import { MsalGuard } from '@azure/msal-angular';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { LoginComponent } from './login/login.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { AuthGuard } from './guards/auth.guard';

/* const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
 { path: 'login', loadChildren: 'src/app/login/login.module#LoginModule'},
 { path: 'logout', component: LogoutComponent },
 { path: 'forgotpassword', component: ForgotpasswordComponent },
 { path: 'resetpassword/:token', component: ResetpasswordComponent },
 { path: 'ui', loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule' },
 {path: '**', redirectTo: 'notfound'},
 {path: 'notfound', component: NotfoundComponent},
];*/

const routes: Routes = [
  //{
  //  path: '',
  //  component: AppComponent, pathMatch: 'full',
  //  canActivate: [MsalGuard]
  //},

  //{ path: 'login', component: AppComponent, pathMatch: 'full', canActivate: [MsalGuard]},

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'logout', component: LogoutComponent },
  { path: 'ui', loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule' },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: 'notfound' },
  { path: 'notfound', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
