import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { OtherUserPage } from '../../pages/other-user/other-user';

/**
 * Generated class for the FollowersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-followers',
    templateUrl: 'followers.html',
})
export class FollowersPage {

    public data: Object;

    profile = this.profileService.get();
    following = this.profileService.getFollowing();

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public profileService: ProfileServiceProvider) {

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
            'numUsers': 0,
            'users': []
        };

        this.profileService.getFollowerUsers(this.data.username, this.data.sessionToken).subscribe(

            data => {

                console.log("Users: " + JSON.stringify(data));

                function User(id, firstname, lastName, username, image, icon) {
                    this.id = id;
                    this.firstname = firstname;
                    this.lastName = lastName;
                    this.username = username;
                    this.image = "http://138.201.90.98" + image;
                    this.icon = icon;
                };

                this.data.numUsers = data.length;

                console.log("Number of Users: " + this.data.numUsers);

                var thisUsers = [];
                var thisUserId = this.data.userId;
                var thisFollowing = this.following;

                //Create array of users so that the html can loop through it (friends.html)
                data.followers.forEach(function(user) {
                    console.log(user);

                    //Check if the user is the logged in user - if so, don't show
                    if (thisUserId == user.id) {
                        return;
                    }

                    //Determine icon to use based on whether loggedIn user is following current user or not
                    var icon = '';
                    if (contains(thisFollowing, user.id)) {
                        icon = "ion-android-person following";
                    }
                    else {
                        icon = "ion-android-person-add follow";
                    }

                    var user = new User(
                        user.id,
                        user.firstname,
                        user.lastName,
                        user.username,
                        user.image,
                        icon
                    );

                    thisUsers.push(user);
                });
                this.data.users = thisUsers;

            });

        function contains(arr, element) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === element) {
                    return true;
                }
            }
            return false;
        }
    }
    public goUser(data) {

        //Get the current user profile
        var profile = this.profileService.get();

        this.profileService.getOtherUser(data, profile.sessionToken).subscribe(

            data => {

                this.profileService.setOtherUserLocal(data);

                this.navCtrl.push(OtherUserPage);

            });

    };

    public followOrUnfollow(userIdStr, icon) {
        console.log(userIdStr);

        var userId = parseInt(userIdStr);

        var currentlyFollowing = false;
        //Check if the logged in user is currently following the provided user
        this.following.forEach(function(followingId) {
            if (followingId == userId) {
                currentlyFollowing = true;
            }
        });
        if (currentlyFollowing) {
            //Then unfollow
            this.data.users.forEach(function(user) {
                if (user.id == userId) {
                    user.icon = 'ion-android-person-add follow';
                    this.following.pop(userId);
                    //Send REST unfollow request
                    this.profileService.unfollow(userId, this.profile.sessionToken);
                }
            });
        }
        else {
            //Then follow the user
            this.data.users.forEach(function(user) {
                if (user.id == userId) {
                    user.icon = 'ion-android-person following';
                    if (!contains(this.following, userId)) {
                        this.following.push(userId);
                    }
                    //Send REST follow request
                    this.profileService.follow(userId, this.profile.sessionToken);
                }
            });

        }

        function contains(arr, element) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === element) {
                    return true;
                }
            }
            return false;
        }
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad FollowersPage');
    }

}
