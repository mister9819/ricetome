import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterationComponent } from './registeration.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {A11yModule} from "@angular/cdk/a11y";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('RegisterationComponent', () => {
  let component: RegisterationComponent;
  let fixture: ComponentFixture<RegisterationComponent>;

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
      declarations: [ RegisterationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be over 18', () => {
    component.over18("2000-10-07");
    expect(component.display_alert_age).toEqual(false);
  });

  it('should be under 18', () => {
    component.over18("2021-11-07");
    expect(component.display_alert_age).toEqual(true);
  });

  it('should return password match', () => {
    component.passwordMatch("abc", "abc");
    expect(component.display_alert_password).toEqual(false);
  });

  it('should return password do not match', () => {
    component.passwordMatch("abc", "ab");
    expect(component.display_alert_password).toEqual(true);
  });

  it('should return correct username', () => {
    component.usernameCheck("abc");
    expect(component.display_alert_username).toEqual(false);
  });

  it('should return not correct username', () => {
    component.usernameCheck("1ab");
    expect(component.display_alert_username).toEqual(true);
  });

  it ('should output correct phone number', () => {
    component.addDash(6, 1111111111);
    expect(component.newnum).toEqual('111-111-1111');
  });

});
