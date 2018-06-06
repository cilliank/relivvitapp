import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { OtherUserPage } from '../../pages/other-user/other-user';
import { DomSanitizer } from '@angular/platform-browser';

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

	public data: any;
	
	//Get the current user profile
	profile = this.profileService.get();

 	constructor(public navCtrl: NavController, public navParams: NavParams, 
  					public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
  					public sanitizer: DomSanitizer) {
  
	  	
		
		var protocol = "http://";
		var website = "138.201.90.98";
	
		this.data = {
		    'userId':this.profile.userId,
		    'username':this.profile.username,
		    'firstname': this.profile.firstname,
		    'lastName': this.profile.lastName,
		    'email': this.profile.email,
		    'dateOfBirth': this.profile.dateOfBirth,
		    'bio': this.profile.bio,
		    'followers': this.profile.followers,
		    'following': this.profile.following,
		    'image': this.profile.image,
		    'location': this.profile.location,
		    'sessionToken':this.profile.sessionToken,
		    'numClips': 0,
		    'feedClips' : [],
		    'notFollowingAnyoneMessage1':'',
		    'notFollowingAnyoneMessage2':''
		};
	
		function FeedClip(id,name,views,likes,file,clipImage,firstname,lastName,username,image)
		{
		   this.id=id;
		   this.name=name;
		   this.views=views;
		   this.likes=likes;
		   
		   var clipFile = protocol + website + file;
		   //var trustFile = $sce.trustAsResourceUrl(clipFile);
		   var trustFile = sanitizer.bypassSecurityTrustResourceUrl(clipFile);
		   this.clipImage= protocol + website + clipImage;
		   
		   this.file=trustFile;
		   this.firstname=firstname;
		   this.lastName=lastName;
		   this.username=username;
		   this.image= protocol + website + image;
		};
	
		console.log("FeedUser: " + JSON.stringify(this.data));
		
		var sessionToken = this.data.sessionToken;
		
		//Get the most recently created videos for user which this user follows
		clipService.getShared(sessionToken).subscribe(
	      		
	      	  data => {
	
			  
			  console.log("Feed clips: " + JSON.stringify(data));
			  
			  this.data.numClips = data.length;
			  
			  if(this.data.numClips == 0){
				  this.data.notFollowingAnyoneMessage1 = "You are not following anyone."; 
				  this.data.notFollowingAnyoneMessage2 = "Get following!";
			  }
			  
			  console.log("Number of Feed Clips: " + this.data.numClips);
			  
			  var thisFeedClips = [];
			  
			  //Create array of clip ids so that the html can loop through it (posts.html)
			  data.forEach(function(clip){
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
  
	public increasePlayCount(clipId){
		console.log('Increasing play count for clip: ' + clipId);
  	};
  
	public share(type,file,image,clipName){
		if(type == 'f'){		
			$cordovaSocialSharing.shareViaFacebook(clipName + " Watch It. Share It. Relivvit.", image, file);
		}
		if(type == 't'){
			$cordovaSocialSharing.shareViaTwitter(clipName + " Watch It. Share It. Relivvit.", image, file);
		}
		if(type == 'w'){
			$cordovaSocialSharing.shareViaWhatsApp(clipName + " Watch It. Share It. Relivvit.", image, file);
		}
		if(type == 'i'){
			$cordovaSocialSharing.shareViaInstagram(clipName + " Watch It. Share It. Relivvit.", image, file);
		}
	};
	
	public goUser(data){
	
		this.profileService.getOtherUser(data, this.data.sessionToken).subscribe(
	      		
	      	  data => {
			
				this.profileService.setOtherUserLocal(data);
			
				this.navCtrl.push(OtherUserPage);
		
			});

	};
	
	public saveToCameraRoll(file){
		console.log("Download to camera roll.");
		cordova.saveToCameraRoll.saveImage(url, album, function (libraryItem) {
			console.log("Download to camera roll successful.");
		},
		function(error){
			
		});
	}

  	public openPeople() {
		$state.go('home.people');
  	};

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad FeedPage');
  	}

}
