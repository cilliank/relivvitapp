import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ResetPage } from '../../pages/reset/reset';
import { TabsPage } from '../../pages/tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'login.html',
})
export class LoginPage {

    public data: any;

    errorMessageLine1 = '';
    errorMessageLine2 = '';

    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
        public Login: LoginProvider,
        public ProfileService: ProfileServiceProvider) {

        this.data = {
            'username': '',
            'password': '',
            'email': ''
        };
    }

    public resetPassword() {
        this.navCtrl.push(ResetPage);
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

            var responseData : any;
            
            this.Login.reset(resetData)
                .subscribe(
                data => {
                    
                    responseData = data;
                    
                    loading.dismiss();
                    if (responseData.error == null) {
                        createResetPopup('Success', 'Check your emails and follow the instructions.', this.alertCtrl);
                    }
                    else {
                        createResetPopup('Error', responseData.error, this.alertCtrl);
                    }
                },
                error => {
                    loading.dismiss();
                    createResetPopup('Error', error.errors[0].messages[0], this.alertCtrl);
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



    public done() {

        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();

        var loginData = { 'username': this.data.username, 'password': this.data.password };
        
        var responseData : any;

        this.Login.go(loginData)
            .subscribe(
            data => {

                responseData = data;

                this.data.sessionToken = responseData["session-token"];

                //Store the user in local Storage so that it can be checked the next time someone tries to Login
                //And then that person is logged in automatically. Prevents having to login fresh everytime
                window.localStorage.setItem("username", this.data.username);
                window.localStorage.setItem("password", this.data.password);

                var userParams = {
                    userId: responseData["user-id"],
                    username: responseData.account.username,
                    firstname: responseData.account.firstname,
                    lastName: responseData.account.lastName,
                    email: responseData.account.email,
                    dateOfBirth: responseData.account.dateOfBirth,
                    bio: responseData.account.bio,
                    followers: responseData.account.numFollowers,
                    following: responseData.account.numFollowing,
                    image: responseData.account.image,
                    location: responseData.account.location,
                    sessionToken: this.data.sessionToken
                };
                this.ProfileService.set(userParams);

                this.ProfileService.setFollowing(responseData.account.following);

                setTimeout(() => {
                    loading.dismiss();
                    this.navCtrl.push(TabsPage);
                }, 1000);

            },
            error => {
                //Problem logging in
                loading.dismiss();
                if (error.errors != null) {
                    //Get message, but don't have to use it. Can use generic message instead
                    //var errorMessage = error.errors[0].messages[0];
                    this.errorMessageLine1 = "Could not Login";
                    this.errorMessageLine2 = "Username or Password incorrect";
                }
            });
    }



    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

}
