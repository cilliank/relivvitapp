import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherUserFollowingPage } from './other-user-following';

@NgModule({
  declarations: [
    OtherUserFollowingPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherUserFollowingPage),
  ],
})
export class OtherUserFollowingPageModule {}
