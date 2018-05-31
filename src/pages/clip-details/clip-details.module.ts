import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClipDetailsPage } from './clip-details';

@NgModule({
  declarations: [
    ClipDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ClipDetailsPage),
  ],
})
export class ClipDetailsPageModule {}
