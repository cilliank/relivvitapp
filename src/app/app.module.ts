import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
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

import { SignupPageModule } from '../pages/signup/signup.module';
import { LoginPageModule } from '../pages/login/login.module';
import { FeedPageModule } from '../pages/feed/feed.module';
import { PostsPageModule } from '../pages/posts/posts.module';
import { GreetingPageModule } from '../pages/greeting/greeting.module';
import { OtherUserPageModule } from '../pages/other-user/other-user.module';
import { PeoplePageModule } from '../pages/people/people.module';
import { FollowersPageModule } from '../pages/followers/followers.module';
import { FollowingPageModule } from '../pages/following/following.module';
import { MePageModule } from '../pages/me/me.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { PasswordPageModule } from '../pages/password/password.module';
import { TermsPageModule } from '../pages/terms/terms.module';
import { ResetPageModule } from '../pages/reset/reset.module';
import { VenuesPageModule } from '../pages/venues/venues.module';

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
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    SignupPageModule,
    LoginPageModule,
    FeedPageModule,
    PostsPageModule,
    GreetingPageModule,
    OtherUserPageModule,
    PeoplePageModule,
    FollowersPageModule,
    FollowingPageModule,
    MePageModule,
    SettingsPageModule,
    PasswordPageModule,
    ResetPageModule,
    TermsPageModule,
    VenuesPageModule
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
    VideonavProvider,
    PhotoLibrary
  ]
})
export class AppModule {}
