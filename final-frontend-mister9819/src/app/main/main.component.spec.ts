import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {A11yModule} from "@angular/cdk/a11y";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PostsService} from "./posts/posts.service";
import {of} from "rxjs";
import {MainService} from "./main.service";

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let service: MainService;

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
      declarations: [ MainComponent ],
    })
    .compileComponents();
    service = TestBed.inject(MainService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    localStorage.setItem('isUserLoggedIn', "true");
    localStorage.setItem('userId', "1");
    component.not_test = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all articles for current logged in user', function (done) {
    service.generateData(1, component.friends, component.friendIdList, component.posts, component.dposts, false).then(() => {
      expect(component.posts.length).toEqual(40);
      done();
    })
  });

  it('should fetch subset of articles for current logged in user given search keyword', function (done) {
    service.generateData(1, component.friends, component.friendIdList, component.posts, component.dposts, false).then(() => {
      service.searchPosts(component.posts, component.dposts, "quia");
      expect(component.dposts.length).toBeLessThan(40);
      done();
    })
  });

  it('should add articles when adding a follower', function (done) {
    service.generateData(1, component.friends, component.friendIdList, component.posts, component.dposts, false).then(() => {
      service.addFriend("Delphine").then(() => {
        expect(component.posts.length).toBeGreaterThan(40);
        done();
      })
    })
  });

  it('should remove articles when removing a follower', function (done) {
    service.generateData(1, component.friends, component.friendIdList, component.posts, component.dposts, false).then(() => {
      service.removeFriend(1).then(() => {
        expect(component.posts.length).toBeLessThan(40);
        done();
      })
    })
  });


  it('should update headline', () => {
    component.newStatus = "New status!";
    component.updateStatus();
    expect(localStorage.getItem(component.userId + "userHeadline")).toEqual("New status!");
  });

  // it('should add post', () => {
  //   let old_length = component.posts.length;
  //   component.post_title = "New title!";
  //   component.post_text = "New text!";
  //   component.addPost();
  //   expect(old_length).toBeLessThan(component.posts.length);
  // });
});
