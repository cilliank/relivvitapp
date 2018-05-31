import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FeedPage } from '../pages/feed/feed';
import { PostsPage } from '../pages/posts/posts';
import { TabsPage } from '../pages/tabs/tabs';
import { GreetingPage } from '../pages/greeting/greeting';
import { OtherUserPage } from '../pages/other-user/other-user';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProfileServiceProvider } from '../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../providers/clip-service/clip-service';
import { LoginProvider } from '../providers/login/login';
import { SignupProvider } from '../providers/signup/signup';
import { VideonavProvider } from '../providers/videonav/videonav';

@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    PostsPage,
    TabsPage,
    GreetingPage,
    OtherUserPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FeedPage,
    PostsPage,
    TabsPage,
    GreetingPage,
    OtherUserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProfileServiceProvider,
    ClipServiceProvider,
    LoginProvider,
    SignupProvider,
    VideonavProvider
  ]
})
export class AppModule {}
