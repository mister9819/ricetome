import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {RegisterationService} from "./registeration.service";

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {

  dob: any;
  display_alert_password: boolean = false;
  display_alert_age: boolean = false;
  display_alert_username: boolean = false;
  display_alert_register: boolean = false;
  alert_register: String = "";

  // @ts-ignore
  constructor(private router: Router,
              private registrationService: RegisterationService) {
  }

  ngOnInit(): void {
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

  submit(register: any) {
    this.over18(register.value.dob);
    this.passwordMatch(register.value.password, register.value.cpassword);
    this.usernameCheck(register.value.account_name);
    if (register.valid) {
      if (!this.display_alert_age
        && !this.display_alert_password && !this.display_alert_username) {
        this.registrationService.register(register.value.account_name, register.value.password,
          register.value.email, register.value.dob, register.value.zipcode, "").then((resp: any) => {
            if(resp == "true") {
              this.router.navigate(['/main']);
            } else {
              this.display_alert_register = true;
              this.alert_register = resp;
            }
        })
      }
    } else {
      //console.log("invalid form");
    }
  }

  passwordMatch(i1: any, i2: any) {
    this.display_alert_password = i1 != i2;
  }

  over18(input: any) {
    if (input != '') {
      let dateString = new Date(input);
      dateString.setDate(dateString.getDate() + 1);
      let age = this.getAge(dateString);
      this.display_alert_age = age < 18;
    }
  }

  usernameCheck(input: any) {
    //if (input != '') {
      this.display_alert_username = input.search(/^[a-zA-Z][A-Za-z0-9]*$/g) === -1;
    //}
  }

}
