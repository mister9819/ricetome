import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }

  getFollowing(): Observable<Object> {
    return this.httpClient.get("https://ricetome3.herokuapp.com/following", {withCredentials: true});
  }

  addFollowing(user: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/following/" + user, {},
      {withCredentials: true});
  }

  removeFollowing(user: any): Observable<Object> {
    return this.httpClient.delete("https://ricetome3.herokuapp.com/following/" + user,
      {withCredentials: true});
  }

  getHeadline(user: any): Observable<Object> {
    let query = "https://ricetome3.herokuapp.com/headline";
    if (user != null) {
      query += "/" + user;
    }
    return this.httpClient.get(query, {withCredentials: true});
  }

  updateHeadline(headline: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/headline",
      {headline: headline},
      {withCredentials: true});
  }

  getEmail(user: any): Observable<Object> {
    let query = "https://ricetome3.herokuapp.com/email";
    if (user != null) {
      query += "/" + user;
    }
    return this.httpClient.get(query, {withCredentials: true});
  }

  updateEmail(email: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/email",
      {email: email},
      {withCredentials: true});
  }

  getZipcode(user: any): Observable<Object> {
    let query = "https://ricetome3.herokuapp.com/zipcode";
    if (user != null) {
      query += "/" + user;
    }
    return this.httpClient.get(query, {withCredentials: true});
  }

  updateZipcode(zipcode: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/zipcode",
      {zipcode: zipcode},
      {withCredentials: true});
  }

  getDob(user: any): Observable<Object> {
    let query = "https://ricetome3.herokuapp.com/dob";
    if (user != null) {
      query += "/" + user;
    }
    return this.httpClient.get(query, {withCredentials: true});
  }

  getAvatar(user: any): Observable<Object> {
    let query = "https://ricetome3.herokuapp.com/avatar";
    if (user != null) {
      query += "/" + user;
    }
    return this.httpClient.get(query, {withCredentials: true});
  }

  updateAvatar(avatar: any): Observable<Object> {
    const fd = new FormData()
    fd.append('image', avatar)
    return this.httpClient.put("https://ricetome3.herokuapp.com/avatar",
      fd,
      {withCredentials: true});
  }

  updatePassword(password: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/password",
      {password: password},
      {withCredentials: true});
  }

  linkGoogle(): Observable<Object> {
    return this.httpClient.get("https://ricetome3.herokuapp.com/link",
      {withCredentials: true});
  }

  unlinkGoogle(): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/unlink",
      {},
      {withCredentials: true});
  }

  isLinkedGoogle(): Observable<Object> {
    return this.httpClient.get("https://ricetome3.herokuapp.com/islinked",
      {withCredentials: true});
  }
}
