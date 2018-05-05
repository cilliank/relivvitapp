import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ProfileServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileServiceProvider {

	api_base = 'https://www.relivvit.com/api/rest/user/';
    profile = '';
    otherUser = '';
    following = [];
    signupPartialData = {
    		 'firstname':'',
	  		 'lastName':'',
	  		 'username':'',
	         'password':'',
	         'email':''
	        };
    


  	constructor() {
  
  	}
    
        set(data){
            
            this.profile = data;
            
        }
        
        get(){
            
            return this.profile;
            
        }
        
        setSignupPartialData(data){
        	signupPartialData = data;
        }
        
        getSignupPartialData(){
        	return signupPartialData;
        }
        
        save(data,sessionToken){
            //PUT https://www.relivvit.com/api/rest/user
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
            //GET https://www.relivvit.com/api/rest/user/public/ckelly?include-followers=false&include-following=false
            var profile_url = api_base;
            
            var user_url = profile_url + 'public/' + username + '?include-followers=false&include-following=false' + '&session-token=' + sessionToken;
            
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
        checkUserExists(username,sessionToken){
        	//GET https://www.relivvit.com/api/rest/user/check?username=xxxxx
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
            //GET https://www.relivvit.com/api/rest/user/all
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
            //GET https://www.relivvit.com/api/rest/user/public/ckelly
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
            //GET https://www.relivvit.com/api/rest/user/public/ckelly
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
        	return following;
        }
        saveFollowing(data){
        	following = data;
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
            
            otherUser = data;
            
        }
        getOtherUserLocal(){
            
            return otherUser;
            
        }

}
