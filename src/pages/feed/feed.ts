import { Component, NgZone } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { OtherUserPage } from '../../pages/other-user/other-user';
import { PeoplePage } from '../../pages/people/people';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';

import { PhotoLibrary } from '@ionic-native/photo-library';

/**
 * Generated class for the FeedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'feed.html',
})
export class FeedPage {

    private static options = {
        message: '', // not supported on some apps (Facebook, Instagram)
        subject: '', // for email
        files: [''], // an array of filenames either locally or remotely
        url: ''
    };

    public data: any;

    //Get the current user profile
    profile = this.profileService.get();


    ionViewWillEnter() {

        var protocol = "http://";
        var website = "138.201.90.98";

        var newClips = this.clipService.getNewClips();


        var data: any;

        this.clipService.getShared(this.profile.sessionToken).subscribe(

            response => {

                data = response;

                console.log("Feed clips: " + JSON.stringify(data));

                this.data.numClips = data.length;

                if (this.data.numClips == 0) {
                    this.data.notFollowingAnyoneMessage1 = "You are not following anyone.";
                    this.data.notFollowingAnyoneMessage2 = "Get following!";
                }

                console.log("Number of Feed Clips: " + this.data.numClips);

                var thisFeedClips = [];
                var thisSanitizer = this.sanitizer;

                //Create array of clip ids so that the html can loop through it (posts.html)
                data.forEach(function(clip) {
                    console.log(clip);

                    var feedClip = new FeedClip(
                        clip.id,
                        clip.name,
                        clip.views,
                        clip.likes,
                        clip.file,
                        clip.image,
                        clip.user.firstname,
                        clip.user.lastName,
                        clip.user.username,
                        clip.user.image,
                        thisSanitizer
                    );

                    thisFeedClips.push(feedClip);
                });
                this.data.feedClips = thisFeedClips;

            });

        if (newClips == null || newClips.length == 0) {
            console.log("No new clips have been created. Grand so.");
        } else {
            console.log("The following new clips have been created and should be pushed on to the FeedClips list (unshift)" + newClips);

            var thisFeedClips = this.data.feedClips;
            var thisSanitizer = this.sanitizer;

            newClips.forEach(function(newClip) {
                console.log(newClip);

                var feedClip = new FeedClip(
                    newClip.id,
                    newClip.name,
                    newClip.views,
                    newClip.likes,
                    newClip.file,
                    newClip.image,
                    newClip.user.firstname,
                    newClip.user.lastName,
                    newClip.user.username,
                    newClip.user.image,
                    thisSanitizer
                );

                thisFeedClips.unshift(feedClip);
            });

            this.data.feedClips = thisFeedClips;

            /*this.zone.run(() => {
                console.log('force update the screen');
            });*/

            //Clear the new clips so that we don't keep adding them every time the user navigates to this page. Just need to add them once
            this.clipService.clearNewClips();
        }

        function FeedClip(id, name, views, likes, file, clipImage, firstname, lastName, username, image, sanitizer) {
            this.id = id;
            this.name = name;
            this.views = views;
            this.likes = likes;

            var clipFile = protocol + website + file;
            //var trustFile = $sce.trustAsResourceUrl(clipFile);
            var trustFile = sanitizer.bypassSecurityTrustResourceUrl(clipFile);
            this.clipImage = protocol + website + clipImage;

            this.file = trustFile;
            this.firstname = firstname;
            this.lastName = lastName;
            this.username = username;
            this.image = protocol + website + image;
        };
    }

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
        public sanitizer: DomSanitizer,
        private photoLibrary: PhotoLibrary,
        private socialSharing: SocialSharing,
        private transfer: FileTransfer,
        private file: File,
        private device: Device,
        public loadingCtrl: LoadingController,
        public zone: NgZone) {

        var protocol = "http://";
        var website = "138.201.90.98";

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
            'notFollowingAnyoneMessage1': '',
            'notFollowingAnyoneMessage2': ''
        };

        function FeedClip(id, name, views, likes, file, clipImage, firstname, lastName, username, image) {
            this.id = id;
            this.name = name;
            this.views = views;
            this.likes = likes;

            var clipFile = protocol + website + file;
            //var trustFile = $sce.trustAsResourceUrl(clipFile);
            var trustFile = sanitizer.bypassSecurityTrustResourceUrl(clipFile);
            this.clipImage = protocol + website + clipImage;

            this.file = trustFile;
            this.firstname = firstname;
            this.lastName = lastName;
            this.username = username;
            this.image = protocol + website + image;
        };

        console.log("FeedUser: " + JSON.stringify(this.data));

        var sessionToken = this.data.sessionToken;

        //Get the most recently created videos for user which this user follows

        var data: any;

        clipService.getShared(sessionToken).subscribe(

            response => {

                data = response;

                console.log("Feed clips: " + JSON.stringify(data));

                this.data.numClips = data.length;

                if (this.data.numClips == 0) {
                    this.data.notFollowingAnyoneMessage1 = "You are not following anyone.";
                    this.data.notFollowingAnyoneMessage2 = "Get following!";
                }

                console.log("Number of Feed Clips: " + this.data.numClips);

                var thisFeedClips = [];

                //Create array of clip ids so that the html can loop through it (posts.html)
                data.forEach(function(clip) {
                    console.log(clip);

                    var feedClip = new FeedClip(
                        clip.id,
                        clip.name,
                        clip.views,
                        clip.likes,
                        clip.file,
                        clip.image,
                        clip.user.firstname,
                        clip.user.lastName,
                        clip.user.username,
                        clip.user.image
                    );

                    thisFeedClips.push(feedClip);
                });
                this.data.feedClips = thisFeedClips;

            });

    }

    doRefresh(refresher) {
        var protocol = "http://";
        var website = "138.201.90.98";

        var sessionToken = this.data.sessionToken;

        //Get the most recently created videos for user which this user follows

        var data: any;
        var thisSanitizer = this.sanitizer;

        this.clipService.getShared(sessionToken).subscribe(

            response => {

                data = response;

                console.log("Feed clips: " + JSON.stringify(data));

                this.data.numClips = data.length;

                if (this.data.numClips == 0) {
                    this.data.notFollowingAnyoneMessage1 = "You are not following anyone.";
                    this.data.notFollowingAnyoneMessage2 = "Get following!";
                }

                console.log("Number of Feed Clips: " + this.data.numClips);

                var thisFeedClips = [];

                //Create array of clip ids so that the html can loop through it (posts.html)
                data.forEach(function(clip) {
                    console.log(clip);

                    var feedClip = new FeedClip(
                        clip.id,
                        clip.name,
                        clip.views,
                        clip.likes,
                        clip.file,
                        clip.image,
                        clip.user.firstname,
                        clip.user.lastName,
                        clip.user.username,
                        clip.user.image
                    );

                    thisFeedClips.push(feedClip);
                });
                this.data.feedClips = thisFeedClips;

            });
        refresher.complete();

        function FeedClip(id, name, views, likes, file, clipImage, firstname, lastName, username, image) {
            this.id = id;
            this.name = name;
            this.views = views;
            this.likes = likes;

            var clipFile = protocol + website + file;
            //var trustFile = $sce.trustAsResourceUrl(clipFile);
            var trustFile = thisSanitizer.bypassSecurityTrustResourceUrl(clipFile);
            this.clipImage = protocol + website + clipImage;

            this.file = trustFile;
            this.firstname = firstname;
            this.lastName = lastName;
            this.username = username;
            this.image = protocol + website + image;
        };
    }

    public increasePlayCount(clipId) {
        console.log('Increasing play count for clip: ' + clipId);
    };

    public share(type, file, image, clipName) {
        if (type == 'f') {
            /*this.socialSharing.shareViaFacebook(clipName, '', file).then(() => {
                // Success!
                console.log('Sharing to Facebook: ' + clipName);
            }).catch(() => {
                // Error!
            });*/
        }
        if (type == 't') {
            this.socialSharing.shareViaTwitter(clipName, file, file).then(() => {
                // Success!
                console.log('Sharing to Twitter: ' + clipName);
            }).catch(() => {
                // Error!
            });

        }
        if (type == 'w') {
            this.socialSharing.shareViaWhatsApp(clipName, file, file).then(() => {
                // Success!
                console.log('Sharing to Whatsapp: ' + clipName);
            }).catch(() => {
                // Error!
            });

        }
        if (type == 'i') {
            this.socialSharing.shareViaInstagram(clipName, file).then(() => {
                // Success!
                console.log('Sharing to Instagram: ' + clipName);
            }).catch(() => {
                // Error!
            });

        }
    };

    public goUser(data) {

        var data: any;

        this.profileService.getOtherUser(data, this.data.sessionToken).subscribe(

            response => {

                data = response;

                this.profileService.setOtherUserLocal(data);

                this.navCtrl.push(OtherUserPage);

            });

    };

    public saveToCameraRoll(file) {
        /*console.log("Download to camera roll. " + file);

        let loading = this.loadingCtrl.create({
            content: 'Saving Video...'
        });

        loading.present();

        //based on device type choosing the location to save the video
        if (this.device.platform == "ios") {
            var path = this.file.documentsDirectory;
            var filename = file;
        } else {
            var path = this.file.externalRootDirectory;
            //var filename = "preview" + $filter('date')(new Date(), "yyyy-MM-dd     HH:mm:ss") + ".mp4";
        }
        //Creating directory to save video in the device
        var targetPath = path + "dir/" + filename;

        var fileTransfer: FileTransferObject = this.transfer.create();

        this.file.createDir(path, "dir", true).then(
            data => {
                var trustHosts = true;
                var options = {};
                //Downloading the file from URL.
                fileTransfer.download(file, targetPath, trustHosts, options).then(
                    data => {
                        //Once downloaded the file calling function to add the video to photo library
                        if (this.device.platform == "ios") {

                            savelibrary(targetPath)
                        } else {
                            //add refresh media plug in for refresh the gallery for android to see the downloaded video.
                            //refreshMedia.refresh(targetPath);
                        }
                        loading.dismiss();

                        //$cordovaToast.show("Vidoe saved successfully", "long", "center");
                    }, 
                    error => {

                        loading.dismiss();
                        //$cordovaToast.show("Oops! unable to save video, please try after sometime.", "long", "center");
                    });
            }, 
            error => {
                //alert(JSON.stringify(error));                
                loading.dismiss();
                //$cordovaToast.show("Oops! unable to save video, please try after sometime.", "long", "center");
            });

        function savelibrary(targetPath) {
            this.photoLibrary.saveVideo(targetPath, 'Relivvit Videos', function(success) { }, function(err) {
                if (err.startsWith('Permission')) {
                    this.photoLibrary.requestAuthorization(function() {
                        savelibrary(targetPath);
                    }, function(err) {
                        loading.dismiss();
                        //$cordovaToast.show("Oops! unable to save video, please try after sometime.", "long", "center");
                        // User denied the access
                    }, // if options not provided, defaults to {read: true}.
                        {
                            read: true,
                            write: true
                        });
                }
            });
        }

        /*var data : any;
        var trustFile : SafeResourceUrl;
        
        this.photoLibrary.requestAuthorization({}).then(
        
            response => {
                data = response;
                
                var fileStr = file.toString();
                
                trustFile = this.sanitizer.bypassSecurityTrustUrl(fileStr);
                
                this.photoLibrary.saveVideo(trustFile.toString(),"Relivvit Videos");
                
            }
        );  
        
        const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(file, this.file.applicationStorageDirectory + file).then((entry) => {

             this.options.message = " Your message";
             this.options.subject = "Your Subject";
             this.options.files = [entry.toURL()];
             this.options.url = "https://www.google.com.tr/";

             SocialSharing.shareWithOptions(this.options);

          }, 
          (error) => {
          
          }); */

    }

    public openPeople() {
        this.navCtrl.push(PeoplePage);
    };

    ionViewDidLoad() {
        console.log('ionViewDidLoad FeedPage');
    }

}
