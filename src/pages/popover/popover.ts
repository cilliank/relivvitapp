import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { Component, NgZone } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  template: `
      <button ion-item (click)="blockClip(clip)">Report Clip</button>
  `
})
export class PopoverPage {
        
    public data: any;
    
  constructor(public viewCtrl: ViewController,
  public clipService: ClipServiceProvider,
     public alertCtrl: AlertController) {}
    
    public blockClip(clip) {

        var data: any;

        let confirm = this.alertCtrl.create({
            title: 'Block Clip',
            message: 'Are you sure you want to block the clip  ' + clip.name + ' from your timeline?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('You are sure');

                        this.clipService.block(clip.id, this.data.sessionToken).subscribe(

                            response => {

                                data = response;
                                //Remove the clip from the scope
                                var index = findWithAttr(this.data.feedClips, 'id', clip.id);
                                if (index > -1) {
                                    this.data.feedClips.splice(index, 1);
                                }

                                //Present the user with a second option of reporting the clip
                                let report = this.alertCtrl.create({
                                    title: 'Report Clip',
                                    message: 'Do you also want to report this clip as having inappropriate content?',
                                    buttons: [
                                        {
                                            text: 'Yes',
                                            handler: () => {
                                                console.log('You are sure');
                                                this.clipService.report(clip.id, this.data.sessionToken).subscribe(

                                                    response => {

                                                        data = response;

                                                    });
                                            }
                                        },
                                        {
                                            text: 'No',
                                            handler: () => {
                                                console.log('You are not sure');
                                                //So do nothing
                                            }
                                        }
                                    ]
                                });
                                report.present();
                            });

                    }
                },
                {
                    text: 'No',
                    handler: () => {
                        console.log('You are not sure');
                        //So do nothing
                    }
                }
            ]
        });


        confirm.present();

        function findWithAttr(array, attr, value) {

            for (var i = 0; i < array.length; i += 1) {
                if (array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }
    };

  close() {
    this.viewCtrl.dismiss();
  }
}