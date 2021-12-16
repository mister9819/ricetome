import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  getPosts(): Observable<Object> {
    return this.httpClient.get("https://ricetome3.herokuapp.com/articles", {withCredentials: true});
  }

  addPost(title: string, text: string, image:any): Observable<Object> {
    const fd = new FormData()
    fd.append('title', title)
    fd.append('text', text)
    fd.append('image', image)
    console.log(fd);
    return this.httpClient.post("https://ricetome3.herokuapp.com/article",
      fd,
      {withCredentials: true});
  }

  addComment(text: any, id: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/articles/" + id,
      {commentId: -1, text: text},
      {withCredentials: true});
  }

  editPost(text: any, id: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/articles/" + id,
      {text: text},
      {withCredentials: true});
  }

  editComment(text: any, id: any, cid: any): Observable<Object> {
    return this.httpClient.put("https://ricetome3.herokuapp.com/articles/" + id,
      {commentId: cid, text: text},
      {withCredentials: true});
  }
}
