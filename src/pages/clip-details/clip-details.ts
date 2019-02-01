import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { DomSanitizer } from '@angular/platform-browser';
import { TabsPage } from '../../pages/tabs/tabs';
import { FeedPage } from '../../pages/feed/feed';

/**
 * Generated class for the ClipDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'clip-details.html',
})
export class ClipDetailsPage {

    public data: any;
    public clip: any;

    public profile = this.profileService.get();

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
        public sanitizer: DomSanitizer, public alertCtrl: AlertController) {

        this.clip = this.clipService.getClip();

        console.log('ClipFile: ' + this.clip.file);

        var clipFile = "http://159.69.156.106" + this.clip.file;

        var trust = sanitizer.bypassSecurityTrustResourceUrl(clipFile);

        console.log('Trust: ' + trust);

        //Data on page
        this.data = {
            'clipFile': trust,
            'clipName': '',
            'clipImage': 'http://159.69.156.106' + this.clip.image,
            'share': true
        };

        console.log('UpdateClip scope params: ' + JSON.stringify(this.data));
    }

    public update() {
        
        if(this.data.clipName == null || this.data.clipName == ""){
            createClipPopup('Error', 'You must give your clip a name', this.alertCtrl);
            return;
        }
        
        //Data to submit to ClipService.update
        var clipParams = {
            'clipName': this.data.clipName,
            'clipId': this.clip.id
        }
        console.log('UpdateClip params: ' + JSON.stringify(clipParams));

        //Just the sessionToken to pass to next page (whatever that may be, depending on shared or not)
        var params = {
            'sessionToken': this.profile.sessionToken
        }

        //Update the name of the Clip
        var data: any;
        this.clipService.update(clipParams, this.profile.sessionToken).subscribe(
            response => {
                data = response;
                console.log(data);

                //only attempt sharing if update of name was successful

                //Check to see if sharing is necessary
                console.log('Share toggle: ' + this.data.share);
                if (this.data.share === true) {
                    //Share the clip
                    this.clipService.share(clipParams, this.profile.sessionToken).subscribe(
                        data => {
                            console.log(data);
                            
                            this.clipService.addNewClip(data);

                            createClipPopup('Success', 'Your clip has been created and is now visible on your Timeline page.', this.alertCtrl);
                            
                            this.navCtrl.pop();
                        })
                }
                else {
                    //Unshare the clip
                    this.clipService.unshare(clipParams, this.profile.sessionToken).subscribe(
                        data => {
                            console.log(data);
                            
                            this.clipService.addNewClip(data);
                            
                            createClipPopup('Success', 'Your clip has been created but is still private. You can see it on your profile page.', this.alertCtrl);

                            //Just go to timeline page without sharing 
                            //TODO Perhaps go back to Create page for same video?
                            this.navCtrl.pop();
                        })

                }

            })

        function createClipPopup(result, message, alertCtrl) {
            //Display error message
            let alert = alertCtrl.create({
                title: 'Create Clip ' + result,
                subTitle: message,
                buttons: ['OK']
            });
            alert.present();

        }

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ClipDetailsPage');
    }

}




