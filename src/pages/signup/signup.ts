import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SignupProvider } from '../../providers/signup/signup';
import { LoginProvider } from '../../providers/login/login';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { TabsPage } from '../../pages/tabs/tabs';
import { TermsPage } from '../../pages/terms/terms';
import { VenuesPage } from '../../pages/venues/venues';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'signup.html',
})
export class SignupPage {

    public data: Object;

    //Check if user has already logged in on this phone
    username = window.localStorage.getItem("username");
    password = window.localStorage.getItem("password");

    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
        public Signup: SignupProvider,
        public Login: LoginProvider,
        public ProfileService: ProfileServiceProvider) {

        if (this.username != null) {
            var loginData = { 'username': this.username, 'password': this.password };

            this.Login.go(loginData).subscribe(

                user => {

                    this.data.sessionToken = user.data["session-token"];

                    var userParams = {
                        userId: user.data["user-id"],
                        username: user.data.account.username,
                        firstname: user.data.account.firstname,
                        lastName: user.data.account.lastName,
                        email: user.data.account.email,
                        dateOfBirth: user.data.account.dateOfBirth,
                        bio: user.data.account.bio,
                        followers: user.data.account.numFollowers,
                        following: user.data.account.numFollowing,
                        image: user.data.account.image,
                        location: user.data.account.location,
                        sessionToken: this.data.sessionToken
                    };
                    this.ProfileService.set(userParams);
                    this.ProfileService.setFollowing(user.data.account.following);
                    this.navCtrl.push(TabsPage);
                });
        }

        //Fetch the partial data (if present)
        this.data = this.ProfileService.getSignupPartialData();
    }

    public terms() {
        this.navCtrl.push(TermsPage);
    }

    public done() {

        //Save off input data, to reload it in the case of a validation error
        this.ProfileService.setSignupPartialData(this.data);

        //Validate input data
        var valid = validateSignupData(this.data, this.alertCtrl, this.ProfileService, this.data.sessionToken);

        if (!valid) {
            return false;
        }

        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();


        var signupData = {
            'firstname': this.data.firstname,
            'lastName': this.data.lastName,
            'username': this.data.username,
            'password': this.data.password,
            'email': this.data.email
        };

        this.Signup.go(signupData).subscribe(

            data => {
                //Then signup was successful 
                //So log the user in and take them to the add friends page
                var loginData = { 'username': this.data.username, 'password': this.data.password };

                this.Login.go(loginData).subscribe(

                    data => {

                        this.data.sessionToken = data["session-token"];

                        var userParams = {
                            userId: data["user-id"],
                            username: data.account.username,
                            firstname: data.account.firstname,
                            lastName: data.account.lastName,
                            email: data.account.email,
                            dateOfBirth: data.account.dateOfBirth,
                            bio: data.account.bio,
                            followers: data.account.numFollowers,
                            following: data.account.numFollowing,
                            image: data.account.image,
                            location: data.account.location,
                            sessionToken: this.data.sessionToken
                        };
                        this.ProfileService.set(userParams);
                        this.ProfileService.setFollowing(data.account.following);

                    });


                setTimeout(() => {
                    loading.dismiss();
                    this.navCtrl.push(TabsPage);
                }, 5000);

            });


        function validateSignupData(data, alertCtrl, profileService, sessionToken) {
            //Check firstname not null
            if (data.firstname.length == 0) {
                createSignupPopup('You must enter your first name', alertCtrl);
                return false;
            }
            //Check lastname not null
            if (data.lastName.length == 0) {
                createSignupPopup('You must enter your last name', alertCtrl);
                return false;
            }
            //Check username not null
            if (data.username.length < 4) {
                createSignupPopup('Your username must be greater than 3 characters', alertCtrl);
                return false;
            }
            //Check username not taken
            else {
                profileService.checkUserExists(data.username, sessionToken).subscribe(

                    data => {

                        if (data.exists) {
                            loading.dismiss();
                            createSignupPopup('Sorry, that username is already taken. Try another one.', alertCtrl);
                            return false;
                        }

                    });
            }

            //Check password is over 8 characters
            if (data.password.length < 8) {
                createSignupPopup('Your password must be greater than 8 characters', alertCtrl);
                return false;
            }
            //Check email address is a valid email address
            if (!validateEmail(data.email)) {
                createSignupPopup('The email address you entered is not valid', alertCtrl);
                return false;
            }
            return true;
        }
        function createSignupPopup(message, alertCtrl) {
            //Display error message
            let alert = alertCtrl.create({
                title: 'Signup Error',
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
        console.log('ionViewDidLoad SignupPage');
    }

}
