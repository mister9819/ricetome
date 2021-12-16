import { TestBed } from '@angular/core/testing';

import { RegisterationService } from './registeration.service';
import {HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {A11yModule} from "@angular/cdk/a11y";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('RegisterationService', () => {
  let service: RegisterationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        A11yModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(RegisterationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
