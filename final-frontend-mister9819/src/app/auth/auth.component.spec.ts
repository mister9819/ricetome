import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {A11yModule} from "@angular/cdk/a11y";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterationService} from "./registeration/registeration.service";

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let service: RegisterationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        A11yModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      declarations: [ AuthComponent ]
    })
    .compileComponents();
    service = TestBed.inject(RegisterationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in a previously registered user', (done) => {
    component.lsubmit("Bret", "Kulas Light");
    service.login("Bret", "Kulas Light").then(resp => {
      expect(resp).toEqual(true);
      done();
    });
  });

  it('should not log in an invalid user', (done) => {
    component.lsubmit("Bret", "Kulas Ligh");
    service.login("Bret", "Kulas Ligh").then( resp => {
      expect(resp).toEqual(false);
      done();
    });
  });

  it('should log out a user', () => {
    service.logout();
    var loggedIn = localStorage.getItem('isUserLoggedIn');
    expect(loggedIn).toEqual(null);
  });
});
