import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateClipPage } from './create-clip';

@NgModule({
  declarations: [
    CreateClipPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateClipPage),
  ],
})
export class CreateClipPageModule {}
