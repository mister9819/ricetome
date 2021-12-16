import { Component } from '@angular/core';
import {RegisterationService} from "./auth/registeration/registeration.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hw5-mister9819';

  constructor(private registerationService: RegisterationService) {
  }

  logout() {
    this.registerationService.logout();
  }

  checkLoggedIn = function() {
    return localStorage.getItem('isUserLoggedIn') != null;
  }
}
