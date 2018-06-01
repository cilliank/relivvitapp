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
    profile: Object;
    otherUser; Object;
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
            var profile_url = api_base + '?session-token=' + sessionToken;
            
            console.log('SessionToken in profileService.save: ' + sessionToken);
            console.log('Profile in profileService.save: ' + JSON.stringify(data));
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return $http.put(profile_url, data, options).then(function(resp){
                return resp.data;
            });
            
        }
        getOtherUser(username,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/public/ckelly?include-followers=false&include-following=false
            var profile_url = this.api_base;
            
            var user_url = profile_url + 'public/' + username + '?include-followers=false&include-following=false' + '&session-token=' + sessionToken;
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return this.httpClient.get(user_url, {}, options);
            
        }
        checkUserExists(username,sessionToken){
        	//GET http://www.relivvit.com/api/rest/user/check?username=xxxxx
            var profile_url = api_base;
            
            var user_url = profile_url + 'check?username=' + username + '&session-token=' + sessionToken;
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return $http.get(user_url, {}, options).then(function(resp){
                return resp.data;
            });
        }
        getAllUsers(data,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/all
            var profile_url = api_base;
            
            var user_url = profile_url + 'all' + '?exclude-already-following=true' + '&session-token=' + sessionToken;
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return $http.get(user_url, options).then(
            	function(resp){
            		return resp.data;
            	},
            	function(error){
            		console.log(error);
            	}
            );
            
        }
        getFollowerUsers(data,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/public/ckelly
            var profile_url = api_base;
            
            var user_url = profile_url + 'public/' + data  + '?session-token=' + sessionToken;
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return $http.get(user_url, options).then(
            	function(resp){
            		return resp.data.followers;
            	},
            	function(error){
            		console.log(error);
            	}
            );
            
        }
        getFollowingUsers(data,sessionToken){
            //GET http://www.relivvit.com/api/rest/user/public/ckelly
            var profile_url = api_base;
            
            var user_url = profile_url + 'public/' + data  + '?session-token=' + sessionToken;
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return $http.get(user_url, options).then(
            	function(resp){
            		return resp.data.following;
            	},
            	function(error){
            		console.log(error);
            	}
            );
            
        }
        setFollowing(data){
        	
        	var i = 0;
        	while(i < data.length){
        		following.push(data[i].id);
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
        	
        	var follow_url = api_base + 'follow' + '?session-token=' + sessionToken;
        	
        	//Update local records
        	following.push(userId);
        	if(otherUser.followers != null){
            	otherUser.followers.push(profile.userId);
            	otherUser.numFollowers++;
        	}
        	else{
        		if(otherUser != ""){
            		otherUser.followers.push(profile.userId);
            		otherUser.numFollowers++;
        		}

        	}

        	
        	//Make REST call
        	//Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            var data = {
                'userId': userId
            };
            
            return $http.post(follow_url, data, options).then(function(resp){
            	profile.following++;
                return resp.data;
            });
        	
        }
        unfollow(userId, sessionToken){
        	
        	//Update local records
        	following.pop(userId);
        	if(otherUser.followers != null){
            	otherUser.followers.pop(profile.userId);
            	otherUser.numFollowers--;
        	}
        	else{
        		if(otherUser != ""){
            		otherUser.followers.pop(profile.userId);
            		otherUser.numFollowers--;
        		}

        	}
        	
        	//Make REST call
        	var unfollow_url = api_base + 'unfollow' + '?session-token=' + sessionToken;

        	//Make REST call
        	//Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            var data = {
                'userId': userId
            };
            
            return $http.post(unfollow_url, data, options).then(function(resp){
            	profile.following--;
                return resp.data;
            });
        }
        setOtherUserLocal(data){
            
            this.otherUser = data;
            
        }
        getOtherUserLocal(){
            
            return this.otherUser;
            
        }

}
