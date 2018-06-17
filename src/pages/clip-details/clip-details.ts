import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { DomSanitizer } from '@angular/platform-browser';
import { TabsPage } from '../../pages/tabs/tabs';

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
    public clip : any;

    public profile = this.profileService.get();

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
        public sanitizer: DomSanitizer) {

        this.clip = this.clipService.getClip();

        console.log('ClipFile: ' + this.clip.file);

        var clipFile = "http://138.201.90.98" + this.clip.file;

        var trust = sanitizer.bypassSecurityTrustResourceUrl(clipFile);

        console.log('Trust: ' + trust);

        //Data on page
        this.data = {
            'clipFile': trust,
            'clipName': '',
            'clipImage': 'http://138.201.90.98' + this.clip.image,
            'share': ''
        };

        console.log('UpdateClip scope params: ' + JSON.stringify(this.data));
    }

    public update() {
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

                            this.navCtrl.push(TabsPage);
                        })
                }
                else {
                    //Unshare the clip
                    this.clipService.unshare(clipParams, this.profile.sessionToken).subscribe(
                        data => {
                            console.log(data);

                            //Just go to timeline page without sharing 
                            //TODO Perhaps go back to Create page for same video?
                            this.navCtrl.push(TabsPage);
                        })

                }

            })

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ClipDetailsPage');
    }

}




