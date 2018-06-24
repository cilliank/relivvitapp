import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';

/**
 * Generated class for the OtherUserFollowersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-other-user-followers',
    templateUrl: 'other-user-followers.html',
})
export class OtherUserFollowersPage {

    public followers: any;
    public profile: any;
    public otherUser : any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public profileService: ProfileServiceProvider) {

        this.followers = [];
        
        this.profile = this.profileService.get();
        this.otherUser = this.profileService.getOtherUserLocal();

        var data: any;

        this.profileService.getOtherUser(this.otherUser.username, this.profile.sessionToken).subscribe(
            response => {
                
                data = response;
                
                this.followers = data.followers;
                
            });

        console.log('Other user followers: ' + this.followers);

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OtherUserFollowersPage');
    }

}
