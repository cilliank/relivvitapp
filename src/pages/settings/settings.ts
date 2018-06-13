import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { PasswordPage } from '../../pages/password/password';
import { GreetingPage } from '../../pages/greeting/greeting';

import { PhotoLibrary } from '@ionic-native/photo-library';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    public data: any;

    //Get the current user profile
    profile = this.ProfileService.get();

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public ProfileService: ProfileServiceProvider,
        public alertCtrl: AlertController) {

        this.data = {
            'userId': this.profile.userId,
            'username': this.profile.username,
            'firstname': this.profile.firstname,
            'lastName': this.profile.lastName,
            'email': this.profile.email,
            'dateOfBirth': this.profile.dateOfBirth,
            'bio': this.profile.bio,
            'followers': this.profile.followers,
            'following': this.profile.following,
            'image': this.profile.image,
            'location': this.profile.location,
            'sessionToken': this.profile.sessionToken,
            'numClips': 0,
            'feedClips': [],
            'clipName': '',
            'clipId': '',
            'noClipsMessage1': '',
            'noClipsMessage2': ''
        };
    }
    
    public 

    public updateProfile(email, bio, location) {

        var updateData = {
            'id': this.profile.userId,
            'email': this.profile.email,
            'bio': this.profile.bio,
            'location': this.profile.location
        }
        var update = false;

        var currentEmail = this.profile.email;
        var newEmail = document.getElementById("email").innerText;
        if (currentEmail != newEmail) {
            console.log('Updating email: ' + newEmail);

            //Validate new email
            var validEmail = validateEmail(newEmail);
            if (validEmail) {
                //Then the email address has been updated
                updateData.email = newEmail;
                update = true;
            }
            else {
                createProfilePopup('Error', 'The email address you entered is not valid', this.alertCtrl);
                return false;
            }
        }

        var currentBio = this.profile.bio;
        var newBio = document.getElementById("bio").innerText;
        if (currentBio != newBio) {
            console.log('Updating bio: ' + newBio);

            //Validate new bio
            if (newBio.length < 280) {
                //Then the bio has been updated
                updateData.bio = newBio;
                update = true;
            }
            else {
                createProfilePopup('Error', 'The bio you entered is too long. Max 280 characters', this.alertCtrl);
                return false;
            }
        }

        var currentLocation = this.profile.location;
        var newLocation = document.getElementById("location").innerText;
        if (currentLocation != newLocation) {
            console.log('Updating location: ' + newLocation);

            //Validate new location
            if (newLocation.length < 50) {
                //Then the location has been updated
                updateData.location = newLocation;
                update = true;
            }
            else {
                createProfilePopup('Error', 'The location you entered is too long. Max 50 characters', this.alertCtrl);
                return false;
            }
        }

        if (update) {
            this.ProfileService.save(updateData, this.profile.sessionToken).subscribe(

                data => {
                    createProfilePopup('Success', 'Your profile has been updated', this.alertCtrl);
                    this.profile.email = newEmail;
                    this.profile.bio = newBio;
                    this.profile.location = newLocation;
                    this.ProfileService.set(this.profile);
                    //$state.reload();
                    return true;
                });
        }


        function createProfilePopup(result, message, alertCtrl) {
            //Display error message
            let alert = alertCtrl.create({
                title: 'Update ' + result,
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

    public changePassword() {
        this.navCtrl.push(PasswordPage);
    }

    public logout() {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        this.navCtrl.push(GreetingPage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage');
    }

}
