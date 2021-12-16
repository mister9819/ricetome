import { Injectable } from '@angular/core';
import {PostsService} from "./posts/posts.service";
import {RegisterationService} from "../auth/registeration/registeration.service";
import {ProfileService} from "../profile/profile.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  posts: any;
  dposts: any;
  friends: any;

  constructor(private router: Router,
              private postsService: PostsService,
              private registrationService: RegisterationService,
              private profileService: ProfileService) { }

  generateData(friends: any, posts: any, dposts: any): Promise<boolean> {
    this.posts = posts;
    this.dposts = dposts;
    this.friends = friends;

    return new Promise<boolean>((resolve => {
      this.generateFriends().then(() => {
        this.generatePosts().then(() => {
          resolve(true);
        })
      });
    }));
  }

  generateFriends(): Promise<boolean> {
    return new Promise<boolean>((resolve => {
      this.profileService.getFollowing().subscribe((resp: any) => {
        for (const x of resp.following) {
          this.profileService.getAvatar(x).subscribe((resp: any) => {
            this.profileService.getHeadline(x).subscribe((res: any) => {
              this.friends.push({
                username: x,
                image: resp.avatar,
                status: res.headline
              });
            })
          })
        }
        resolve(true);
      }, error => {
        if (error.statusText == "Unauthorized") {
          this.router.navigate(['/']);
          localStorage.removeItem('isUserLoggedIn');
          localStorage.removeItem('userId');
          localStorage.removeItem('nolink');
          resolve(false);
        }
      })
    }));
  }

  generatePosts(): Promise<boolean> {
    this.posts.length = 0;
    // while (this.posts.length) { this.posts.pop(); }
    return new Promise<boolean>((resolve => {
      this.postsService.getPosts().subscribe((resp: any) => {
        resp = resp.articles;
        for (let x of resp) {
          this.posts.push({id: x._id, title: x.title,
            text: x.text, image: x.image, username:x.author,
            timestamp: x.createdAt, comments: x.comments});
        }
        this.searchPosts(this.posts, this.dposts, "");
      });
    }));
  }

  addPost(title: any, text: any, image: any) {
    this.posts.length = 0;
    this.postsService.addPost(title, text, image).subscribe((resp: any) => {
      resp = resp.articles;
      for (let x of resp) {
        this.posts.push({id: x._id, title: x.title,
          text: x.text, image: x.image, username:x.author,
          timestamp: x.createdAt, comments: x.comments});
      }
      this.searchPosts(this.posts, this.dposts, "");
    });
  }

  searchPosts(posts: any, dposts: any, searchText: string) {
    dposts.length = 0;
    searchText = searchText.toLowerCase();

    for (let x of posts) {
      if (x.text.toLowerCase().search(searchText) != -1 ||
        x.username.toLowerCase().search(searchText) != -1) {
        dposts.push(x);
      }
    }
  }

  addFriend(addFriendName: String): Promise<String> {
    return new Promise<String>((resolve => {
      this.profileService.addFollowing(addFriendName).subscribe(
        (resp: any) => {
          resolve("true");
          this.profileService.getAvatar(addFriendName).subscribe((resp: any) => {
            this.profileService.getHeadline(addFriendName).subscribe((res: any) => {
              this.friends.unshift({
                username: addFriendName,
                image: resp.avatar,
                status: res.headline
              });
              this.generatePosts()
            })
          })
        },
        (err: any) => {
          console.log(err);
          resolve(err.error);
      })
    }));
  }

  removeFriend(index: number): Promise<boolean> {
    return new Promise<boolean>((resolve => {
      if (index !== -1) {
        this.profileService.removeFollowing(this.friends[index].username).subscribe((resp: any) => {
          this.generatePosts().then(() => {
            resolve(true);
          });
        })
        this.friends.splice(index, 1);
      }
    }));
  }

}
