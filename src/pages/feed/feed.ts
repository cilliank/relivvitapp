import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { OtherUserPage } from '../../pages/other-user/other-user';
import { PeoplePage } from '../../pages/people/people';
import { DomSanitizer } from '@angular/platform-browser';

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

	public data: any;
	
	//Get the current user profile
	profile = this.profileService.get();

 	constructor(public navCtrl: NavController, public navParams: NavParams, 
  					public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
  					public sanitizer: DomSanitizer,
  					private photoLibrary: PhotoLibrary) {
  
	  	
		
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
		
		var data : any;
		
		clipService.getShared(sessionToken).subscribe(
	      		
	      	  response => {
	
			  data = response;
			  
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
			
		}
		if(type == 't'){
			
		}
		if(type == 'w'){
		
		}
		if(type == 'i'){
		
		}
	};
	
	public goUser(data){
	
		var data : any;
	
		this.profileService.getOtherUser(data, this.data.sessionToken).subscribe(
	      		
	      	  response => {
	      	  
	      	  	data = response;
			
				this.profileService.setOtherUserLocal(data);
			
				this.navCtrl.push(OtherUserPage);
		
			});

	};
	
	public saveToCameraRoll(file){
		console.log("Download to camera roll. " + file);
		
		var data : any;
		
		this.photoLibrary.requestAuthorization({}).then(
		
			response => {
				data = response;
				
				var fileStr = file.toString();
				
				this.photoLibrary.saveVideo(fileStr,"Relivvit Videos");
				
			}
		);	
		
	}

  	public openPeople() {
		this.navCtrl.push(PeoplePage);
  	};

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad FeedPage');
  	}

}
