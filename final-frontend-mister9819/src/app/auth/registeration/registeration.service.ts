import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegisterationService {

  isUserLoggedIn: boolean = false;
  userId: number = -1;

  constructor(private httpClient: HttpClient) {

  }

  glogin(): Promise<any> {
    this.isUserLoggedIn = false;
    return new Promise<any>((resolve => {
      this.httpClient.post('https://ricetome3.herokuapp.com/glogin', {},
        {withCredentials: true}).subscribe((res: any) => {
          if (res.result == "success") {
            this.isUserLoggedIn = true;
            localStorage.setItem('isUserLoggedIn', "true");
            localStorage.setItem('userId', res.username);
          }
          resolve(this.isUserLoggedIn);
        },
        (error => {
          localStorage.setItem("nolink", "Account not linked");
        }))
    }))
  }

  login(userName: string, password: string): Promise<any> {
    this.isUserLoggedIn = false;
    return new Promise<any>((resolve => {
      this.httpClient.post('https://ricetome3.herokuapp.com/login', {
        username: userName,
        password: password
      }, {withCredentials: true}).subscribe((res: any) => {
        if (res.result == "success") {
          this.isUserLoggedIn = true;
          localStorage.setItem('isUserLoggedIn', "true");
          localStorage.setItem('userId', res.username);
        }
        resolve(this.isUserLoggedIn);
      },
        (error => {
          resolve(this.isUserLoggedIn);
        }))
    }))
  }

  register(userName: string, password: string, email: string, dob: any, zipcode: any, gid: any): Promise<String> {
    this.isUserLoggedIn = false;
    return new Promise<any>((resolve => {
      this.httpClient.post('https://ricetome3.herokuapp.com/register', {
        username: userName,
        password: password,
        gid: gid,
        email: email,
        dob: dob,
        zipcode: zipcode
      }, {withCredentials: true}).subscribe((res: any) => {
        if (res.result == "success") {
          this.isUserLoggedIn = true;
          localStorage.setItem('isUserLoggedIn', "true");
          localStorage.setItem('userId', res.username);
          resolve("true");
        } else {
          resolve("Unknown error.");
        }
      },
        (error => {
          console.log(error);
          resolve(error.error);
        }))
    }))
  }

  logout(): void {
    this.httpClient.put('https://ricetome3.herokuapp.com/logout', {}, {withCredentials: true}).subscribe((res: any) => {
      console.log(res);
    });

    this.isUserLoggedIn = false;
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('nolink');
  }

  authGoogle(username: any, status: any) {
      this.httpClient.put('https://ricetome3.herokuapp.com/linking/' + username,
        {status: status},
        {withCredentials: true}).subscribe((res: any) => {
          console.log(res)
          window.location.href = 'https://ricetome3.herokuapp.com/auth/google';
        },
        (error => {
          console.log(error)
        }))
  }

  infoGoogle() {
    return this.httpClient.get('https://ricetome3.herokuapp.com/ginfo', {withCredentials: true})
  }

  clearGoogleInfo() {
    this.httpClient.get('https://ricetome3.herokuapp.com/clearginfo', {withCredentials: true}).subscribe();
  }

  foo() {
    this.httpClient.get('https://ricetome3.herokuapp.com/auth/google', {withCredentials: true}).subscribe((resp: any) => {
      console.log(resp);
    });
  }
}
