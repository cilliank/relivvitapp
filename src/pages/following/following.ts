import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { OtherUserPage } from '../../pages/other-user/other-user';

/**
 * Generated class for the FollowingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'global',
    templateUrl: 'following.html',
})
export class FollowingPage {

    public data: any;

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

        var data : any;
        
        this.profileService.getFollowingUsers(this.data.username, this.data.sessionToken).subscribe(

            response => {
                
                data = response;

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

                //Create array of users so that the html can loop through it (friends.html)
                data.following.forEach(function(user) {
                    console.log(user);

                    //Check if the user is the logged in user - if so, don't show
                    if (thisUserId == user.id) {
                        return;
                    }

                    //Already following all of them
                    var icon = 'Unfollow';

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
    }

    public goUser(data) {

        //Get the current user profile
        var profile = this.profileService.get();
        
        var data : any;

        this.profileService.getOtherUser(data, profile.sessionToken).subscribe(

            response => {
                
                data = response;

                this.profileService.setOtherUserLocal(data);

                this.navCtrl.push(OtherUserPage);

            });

    };

    public followOrUnfollow(userId, icon) {
        console.log(userId);

        var currentlyFollowing = false;
        //Check if the logged in user is currently following the provided user
        this.following.forEach(function(followingId) {
            if (followingId == userId) {
                currentlyFollowing = true;
            }
        });
        
        var thisFollowing = this.following;
        var thisProfileService = this.profileService;
        var thisProfile = this.profile;

        if (currentlyFollowing) {
            //Then unfollow
            this.data.users.forEach(function(user) {
                if (user.id == userId) {
                    user.icon = 'Follow';

                    var index = thisFollowing.indexOf(userId, 0);
                    if (index > -1) {
                        thisFollowing.splice(index, 1);
                    }

                    //Send REST unfollow request
                    thisProfileService.unfollow(userId, thisProfile.sessionToken);
                }
            });
        }
        else {
            //Then follow the user
            this.data.users.forEach(function(user) {
                if (user.id == userId) {
                    user.icon = 'Unfollow';
                    if (!contains(thisFollowing, userId)) {
                        thisFollowing.push(userId);
                    }
                    //Send REST unfollow request
                    thisProfileService.follow(userId, thisProfile.sessionToken);
                }
            });

        }

        this.following = thisFollowing;


        function contains(arr, element) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === element) {
                    return true;
                }
            }
            return false;
        }
    };
    ionViewDidLoad() {
        console.log('ionViewDidLoad FollowingPage');
    }
}
