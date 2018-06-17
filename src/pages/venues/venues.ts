import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { VideonavProvider } from '../../providers/videonav/videonav';
import { DatesPage } from '../../pages/dates/dates';
import { TimesPage } from '../../pages/times/times';
import { CreateClipPage } from '../../pages/create-clip/create-clip';
/**
 * Generated class for the VenuesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'venues.html',
})
export class VenuesPage {

    profile = this.profileService.get();
    dates = this.videoNav.getDates();
    times = this.videoNav.getTimes();
    videoTime = this.videoNav.getVideoTime();

    public data: any;
    public venues: any;
    public cameras: any;
    public submitting: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
        public videoNav: VideonavProvider) {



        this.profile = {
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
            'model': null
        };

        console.log("Watch it user: " + JSON.stringify(this.profile));

        this.venues = [
            {
                "id": "1",
                "name": "JMMP Cobh"
            }
        ];

        this.data = {
            'venue': '',
            'date': '',
            'camera': '',
            'time': ''
        };

        this.cameras = [];

    }

    public submitVenues() {
        console.log("Fetching dates");
        this.submitting = true;

        //Test for presence of sessionToken
        console.log('WatchIt SessionToken: ' + this.profile.sessionToken);

        var dateParams = {
            'venueId': '1',
            'sessionToken': this.profile.sessionToken
        }

        var data: any;

        this.videoNav.browseDates(dateParams).subscribe(
            response => {

                data = response;

                console.log(data);

                var arrayLength = data.videos.length;
                var videos = data.videos;
                console.log("ArrayLength: " + arrayLength);
                var j = 1;
                for (var i = 0; i < arrayLength; i++) {
                    //console.log(i);
                    //Truncate videoTime to date only
                    var dateOnly = videos[i].videoTime.substring(0, 10);
                    //console.log(dateOnly);
                    var alreadyInList = false;
                    var datesSize = this.dates.length;
                    for (var k = 0; k < datesSize; k++) {
                        if (this.dates[k].value == dateOnly) {
                            alreadyInList = true;
                        }
                    }

                    if (!alreadyInList) {
                        this.dates.push({ "id": j, "value": dateOnly });
                        j++;
                    }
                }
                console.log("Dates are: " + JSON.stringify(this.dates));


                this.videoNav.setDates(this.dates.sort());

                //Go to next state, but the controller reloads, so save off dates first
                this.navCtrl.push(DatesPage);
            });
    };

    ionViewDidLoad() {
        console.log('ionViewDidLoad VenuesPage');
    }

}
