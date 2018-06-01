import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the OtherUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-other-user',
  templateUrl: 'other-user.html',
})
export class OtherUserPage {
        
    public data: Object;
        
    //Get the current user profile
    profile = this.ProfileService.get();
    following = this.ProfileService.getFollowing();
    
    //Get the other user profile
    otherUser = this.ProfileService.getOtherUserLocal();

  constructor(public navCtrl: NavController, public navParams: NavParams,
        public ProfileService: ProfileServiceProvider, 
        public ClipService: ClipServiceProvider,
        public sanitizer: DomSanitizer) {
      
      var protocol = "http://";
      var website = "138.201.90.98";
    
    this.data = {
        'userId':this.otherUser.id,
        'username':this.otherUser.username,
        'firstname': this.otherUser.firstname,
        'lastName': this.otherUser.lastName,
        'email': this.otherUser.email,
        'dateOfBirth': this.otherUser.dateOfBirth,
        'bio': this.otherUser.bio,
        'followers': this.otherUser.numFollowers,
        'following': this.otherUser.numFollowing,
        'image': this.otherUser.image,
        'location': this.otherUser.location,
        'sessionToken':this.profile.sessionToken,
        'numClips': 0,
        'feedClips' : [],
        'clipName': '',
        'clipId': '',
        'icon':''
    };
    
    //Set appropriate follow/unfollow icon
    var icon = '';
    if(contains(this.following,this.otherUser.id)){
        icon = "ion-android-person following";
    }
    else{
        icon = "ion-android-person-add follow";
    }
    this.data.icon = icon;
    
    function contains(arr, element) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === element) {
                return true;
            }
        }
        return false;
    }
    
    function OwnClip(id,name,views,likes,file,clipImage,firstname,lastName,username,image,shared,shareAction)
    {
       this.id=id;
       this.name=name;
       this.views=views;
       this.likes=likes;
       
       var clipFile = protocol + website + file;
       var trustFile = sanitizer.bypassSecurityTrustResourceUrl(clipFile);
       this.clipImage= protocol + website + clipImage;
       
       this.file=trustFile;
       this.firstname=firstname;
       this.lastName=lastName;
       this.username=username;
       this.image= protocol + website + image;
       this.shared=shared;
       this.shareAction=shareAction;
    };
    
    console.log("FeedUser: " + JSON.stringify(this.data));
    
    var clipData = {
            'sessionToken':this.data.sessionToken,
            'userId':this.otherUser.id
    }
    
    //Get the most recently created videos for user which this user follows
    ClipService.getOtherUsersClips(clipData).subscribe(
                
        data => {
          
          console.log("Feed clips: " + JSON.stringify(data));
          
          this.data.numClips = data.length;
          
          console.log("Number of Feed Clips: " + this.data.numClips);
            
          var thisFeedClips = [];
          
          //Create array of clip ids so that the html can loop through it (posts.html)
          data.forEach(function(clip){
                console.log(clip);
                
                var shared2 = '';
                var shareAction = '';
                
                if(clip.shared){
                    shared2 = 'shared';
                    shareAction = 'Unshare';
                }
                else{
                    shared2 = 'unshared';
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
    
    public followOrUnfollow(userId,icon){
        console.log(userId);
        
        var currentlyFollowing = false;
        //Check if the logged in user is currently following the provided user
        this.following.forEach(function(followingId){
            if(followingId == userId){
                currentlyFollowing = true;
            }
        });
        if(currentlyFollowing){
            //Then unfollow
            this.data.icon = 'ion-android-person-add follow';
            this.following.pop(userId);
            //Send REST unfollow request
            this.ProfileService.unfollow(userId, this.data.sessionToken);
            this.ProfileService.getOtherUser(this.data, this.profile.sessionToken).then(function(data){
                
                this.ProfileService.setOtherUserLocal(data);
            
            });

        }
        else{
            //Then follow the user
            this.data.icon = 'ion-android-person following';
            if(!contains(this.following,userId)){
                this.following.push(userId);
            }
            //Send REST unfollow request
            this.ProfileService.follow(userId, this.data.sessionToken);
            this.ProfileService.getOtherUser(this.data, this.profile.sessionToken).then(function(data){
                
            this.ProfileService.setOtherUserLocal(data);
            
            });
            
        }
        //Update the global list of following users
        this.ProfileService.setFollowing();
    };

    ionViewDidLoad() {
      console.log('ionViewDidLoad OtherUserPage');
    };
}