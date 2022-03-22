import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private apiService: ApiService, private dataService: DataService) { }

  ngOnInit() {
    //Call Backend Logout Api
    this.apiService.logout();
    // this.router.navigate(['/']);
    // this.dataService.logout();
    this.router.navigate(['/login']);
  }

}
