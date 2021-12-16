import { Component, OnInit } from '@angular/core';
import {RegisterationService} from "../auth/registeration/registeration.service";
import {Router} from "@angular/router";
import {ProfileService} from "./profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  display_name = '';
  email = '';
  zipcode = '';
  password = '';
  cpassword = '';
  dob = ''
  image: any;

  v_zipcode = "12345";
  v_avatar = "";

  str_update = '';
  display_update = false;
  display_cpassword = false;
  display_alert_password = false;
  linked: boolean = false;
  unlinkable: boolean = false;
  exists: boolean = false;

  userId: number = -1;


  constructor(private router: Router,
              private registrationService: RegisterationService,
              private profileService: ProfileService) {

    let loggedIn = localStorage.getItem('isUserLoggedIn');
    let tid = localStorage.getItem('userId') || "John Doe";

    if (loggedIn == null) {
      this.router.navigate(['/']);
    }

    if (tid == "John Doe") {
      this.registrationService.glogin().then((resp: any) => {
        this.router.navigate(['/main']);
      })
    } else {
      this.display_name = tid;

      this.profileService.isLinkedGoogle().subscribe((resp: any) => {
        if (resp.result == "true") { // Linked
          this.linked = true;
        } else if (resp.result == "link") { // Linking in progress
          this.profileService.linkGoogle().subscribe((resp: any) => {
            if (resp.result == "success") {
              this.linked = true;
            } else if (resp.result == "exists") { // Cannot link because same already linked to another account
              this.exists = true;
            }
          });
        } else if (resp.result == "unlinkable") { // Cannot unlink
          this.linked = true;
          this.unlinkable = true;
        }
      })
    }
  }

  ngOnInit(): void {
    this.profileService.getEmail(null).subscribe((resp: any) => {
      this.email = resp.email;
    });
    this.profileService.getZipcode(null).subscribe((resp: any) => {
      this.v_zipcode = resp.zipcode;
    });
    this.profileService.getAvatar(null).subscribe((resp: any) => {
      this.v_avatar = resp.avatar;
    });
    this.profileService.getDob(null).subscribe((resp: any) => {
      this.dob = resp.dob.substr(0, 10);
    });
  }

  myUpdate() {
    this.str_update = '';
    this.display_update = false;

    if (this.password.length != 0) {
      if (this.password === this.cpassword) {
        this.display_alert_password = false;
        this.profileService.updatePassword(this.password).subscribe();
        this.password = '';
        this.cpassword = '';
        this.updateCPassword();
        this.str_update += "Password updated " + "<br/>";
        this.display_update = true;
        this.unlinkable = false;
      } else {
        this.display_alert_password = true;
      }
    }
    if (!this.display_alert_password) {
      // if (this.email.length != 0) {
      //   this.str_update += "Email: " + this.v_email + " updated to " + this.email + "<br/>";
      //   this.v_email = this.email;
      //   this.email = '';
      //   this.profileService.updateEmail(this.v_email).subscribe();
      //   this.display_update = true;
      // }
      if (this.zipcode.length != 0) {
        this.str_update += "Zipcode: " + this.v_zipcode + " updated to " + this.zipcode + "<br/>";
        this.v_zipcode = this.zipcode;
        this.zipcode = '';
        this.profileService.updateZipcode(this.v_zipcode).subscribe();
        this.display_update = true;
      }
    }

  }

  updateCPassword() {
    this.display_cpassword = this.password.length != 0;
  }

  uploadAvatar() {
    this.profileService.updateAvatar(this.image).subscribe((resp: any) => {
      this.v_avatar = resp.avatar;
      this.image = '';
    });
  }

  updateAvatar(event: any) {
    this.image = event.target.files[0]
  }

  link() {
    this.exists = false;
    if (!this.linked) {
      this.registrationService.authGoogle(this.display_name, "link");
    } else {
      this.profileService.unlinkGoogle().subscribe((resp: any) => {
        this.linked = false;
      });
    }
  }
}
