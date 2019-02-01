import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { VideonavProvider } from '../../providers/videonav/videonav';
import { DomSanitizer } from '@angular/platform-browser';
import { ClipDetailsPage } from '../../pages/clip-details/clip-details';

/**
 * Generated class for the CreateClipPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'create-clip.html',
})


export class CreateClipPage {
    @ViewChild('videoPlayer') videoplayer: any;

    public times: any;
    public data: any;
    public clipStart: any;
    public currTime: any;
    public submitting: any;
    public video: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
        public videoNav: VideonavProvider,
        public sanitizer: DomSanitizer,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController) {

        var profile = this.profileService.get();

        this.video = this.clipService.getVideo();

        var videoTime = this.videoNav.getVideoTime();

        var videoId = this.video.id;

        var trust = this.sanitizer.bypassSecurityTrustResourceUrl(this.video.file);

        console.log('Trust: ' + trust);

        this.times = [];


        this.data = {
            'userId': profile.userId,
            'username': profile.username,
            'firstname': profile.firstname,
            'lastName': profile.lastName,
            'email': profile.email,
            'dateOfBirth': profile.dateOfBirth,
            'bio': profile.bio,
            'followers': profile.followers,
            'following': profile.following,
            'image': profile.image,
            'location': profile.location,
            'sessionToken': profile.sessionToken,
            'videoTime': videoTime,
            'camera': 1,
            'videoToGet': trust,
            'createdClips': []
        };

        console.log("User: " + JSON.stringify(this.data));
        console.log("Video to get: " + this.data.videoToGet);

        this.clipStart = '0';
        this.currTime = '0';
    }

    public switchCamera(camera) {

        this.video = this.clipService.getVideo();

        this.currTime = Math.round(this.videoplayer.nativeElement.currentTime);

        this.data.camera = camera;

        var switchParams = {
            'videoId': this.video.id,
            'camera': camera,
            'currTime': this.currTime,
            'addTime': 0
        };

        var data: any;

        this.clipService.switch(switchParams).subscribe(
            response => {

                data = response;
                
                //Update the local video so that it is using the switched version next time a video is created
                this.clipService.setVideo(data);

                var videoFile = "http://159.69.156.106" + data.file;

                var trust = this.sanitizer.bypassSecurityTrustResourceUrl(videoFile);

                this.data.videoToGet = trust;

                if (data.offset != null) {
                    this.videoplayer.nativeElement.setAttribute('src', trust);
                    this.videoplayer.nativeElement.load();
                    this.videoplayer.nativeElement.currentTime = data.offset;
                }

            });
    }

    public create() {

        var profile = this.profileService.get();
        this.video = this.clipService.getVideo();
        var videoId = this.video.id;

        console.log("Creating clip...");
        this.submitting = true;

        var videoHTML = this.videoplayer.nativeElement;
        videoHTML.pause();

        let loading = this.loadingCtrl.create({
            content: 'Creating Clip...'
        });

        loading.present();


        //Getting current time from video
        console.log("videoHTML: " + videoHTML);
        var currentTime = videoHTML.currentTime;
        console.log("Current time: " + currentTime);
        this.clipStart = currentTime;

        //Play video on page load
        //videoHTML.play();

        var clipParams = {
            "length": 10,
            "tags": [],
            "views": 0,
            "video_id": videoId,
            "start": this.clipStart,
            "name": 'DefaultName'
        }

        console.log('Clip Params: ' + JSON.stringify(clipParams));

        var data: any;

        this.clipService.create(clipParams, profile.sessionToken).subscribe(
            response => {

                data = response;

                if (data == null) {

                    let alert = this.alertCtrl.create({
                        title: 'Create Clip Error',
                        subTitle: 'There was a problem creating your clip',
                        buttons: ['OK']
                    });
                    alert.present();
                }

                console.log(data);

                var videoHTML = this.videoplayer.nativeElement;
                videoHTML.play();

                loading.dismiss();

                this.submitting = false;

                this.clipService.setClip(data);

                //TODO - Decide what to do. Add to carousel, or go straight to clip details page
                this.data.createdClips.push(data);
                this.navCtrl.push(ClipDetailsPage, data);
            })

    };

    public clipDetails(clip) {
        this.navCtrl.push(ClipDetailsPage, clip);
    }

    public skip(skip) {

        //Setting current time from video
        var videoHTML = this.videoplayer.nativeElement;
        console.log("videoHTML: " + videoHTML);
        var currentTime = videoHTML.currentTime;
        console.log("Current time: " + currentTime);

        var newCurrentTime = currentTime + skip;

        console.log('New currentTime: ' + newCurrentTime);

        if (newCurrentTime > 0 && newCurrentTime < videoHTML.duration) {
            //New desired time is within the current video
            this.videoplayer.nativeElement.currentTime = newCurrentTime;
        }
        else {

            //Shift to next/previous video using magic switch function
            var video = this.clipService.getVideo();

            this.currTime = Math.round(currentTime);

            var switchParams = {
                'videoId': this.video.id,
                //Stay with current camera
                'camera': this.video.camera,
                'currTime': this.currTime,
                'addTime': skip
            };

            var data: any;

            this.clipService.switch(switchParams).subscribe(
                response => {

                    data = response;

                    if (data != null) {
                        //Update video in service, so next time button is pressed, it has updated current video
                        this.clipService.setVideo(data);
                        this.video = data;

                        var videoFile = "http://159.69.156.106" + data.file;

                        var trust = this.sanitizer.bypassSecurityTrustResourceUrl(videoFile);

                        this.data.videoToGet = trust;

                        if (data.offset != null) {
                            this.videoplayer.nativeElement.setAttribute('src', trust);
                            this.videoplayer.nativeElement.load();
                            this.videoplayer.nativeElement.currentTime = data.offset;
                        }
                    }
                    else {
                        //The current video must be the earliest/latest in the list, so just skip back to the start of it
                        var videoHTML = this.videoplayer.nativeElement;
                        if (skip < 0) {
                            this.videoplayer.nativeElement.currentTime = 0;
                        }
                        else {
                            this.videoplayer.nativeElement.currentTime = videoHTML.duration < 1;
                        }

                    }


                });
        }


        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
    }

    public forward(skip) {

        //Setting current time from video
        var videoHTML = this.videoplayer.nativeElement;
        console.log("videoHTML: " + videoHTML);
        var currentTime = videoHTML.currentTime;
        console.log("Current time: " + currentTime);

        var newCurrentTime = currentTime + skip;
        var duration = videoHTML.duration;

        console.log('New currentTime: ' + newCurrentTime);

        if (newCurrentTime < duration) {
            this.videoplayer.nativeElement.currentTime = newCurrentTime;
        }
        else {
            this.videoplayer.nativeElement.currentTime = duration - 1;
        }


    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CreateClipPage');
    }

}
