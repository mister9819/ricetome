import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterationComponent } from './auth/registeration/registeration.component';
import { PostsComponent } from './main/posts/posts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {A11yModule} from "@angular/cdk/a11y";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MainComponent,
    ProfileComponent,
    RegisterationComponent,
    PostsComponent,
  ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        A11yModule,
        ReactiveFormsModule,
        FormsModule,
    ],
  exports: [
    RegisterationComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
