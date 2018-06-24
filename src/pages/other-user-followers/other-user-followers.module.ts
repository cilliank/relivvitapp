import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherUserFollowersPage } from './other-user-followers';

@NgModule({
  declarations: [
    OtherUserFollowersPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherUserFollowersPage),
  ],
})
export class OtherUserFollowersPageModule {}
