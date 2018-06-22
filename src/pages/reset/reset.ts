import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';

/**
 * Generated class for the ResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'reset.html',
})
export class ResetPage {

    public data: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
        public Login: LoginProvider) {

        this.data = {};
        this.data.email = '';

    }

    public reset() {

        var email = this.data.email;

        console.log('Email used for password reset: ' + email);

        //Validate reset email
        var validEmail = validateEmail(email);
        if (validEmail) {
            //Then the email address is valid - so call the reset API
            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            loading.present();
            var resetData = {
                'email': email
            }

            var data: any;

            this.Login.reset(resetData)
                .subscribe(
                response => {

                    data = response;

                    loading.dismiss();
                    if (data.error == null) {
                        createResetPopup('Success', 'Check your emails and follow the instructions.', this.alertCtrl);
                    }
                    else {
                        createResetPopup('Error', data.error, this.alertCtrl);
                    }
                },
                error => {
                    loading.dismiss();
                    createResetPopup('Error', data.errors[0].messages[0], this.alertCtrl);
                });

        }
        else {
            createResetPopup('Error', 'The email address you entered is not valid', this.alertCtrl);
            return false;
        }



        function createResetPopup(result, message, alertCtrl) {
            //Display error message
            let alert = alertCtrl.create({
                title: 'Reset ' + result,
                subTitle: message,
                buttons: ['OK']
            });
            alert.present();

        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ResetPage');
    }

}
