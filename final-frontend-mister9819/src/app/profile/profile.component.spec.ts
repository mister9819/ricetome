import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {A11yModule} from "@angular/cdk/a11y";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterationService} from "../auth/registeration/registeration.service";

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

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
      declarations: [ ProfileComponent ],
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
      });
  });

  beforeEach(() => {
    // fixture = TestBed.createComponent(ProfileComponent);
    // component = fixture.componentInstance;
    localStorage.setItem('isUserLoggedIn', "true");
    localStorage.setItem('userId', "1");
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should return correct phone entry', () => {
    component.addDash(6, 1111111111);
    expect(component.newnum).toEqual('111-111-1111');
  });

  // it ('logged in username', async(() => {
  //   console.log(component.userId);
  //   tick();
  //   console.log(component.v_display_name);
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     console.log(component.v_display_name);
  //     expect("n").toEqual('y')
  //   })
  // }));

  it('should fetch the logged in user\'s profile username', ((done) => {
    component.waitNgOnInit().subscribe((resp: any) => {
      expect(resp.username).toEqual("Bret");
      done();
    })
  }));

  // it('registered username', ((done) => {
  //   localStorage.setItem('userId', "0");
  //   localStorage.setItem("username", "abc");
  //   component.ngOnInit();
  //   component.waitNgOnInit().subscribe((resp: any) => {
  //     console.log(resp);
  //     expect(resp.username).toEqual("abc");
  //     done();
  //   })
  // }));

  // it ('logged in username', (() => {
  //   localStorage.setItem('userId', "1");
  //   component.ngOnInit();
  //   setTimeout(() =>{
  //     expect(component.v_display_name).toEqual("Bret");
  //   }, 500)
  // }));
  //
  // it ('registered in username', (() => {
  //   localStorage.setItem('userId', "0");
  //   localStorage.setItem("username", "abc");
  //   component.ngOnInit();
  //   setTimeout(() =>{
  //     expect(component.v_display_name).toEqual("abc");
  //   }, 250)
  // }));

  it('should update profile', (() => {
    component.display_name = 'abc';
    component.email = 'a@a.com';
    component.newnum = '999-999-9999';
    component.zipcode = '55555';
    component.password = 'abc';
    component.cpassword = 'abc';
    component.myUpdate();

    expect(component.display_update).toEqual(true);
  }))

});
