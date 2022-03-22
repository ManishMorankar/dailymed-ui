import { Injectable } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatDrawer } from '@angular/material';

@Injectable()
export class SidenavService {
    sidenav: MatDrawer;


    public setSidenav(sidenav: MatDrawer) {
        this.sidenav = sidenav;
    }

    public open() {
        if (this.sidenav) {
            return this.sidenav.open();
        }
    }


    public close() {
        if (this.sidenav) {
            return this.sidenav.close();
        }
    }

    public toggle(): void {
        if (this.sidenav) {
            this.sidenav.toggle();
        }
    }
}