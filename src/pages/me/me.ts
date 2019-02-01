import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { PeoplePage } from '../../pages/people/people';
import { FollowersPage } from '../../pages/followers/followers';
import { FollowingPage } from '../../pages/following/following';
import { SettingsPage } from '../../pages/settings/settings';
import { DomSanitizer } from '@angular/platform-browser';
//import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the MePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'me.html',
})
export class MePage {

    public data: any;
    base64Image: any;

    //Get the current user profile
    profile = this.ProfileService.get();

    ionViewWillEnter() {

        var protocol = "http://";
        var website = "159.69.156.106";

        var newClips = this.ClipService.getNewProfileClips();

        if (newClips == null || newClips.length == 0) {
            console.log("No new clips have been created. Grand so.");
        } else {
            console.log("The following new clips have been created and should be pushed on to the FeedClips list (unshift)" + newClips);

            var thisFeedClips = this.data.feedClips;
            var thisSanitizer = this.sanitizer;

            newClips.forEach(function(newClip) {
                console.log(newClip);

                var shared2 = false;
                var shareAction = '';

                if (newClip.shared) {
                    shared2 = true;
                    shareAction = 'Unshare';
                }
                else {
                    shared2 = false;
                    shareAction = 'Share';
                };

                var feedClip = new OwnClip(
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
                    shared2,
                    shareAction,
                    thisSanitizer
                );

                thisFeedClips.unshift(feedClip);
            });

            this.data.feedClips = thisFeedClips;

            /*this.zone.run(() => {
                console.log('force update the screen');
            });*/

            //Clear the new profile clips so that we don't keep adding them every time the user navigates to this page. Just need to add them once
            this.ClipService.clearNewProfileClips();
        }

        function OwnClip(id, name, views, likes, file, clipImage, firstname, lastName, username, image, shared, shareAction, sanitizer) {
            this.id = id;
            this.name = name;
            this.views = views;
            this.likes = likes;

            var clipFile = protocol + website + file;
            var trustFile = sanitizer.bypassSecurityTrustResourceUrl(clipFile);
            this.clipImage = protocol + website + clipImage;

            this.file = trustFile;
            this.firstname = firstname;
            this.lastName = lastName;
            this.username = username;
            this.image = protocol + website + image;
            this.shared = shared;
            this.shareAction = shareAction;
        };
    }

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public ProfileService: ProfileServiceProvider,
        public ClipService: ClipServiceProvider,
        public sanitizer: DomSanitizer,
        //private camera: Camera,
        public alertCtrl: AlertController) {

        var protocol = "http://";
        var website = "159.69.156.106";



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

        function OwnClip(id, name, views, likes, file, clipImage, firstname, lastName, username, image, shared, shareAction) {
            this.id = id;
            this.name = name;
            this.views = views;
            this.likes = likes;

            var clipFile = protocol + website + file;
            var trustFile = sanitizer.bypassSecurityTrustResourceUrl(clipFile);
            this.clipImage = protocol + website + clipImage;

            this.file = trustFile;
            this.firstname = firstname;
            this.lastName = lastName;
            this.username = username;
            this.image = protocol + website + image;
            this.shared = shared;
            this.shareAction = shareAction;
        };

        console.log("FeedUser: " + JSON.stringify(this.data));

        var clipData = {
            'sessionToken': this.data.sessionToken,
            'userId': this.profile.userId
        }

        var data: any;

        //Get the most recently created videos for user which this user follows
        ClipService.getUsersOwnClips(clipData).subscribe(

            response => {

                data = response;

                console.log("Feed clips: " + JSON.stringify(data));

                this.data.numClips = data.length;

                console.log("Number of Feed Clips: " + this.data.numClips);

                if (this.data.numClips == 0) {
                    this.data.noClipsMessage1 = 'You have not created any Clips yet';
                    this.data.noClipsMessage2 = 'What are you waiting for? Relivvit!';
                }

                var thisFeedClips = [];
                //Create array of clip ids so that the html can loop through it (posts.html)
                data.forEach(function(clip) {
                    console.log(clip);

                    var shared2 = false;
                    var shareAction = '';

                    if (clip.shared) {
                        shared2 = true;
                        shareAction = 'Unshare';
                    }
                    else {
                        shared2 = false;
                        shareAction = 'Share';
                    };

                    var feedClip = new OwnClip(
                        clip.id,
                        clip.name,
                        clip.views,
                        clip.likes,
                        clip.file,
                        clip.image,
                        clip.user.firstname,
                        clip.user.lastName,
                        clip.user.username,
                        clip.image,
                        shared2,
                        shareAction
                    );

                    thisFeedClips.push(feedClip);
                });
                this.data.feedClips = thisFeedClips;

            });

        console.log("User: " + JSON.stringify(this.data));
    }

    public openPeople() {
        this.navCtrl.push(PeoplePage);
    };

    public goFollowers() {
        this.navCtrl.push(FollowersPage);
    };

    public goFollowing() {
        this.navCtrl.push(FollowingPage);
    };

    public settings() {
        this.navCtrl.push(SettingsPage);
    };

    public deleteClip(clip) {

        let confirm = this.alertCtrl.create({
            title: 'Delete Clip',
            message: 'Are you sure you want to delete ' + clip.name + '?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('You are sure');
                        //Get the current user profile
                        var profile = this.ProfileService.get();

                        this.ClipService.delete(clip.id, profile.sessionToken).subscribe(

                            data => {
                                console.log("Clip: " + data + " deleted");

                                //Remove the clip from the scope
                                var index = findWithAttr(this.data.feedClips, 'id', clip.id);
                                if (index > -1) {
                                    this.data.feedClips.splice(index, 1);
                                }

                                //Add to removedClips so that it will be removed from Timeline page next time that is loaded
                                this.ClipService.addRemovedClip(clip);
                            })
                    }
                },
                {
                    text: 'No',
                    handler: () => {
                        console.log('You are not sure');
                        //So do nothing
                    }
                }
            ]
        });
        confirm.present();

        function findWithAttr(array, attr, value) {

            for (var i = 0; i < array.length; i += 1) {
                if (array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }
    }

    public updateShare(data) {


        //Data to submit to ClipService.update
        var clipParams = {
            'clipId': data
        }
        console.log('UpdateClip params: ' + JSON.stringify(clipParams));

        //Just the sessionToken to pass to next page (whatever that may be, depending on shared or not)
        var params = {
            'sessionToken': this.profile.sessionToken
        }

        var thisShare = false;

        //Determine the current shared state of the clip
        this.data.feedClips.forEach(function(clip) {
            if (clip.id == clipParams.clipId) {
                if (clip.shared == true) {
                    thisShare = true;
                }
                else {
                    thisShare = false;
                }
            }
        })

        this.data.share = thisShare;

        if (this.data.share === true) {
            //Share the clip

            var data: any;

            this.ClipService.share(clipParams, this.profile.sessionToken).subscribe(

                response => {

                    data = response;

                    console.log(data);

                    //$state.go('home.me', params, { reload: true});
                    //Don't go anywhere, just update the relevant values
                    //Determine the current shared state of the clip, then perform the opposite
                    this.data.feedClips.forEach(function(clip) {
                        if (clip.id == clipParams.clipId) {
                            clip.shared = true;
                            clip.shareAction = 'Unshare';
                        }
                    })
                })
        }
        else {
            //Unshare the clip

            var data: any;

            this.ClipService.unshare(clipParams, this.profile.sessionToken).subscribe(

                response => {

                    response = data;

                    console.log(data);

                    //Just go to timeline page without sharing 
                    //TODO Perhaps go back to Create page for same video?
                    //$state.go('home.me', params, { reload: true});
                    //Don't go anywhere, just update the relevant values
                    //Determine the current shared state of the clip, then perform the opposite
                    this.data.feedClips.forEach(function(clip) {
                        if (clip.id == clipParams.clipId) {
                            clip.shared = false;
                            clip.shareAction = 'Share';
                        }
                    })
                })

        }



    }

    public uploadProfilePic() {
        /*console.log('Uploading profile pic...');

        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: this.camera.DestinationType.DATA_URL
        }).then((imageData) => {
            this.base64Image = 'data:image/jpeg;base64,'+imageData;
        }, (err) => {
              console.log(err);
        });
        
        console.log(this.base64Image);*/
        
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MePage');
    }

}
