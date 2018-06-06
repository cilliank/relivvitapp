import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { FeedPage } from '../pages/feed/feed';
import { PostsPage } from '../pages/posts/posts';
import { TabsPage } from '../pages/tabs/tabs';
import { GreetingPage } from '../pages/greeting/greeting';
import { OtherUserPage } from '../pages/other-user/other-user';
import { PeoplePage } from '../pages/people/people';
import { FollowersPage } from '../pages/followers/followers';
import { FollowingPage } from '../pages/following/following';
import { MePage } from '../pages/me/me';
import { SettingsPage } from '../pages/settings/settings';
import { PasswordPage } from '../pages/password/password';
import { TermsPage } from '../pages/terms/terms';
import { ResetPage } from '../pages/reset/reset';
import { VenuesPage } from '../pages/venues/venues';

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
    SignupPage,
    LoginPage,
    FeedPage,
    PostsPage,
    TabsPage,
    GreetingPage,
    OtherUserPage,
    PeoplePage,
    FollowersPage,
    FollowingPage,
    MePage,
    SettingsPage,
    PasswordPage,
    ResetPage,
    TermsPage,
    VenuesPage
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
    SignupPage,
    LoginPage,
    FeedPage,
    PostsPage,
    TabsPage,
    GreetingPage,
    OtherUserPage,
    PeoplePage,
    FollowersPage,
    FollowingPage,
    MePage,
    SettingsPage,
    PasswordPage,
    ResetPage,
    TermsPage,
    VenuesPage
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
