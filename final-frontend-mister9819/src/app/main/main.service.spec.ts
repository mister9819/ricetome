import {ComponentFixture, TestBed} from '@angular/core/testing';

import { MainService } from './main.service';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MainComponent} from "./main.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {A11yModule} from "@angular/cdk/a11y";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('MainService', () => {
  let service: MainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        A11yModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      declarations: [ MainComponent ],
    })
    service = TestBed.inject(MainService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('generate data', (done)=> {
  //   console.log("HERE!");
  //   service.generateData(1, component.friends, component.friendIdList, component.posts, component.dposts).then(() => {
  //     done();
  //   })
  // })

  // it('generate data', (done)=> {
  //     let posts: Array<{userId: number, id: number, title: string, text: string, image: string, name: string, username: string, timestamp: number, comments: Array<Object>}>
  //       = new Array<{userId: number, id: number, title: string, text: string; image: string, name: string, username: string, timestamp: number, comments: Array<Object>}>();
  //     let dposts: Array<{userId: number, id: number, title: string, text: string, image: string, name: string, username: string, timestamp: number, comments: Array<Object>}>
  //       = new Array<{userId: number, id: number, title: string, text: string; image: string, name: string, username: string, timestamp: number, comments: Array<Object>}>();
  //     let friends: Array<{id: number, username: string, name: string, image: string, status: string}>
  //       = new Array<{id: number, username: string, name: string, image: string, status: string}>();
  //     let friendIdList: any = [];
  //
  //     service.generateData(1, friends, friendIdList, posts, dposts).then(() => {
  //       expect(posts.length).toEqual(40);
  //       done();
  //     })
  //   })
});
