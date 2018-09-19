import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*
  Generated class for the ProfileServiceProvider provider.

  See http://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileServiceProvider {

	api_base = 'http://138.201.90.98/api/rest/user/';
    profile: any;
    otherUser; any;
    following = [];
    signupPartialData = {
    		 'firstname':'',
	  		 'lastName':'',
	  		 'username':'',
	         'password':'',
	         'email':''
	        };

  	constructor(public httpClient:HttpClient) {

		this.profile = {};
  		this.otherUser = {};
  		//TODO - Remove, during development only
  		this.profile.sessionToken = '1_2acefc49fede163cd6e49655acb8a79f';
  		this.profile.userId = '1';
  		this.profile.username = 'ckelly';
  		this.profile.firstname = 'Cillian'
  		this.profile.lastName = 'Kelly';
  		this.profile.followers = '20';
  		this.profile.following = '333';
  	}
    
        set(data){
            
            this.profile = data;
            
        }
        
        get(){
            
            return this.profile;
            
        }
        
        setSignupPartialData(data){
        	this.signupPartialData = data;
        }
        
        getSignupPartialData(){
        	return this.signupPartialData;
        }
        
        save(data,sessionToken){
            //PUT http://www.relivvit.com/api/rest/user
            var profile_url = this.api_base + '?session-token=' + sessionToken;
            
            console.log('SessionToken in profileService.save: ' + sessionToken);
            console.log('Profile in profileService.save: ' + JSON.stringify(data));
            
            return this.httpClient.put(profile_url, data);
            
        }
        getOtherUser(username,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/public/ckelly?include-followers=false&include-following=false
            var profile_url = this.api_base;
            
            var user_url = profile_url + 'public/' + username + '?include-followers=false&include-following=false' + '&session-token=' + sessionToken;
            
            return this.httpClient.get(user_url, {});
            
        }
        checkUserExists(username,sessionToken){
        	//GET http://www.relivvit.com/api/rest/user/check?username=xxxxx
            var profile_url = this.api_base;
            
            var user_url = profile_url + 'check?username=' + username + '&session-token=' + sessionToken;
            
            return this.httpClient.get(user_url, {});
        }
        getAllUsers(data,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/all
            var profile_url = this.api_base;
            
            var user_url = profile_url + 'all' + '?exclude-already-following=true' + '&session-token=' + sessionToken;
            
            return this.httpClient.get(user_url);
            
        }
        getBlocked(sessionToken){
            //GET http://www.relivvit.com/api/rest/user/blocked
            var profile_url = this.api_base;
            
            var blocked_url = profile_url + 'blocked?session-token=' + sessionToken;
            
            return this.httpClient.get(blocked_url);
            
        }
        getFollowerUsers(data,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/public/ckelly
            var profile_url = this.api_base;
            
            var user_url = profile_url + 'public/' + data  + '?session-token=' + sessionToken;
            
            return this.httpClient.get(user_url);
            
        }
        getFollowingUsers(data,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/public/ckelly
            var profile_url = this.api_base;
            
            var user_url = profile_url + 'public/' + data  + '?session-token=' + sessionToken;
            
            return this.httpClient.get(user_url);
            
        }
        setFollowing(data){
        	
        	var i = 0;
        	while(i < data.length){
        		this.following.push(data[i].id);
        		i++;
        	}
        	
        }
        getFollowing(){
        	return this.following;
        }
        saveFollowing(data){
        	this.following = data;
        }
        follow(userId,sessionToken){
        	
        	var follow_url = this.api_base + 'follow' + '?session-token=' + sessionToken;
        	
        	//Update local records
        	this.following.push(userId);
        	if(this.otherUser.followers != null){
            	this.otherUser.followers.push(this.profile.userId);
            	this.otherUser.numFollowers++;
        	}
        	else{
        		if(this.otherUser != ""){
        			if(this.otherUser.followers != null){
            			this.otherUser.followers.push(this.profile.userId);
            			this.otherUser.numFollowers++;
            		}
        		}

        	}
            
            var data = {
                'userId': userId
            };
            
            return this.httpClient.post(follow_url, data).subscribe(
            	response => {
            		this.profile.following++;
                	return response;
            	});
        	
        }
        unfollow(userId, sessionToken){
        	
        	//Update local records
        	
        	var index = this.following.indexOf(userId, 0);
            if (index > -1) {
                this.following.splice(index, 1);
            }
        	
        	if(this.otherUser.followers != null){
            	this.otherUser.followers.pop(this.profile.userId);
            	this.otherUser.numFollowers--;
        	}
        	else{
        		if(this.otherUser != ""){
        			if(this.otherUser.followers != null){
            			this.otherUser.followers.pop(this.profile.userId);
            			this.otherUser.numFollowers--;
            		}
        		}

        	}
        	
        	//Make REST call
        	var unfollow_url = this.api_base + 'unfollow' + '?session-token=' + sessionToken;
            
            var data = {
                'userId': userId
            };
            
            return this.httpClient.post(unfollow_url, data).subscribe(
            	response => {
            		this.profile.following--;
                	return response;
            	});
        }
        block(userId,sessionToken){
        	
        	var block_url = this.api_base + 'block' + '?session-token=' + sessionToken;

			if(this.otherUser.followers != null){
            	this.otherUser.followers.pop(this.profile.userId);
            	this.otherUser.numFollowers--;
        	}
        	else{
        		if(this.otherUser != ""){
        			if(this.otherUser.followers != null){
            			this.otherUser.followers.pop(this.profile.userId);
            			this.otherUser.numFollowers--;
            		}
        		}
        	}
            
            var data = {
                'userId': userId
            };
            
            return this.httpClient.post(block_url, data).subscribe(
            	response => {
                	return response;
            	});
        	
        }
        unblock(userId,sessionToken){
        	
        	var unblock_url = this.api_base + 'unblock' + '?session-token=' + sessionToken;
            
            var data = {
                'userId': userId
            };
            
            return this.httpClient.post(unblock_url, data).subscribe(
            	response => {
                	return response;
            	});
        	
        }
        setOtherUserLocal(data){
            
            this.otherUser = data;
            
        }
        getOtherUserLocal(){
            
            return this.otherUser;
            
        }

}
