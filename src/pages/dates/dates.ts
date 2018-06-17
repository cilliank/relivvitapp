import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { VideonavProvider } from '../../providers/videonav/videonav';
import { TimesPage } from '../../pages/times/times';

/**
 * Generated class for the DatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'dates.html',
})
export class DatesPage {

    profile = this.profileService.get();
    dates = this.videoNav.getDates();
    times = this.videoNav.getTimes();
    videoTime = this.videoNav.getVideoTime();

    public data: any;
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

        this.data = {
            'venue': '',
            'date': '',
            'camera': '',
            'time': ''
        };

        this.cameras = [];
    }

    public submitDates(created) {
        console.log("Fetching cameras");
        this.submitting = true;

        //Clear other selections
        this.cameras = [];
        this.data.camera = '';
        this.times = [];
        this.data.time = '';

        var cameraParams = {
            'venueId': '1',
            'created': created,
            'sessionToken': this.profile.sessionToken
        }

        console.log("CameraParams: " + JSON.stringify(cameraParams));

        var data: any;

        this.videoNav.browseCameras(cameraParams).subscribe(
            response => {
                data = response;
                console.log(data);
                var arrayLength = data.videos.length;
                var videos = data.videos;
                console.log("ArrayLength: " + arrayLength);
                var j = 1;
                for (var i = 0; i < arrayLength; i++) {
                    //console.log(i);

                    //Get the camera value
                    var cameraNum = data.videos[i].camera;

                    var alreadyInList = false;
                    var camerasSize = this.cameras.length;
                    for (var k = 0; k < camerasSize; k++) {
                        if (this.cameras[k].id == cameraNum) {
                            alreadyInList = true;
                        }
                    }

                    if (!alreadyInList) {
                        this.cameras.push({ "id": j, "value": "Camera " + cameraNum });
                        j++;
                    }
                }
                console.log("Cameras are: " + JSON.stringify(this.cameras));


                return this.cameras.sort();

            });
    };

    public submitCameras(created) {
        console.log("Fetching times");
        this.submitting = true;

        //Clear other selections
        this.times = [];
        this.data.time = '';

        //Get the camera value from camera id
        var camerasSize = this.cameras.length;
        var camera = this.data.camera;


        var timeParams = {
            'venueId': '1',
            'created': created,
            'camera': 1,
            'sessionToken': this.profile.sessionToken
        }
        this.videoNav.setTimeParams(timeParams);

        console.log("TimeParams: " + JSON.stringify(timeParams));

        var data: any;

        this.videoNav.browseTimes(timeParams).subscribe(
            response => {
                data = response;
                console.log(data);
                var arrayLength = data.videos.length;
                var videos = data.videos;
                console.log("ArrayLength: " + arrayLength);
                for (var i = 0; i < arrayLength; i++) {
                    //No need to check for repetition because the time values in the returned videos will be unique
                    //Extract time
                    var rawTime = videos[i].videoTime;
                    var time = rawTime.substring(11, 16);

                    //Set the actual id of the video, NOT an auto-increment id
                    var id = videos[i].id;

                    this.times.push({ "id": id, "value": time });
                }

                var orderedTimes = this.times.sort(function(a, b) {
                    var nameA = a.value, nameB = b.value
                    if (nameA < nameB) //sort string ascending
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0 //default return value (no sorting)
                })

                console.log("Ordered times: " + JSON.stringify(orderedTimes));

                this.videoNav.setTimes(orderedTimes);
                //Go to next state, but the controller reloads, so save off times first
                this.navCtrl.push(TimesPage);


            });
        }

        ionViewDidLoad() {
            console.log('ionViewDidLoad DatesPage');
        }

    }
