import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
