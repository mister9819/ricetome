import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostsService} from "./posts/posts.service";
import {RegisterationService} from "../auth/registeration/registeration.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MainService} from "./main.service";
import {ProfileService} from "../profile/profile.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild('closePost', { static: false }) close_post: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('closeEditPost', { static: false }) close_edit_post: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('closeComment', { static: false }) close_comment: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('closeEditComment', { static: false }) close_edit_comment: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('imagePost', { static: false }) image_post: ElementRef<HTMLInputElement> = {} as ElementRef;

  posts: Array<{id: string, title: string, text: string, image: string, username: string, timestamp: number, comments: Array<Object>}>
    = new Array<{id: string, title: string, text: string; image: string, username: string, timestamp: number, comments: Array<Object>}>();
  dposts: Array<{id: string, title: string, text: string, image: string, username: string, timestamp: number, comments: Array<Object>}>
    = new Array<{id: string, title: string, text: string; image: string, username: string, timestamp: number, comments: Array<Object>}>();
  friends: Array<{id: number, username: string, name: string, image: string, status: string}>
    = new Array<{id: number, username: string, name: string, image: string, status: string}>();

  searchText: string = '';
  addFriendName: string = '';
  image: any;

  user_image: string = '';
  username: string = '';
  user_status: string = '';
  newStatus: string = '';
  display_alert_no_friend_name: boolean = false;
  display_alert_same_name: boolean = false;
  alert_no_friend_name: String = "";

  post_title: string = '';
  post_text: string = '';
  not_test: boolean = true;

  userId: string = "-1";

  constructor(private router: Router,
              private postsService: PostsService,
              private registrationService: RegisterationService,
              private mainService: MainService,
              private profileService: ProfileService) {
    let loggedIn = localStorage.getItem('isUserLoggedIn');
    this.userId = localStorage.getItem('userId') || "user";

    if (loggedIn == null) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.profileService.getHeadline(null).subscribe((resp: any) => {
      this.user_status = resp.headline;
    })
    this.profileService.getAvatar(null).subscribe((resp: any) => {
      this.user_image = resp.avatar;
    })
    this.username = this.userId;

    // Need this for data overlap. :/
    if (this.not_test) {
      this.mainService.generateData(this.friends, this.posts, this.dposts)
    }
  }

  searchPosts() {
    this.mainService.searchPosts(this.posts, this.dposts, this.searchText);
  }

  addFriend() {
    this.display_alert_same_name = false;
    this.display_alert_no_friend_name = false;
    if (this.addFriendName != '') {
      for (const friend of this.friends) {
        if (friend.username == this.addFriendName) {
          this.display_alert_same_name = true;
          break;
        }
      }

      if (!this.display_alert_same_name) {
        this.mainService.addFriend(this.addFriendName).then((userAvailable: String) => {
          if (userAvailable == "true") {
            this.addFriendName = '';
          } else {
            this.alert_no_friend_name = userAvailable;
            this.display_alert_no_friend_name = true;
          }
        })
      }
    }
  }

  updateStatus() {
    if (this.newStatus != '') {
      this.user_status = this.newStatus;
      this.newStatus = '';
      this.profileService.updateHeadline(this.user_status).subscribe((resp: any) => {

      })
    }
  }

  addPost() {
    if (this.post_text != '' && this.post_title != '') {

      this.mainService.addPost(this.post_title, this.post_text, this.image);

      this.post_text = '';
      this.post_title = '';
      this.image = '';
      this.image_post.nativeElement.value = "";
      this.close_post.nativeElement.click();
    }
  }

  editPost() {
    if (this.post_text != '' && this.post_title != '') {
      let pid = localStorage.getItem('current');

      this.postsService.editPost(this.post_text, pid).subscribe((resp: any) => {
        let post = this.posts.find(x => x.id === pid);
        if (post != undefined) {
          post.text = resp.articles.text;
        }
      })

      this.post_text = '';
      this.post_title = '';
      this.close_edit_post.nativeElement.click();
    }
  }

  addComment() {
    if (this.post_text != '') {
      let pid = localStorage.getItem('current');

      this.postsService.addComment(this.post_text, pid).subscribe((resp: any) => {
         let post = this.posts.find(x => x.id === pid);
         if (post != undefined) {
           post.comments = resp.articles.comments;
         }
      })

      this.post_text = '';
      this.close_comment.nativeElement.click();
    }
  }

  editComment() {
    if (this.post_text != '') {
      let pid = localStorage.getItem('current');
      let cid = this.post_title;

      this.postsService.editComment(this.post_text, pid, cid).subscribe((resp: any) => {
        let post = this.posts.find(x => x.id === pid);
        if (post != undefined) {
          post.comments = resp.articles.comments;
        }
      })

      this.post_text = '';
      this.post_title = '';
      this.close_edit_comment.nativeElement.click();
    }
  }

  resetData() {
    this.post_title = "";
    this.post_text = "";
  }

  setTitle(title: any) {
    this.post_title = title;
  }

  setText(text: any) {
    this.post_text = text;
  }

  removeFriend(friend: any) {
    const index = this.friends.indexOf(friend);
    this.mainService.removeFriend(index);
  }

  updateImage(event: any) {
    this.image = event.target.files[0]
  }

}
