import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatesPage } from './dates';

@NgModule({
  declarations: [
    DatesPage,
  ],
  imports: [
    IonicPageModule.forChild(DatesPage),
  ],
})
export class DatesPageModule {}
