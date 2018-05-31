import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherUserPage } from './other-user';

@NgModule({
  declarations: [
    OtherUserPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherUserPage),
  ],
})
export class OtherUserPageModule {}
