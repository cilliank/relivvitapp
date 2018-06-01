import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { GreetingPage } from '../../pages/greeting/greeting';

/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-password',
    templateUrl: 'password.html',
})
export class PasswordPage {

    public data: Object;

    //Get the current user profile
    profile = this.ProfileService.get();

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public ProfileService: ProfileServiceProvider) {


        this.data = {
            'id': this.profile.userId,
            'password': '',
            'confirmPassword': ''
        };
    }

    public done() {

        this.ProfileService.save(this.data, this.profile.sessionToken).subscribe(

            data => {

                this.navCtrl.push(GreetingPage);

            });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordPage');
    }

}




