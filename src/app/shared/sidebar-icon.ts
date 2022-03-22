import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class SharedSidebarService {

  sidebarToggle: string;
  _sidebarToggleBS = new BehaviorSubject<string>('');

  menuToggle: string;
  _menuToggleBS = new BehaviorSubject<string>('');

  constructor() {
    this.sidebarToggle;
    this.menuToggle;

    this._sidebarToggleBS.next(this.sidebarToggle);
    this._menuToggleBS.next(this.menuToggle);
  }

  updateSidebarToggle(val) {
    this.sidebarToggle = val;
    this._sidebarToggleBS.next(this.sidebarToggle);
  }

  updateMenuToggle(val) {
    this.menuToggle = val;
    this._menuToggleBS.next(this.menuToggle);
  }

}