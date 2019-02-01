import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { VideonavProvider } from '../../providers/videonav/videonav';
import { CreateClipPage } from '../../pages/create-clip/create-clip';

/**
 * Generated class for the TimesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'times.html',
})
export class TimesPage {

    profile = this.profileService.get();
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
    }

    public getVideo(videoData) {
        console.log("Getting video with id: " + videoData.value);
        this.submitting = true;

        this.videoNav.setVideoTime(videoData.value);

        var videoParams = {
            'video': videoData.id,
            'sessionToken': this.profile.sessionToken
        }

        console.log("VideoParams from WatchIt: " + JSON.stringify(videoParams));

        var data: any;

        this.videoNav.browseVideo(videoParams).subscribe(
            response => {
                data = response;
                console.log(data);

                var params = {
                    'videoFile': data.file,
                    'videoId': data.id,
                    'sessionToken': this.profile.sessionToken
                }

                console.log("Video filepath" + data.file)
                console.log("Params from WatchIt: " + JSON.stringify(params));

                var videoData = {
                    id: data.id,
                    file: "http://159.69.156.106" + data.file,
                    camera: data.camera
                }

                this.clipService.setVideo(videoData);

                this.navCtrl.push(CreateClipPage, params);

            });




    };

    ionViewDidLoad() {
        console.log('ionViewDidLoad TimesPage');
    }

}
