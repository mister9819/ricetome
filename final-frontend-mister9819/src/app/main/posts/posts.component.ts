import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PostsService} from "./posts.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  @Input() username = '';
  @Input() id = '';
  @Input() text = '';
  @Input() title = '';
  @Input() image = '';
  @Input() timestamp: any;
  @Input() comments: any;
  @Output() titleEvent = new EventEmitter<string>();
  @Output() textEvent = new EventEmitter<string>();

  loggedInUser: string = '';
  header = '';
  display_comments: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem('userId') || "user";
    this.timestamp = new Date(this.timestamp)
    if (this.image == ' ') {
      this.header = "Text Post";
    } else {
      this.header = "Image Post";
    }
  }

  setData(id: any, title: any, text: any) {
    localStorage.setItem('current', id);
    this.titleEvent.emit(title);
    this.textEvent.emit(text);
  }

}
