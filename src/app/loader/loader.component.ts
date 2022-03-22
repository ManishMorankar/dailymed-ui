import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  color = 'info';
  mode = 'indeterminate';
  value = 50;
  isLoading: Subject<boolean> = this.apiService.isLoading;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

}
