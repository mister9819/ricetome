import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {RegisterationService} from "./registeration/registeration.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  @ViewChild('openRegister', { static: false }) open_register: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('closeRegister', { static: false }) close_register: ElementRef<HTMLInputElement> = {} as ElementRef;

  display_alert_password: boolean = false;
  gdisplay_alert_age: boolean = false;
  gdisplay_alert_register: boolean = false;
  galert_register: string = "";

  gusername: any;
  gdob: any;
  gzipcode: any;
  gemail: any;
  gid: any;

  welcome: string = "Since you are logging in for the fist time, we need some additional details before you can use your account.";

  constructor(private router: Router, private registerationService: RegisterationService) {
    var loggedIn = localStorage.getItem('isUserLoggedIn');

    //check for Navigation Timing API support
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      localStorage.removeItem('nolink');
      this.registerationService.clearGoogleInfo();
    } else {
      //console.info("This page is not reloaded");
    }

    setTimeout(() => {
      let nolink = localStorage.getItem('nolink');
      if (nolink != null) {
        this.open_register.nativeElement.click();
        this.registerationService.infoGoogle().subscribe((res: any) => {
          this.gusername = res.username;
          this.gemail = res.email;
          this.gid = res.gid;
        })
      }
    }, 500)

    if (loggedIn == "true") {
      this.router.navigate(['/main']);
    }
  }


  ngOnInit(): void {
  }

  lsubmit(username: any, upassword: any) {
    localStorage.removeItem('nolink');
    if (username != '' && upassword != '') {
      this.registerationService.login(username, upassword).then((resp: any) => {
        if (resp) {
          this.display_alert_password = false;
          this.router.navigate(['/main']);
        } else {
          this.display_alert_password = true;
        }
      });
    }
  }

  glogin() {
    // this.registerationService.foo();
    window.location.href = 'https://ricetome3.herokuapp.com/auth/google';
  }

  gRegister() {
    this.gdisplay_alert_register = false;
    this.gdisplay_alert_age = false;

    this.over18(this.gdob);
    if (!this.gdisplay_alert_age) {
      this.registerationService.register(this.gusername, "", this.gemail, this.gdob, this.gzipcode, this.gid).then((resp: any) => {
        if(resp == "true") {
          localStorage.removeItem('nolink');
          this.close_register.nativeElement.click();
          this.router.navigate(['/main']);
        } else {
          if (resp == "Duplicate username.") {
            this.gdisplay_alert_register = true;
            this.galert_register = resp;
          } else {
            this.gdisplay_alert_register = true;
            this.galert_register = "Email is already being used locally. Consider linking account by going to the profile page.";
          }
          //console.log("Couldn't register", resp)
        }
      })
    }
  }

  over18(input: any) {
    if (input != '') {
      let dateString = new Date(input);
      dateString.setDate(dateString.getDate() + 1);
      let age = this.getAge(dateString);
      this.gdisplay_alert_age = age < 18;
    }
  }

  getAge(dateString: any) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  clear() {
    localStorage.removeItem('nolink');
    this.registerationService.clearGoogleInfo();
  }
}
