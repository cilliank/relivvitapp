import { Component } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { ClipServiceProvider } from '../../providers/clip-service/clip-service';
import { OtherUserPage } from '../../pages/other-user/other-user';
import { PeoplePage } from '../../pages/people/people';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

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

 	constructor(public navCtrl: NavController, public navParams: NavParams, 
  					public profileService: ProfileServiceProvider, public clipService: ClipServiceProvider,
  					public sanitizer: DomSanitizer,
  					private photoLibrary: PhotoLibrary,
  					private socialSharing: SocialSharing,
  					private transfer: FileTransfer,
  					private file: File) {
  
	  	
		
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
				console.log("Download to camera roll. " + file);
			
			 	//var videoPath = cordova.file.applicationStorageDirectory+"/tmp/"+file;
			 	
			 	const fileTransfer: FileTransferObject = this.transfer.create();
          		fileTransfer.download(file, this.file.applicationStorageDirectory + file).then((entry) => {
          			console.log("entry: " + entry);
          		});
	
				//console.log("Local video path is: " + videoPath);
	
	         /*if(window.device.platform=="iOS"){
	            this.socialsharing.shareVia(
	                'com.apple.social.facebook', 'Text', null, null, videoPath, 
	                	function(){
	                		console.log('share ok')}, 
	                			function(msg) {
	                				console.log('error: ' + msg)}
	             );
	      	} else {
	              window.plugins.socialsharing.shareViaFacebook('Text', videoPath, function() {console.log('share ok')}, function(errormsg){});
	      	}*/
			
		}
		if(type == 't'){
			this.socialSharing.shareViaTwitter(clipName, file, file).then(() => {
  				// Success!
  				console.log('Sharing to Twitter: ' + clipName);
			}).catch(() => {
  				// Error!
			});	
			
		}
		if(type == 'w'){
			this.socialSharing.shareViaWhatsApp(clipName, file, file).then(() => {
  				// Success!
  				console.log('Sharing to Whatsapp: ' + clipName);
			}).catch(() => {
  				// Error!
			});	
		
		}
		if(type == 'i'){
			this.socialSharing.shareViaInstagram(clipName, file).then(() => {
  				// Success!
  				console.log('Sharing to Instagram: ' + clipName);
			}).catch(() => {
  				// Error!
			});	
		
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
		
		/*var data : any;
		
		this.photoLibrary.requestAuthorization({}).then(
		
			response => {
				data = response;
				
				var fileStr = file.toString();
				
				this.photoLibrary.saveVideo(fileStr,"Relivvit Videos");
				
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
