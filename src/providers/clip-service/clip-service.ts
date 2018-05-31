import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*
  Generated class for the ClipServiceProvider provider.

  See http://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClipServiceProvider {

    clip = '';
    video = '';
    api_base = 'http://138.201.90.98/api/rest/clips/';


		constructor(public httpClient:HttpClient) {
		    
		} 
  
    	setVideo(data){       
    		video = data;
        }
        getVideo(){
        	return video;      
        }
        setClip(data){       
    		clip = data;
        }
        getClip(){
        	return clip;      
        }
    	getShared(sessionToken){
    	
    		this.shared = null;
    		
    		//http://www.relivvit.com/api/rest/clips/shared?order-by=created
    		var shared_clips_url = this.api_base + 'shared?order-by=created' + '&session-token=' + '1_ffb732c2c64c8aa94cd72fbece16ae5b';
    		//var shared_clips_url = this.api_base + 'shared?order-by=created' + '&session-token=' + sessionToken + '&offset=20000';
    		
    		//Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return this.httpClient.get(shared_clips_url, options);
    	}
    	getUsersOwnClips(clipData){
    		//http://www.relivvit.com/api/rest/clips
    		var own_clips_url = this.api_base + '?userId=' + clipData.userId + '&session-token=' + clipData.sessionToken;
    		
    		//Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + clipData.sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return this.httpClient.get(own_clips_url, options).then(function(resp){
                return resp.data;
            });
    	}
    	getOtherUsersClips(clipData){
    		//http://www.relivvit.com/api/rest/clips?shared=true&order-by=created&userId=21
    		var other_user_clips_url = this.api_base + '?shared=true&order-by=created&userId=' + clipData.userId + '&session-token=' + clipData.sessionToken;
    		
    		//Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + clipData.sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return this.httpClient.get(other_user_clips_url, options);
    	}
    	switch(data){
    		
    		//Switch from current video to another one 
    		var videos_url = 'http://138.201.90.98/api/rest/videos/switch'
    			+ '?videoId=' + data.videoId + '&camera=' + data.camera + '&currTime=' + data.currTime;
    		
    		if(data.addTime != null){
    			videos_url = videos_url + '&addTime=' + data.addTime;
    		}  		
    		
    		return this.httpClient.get(videos_url).then(
                	function(resp){
                		return resp.data;
                	},
                	function(error){
                		console.log(error);
                	}
            );
    		
    	}
        create(data,sessionToken){
            var clips_url = this.api_base + '?session-token=' + sessionToken;
            
            console.log('SessionToken in clipService.create: ' + sessionToken);
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return this.httpClient.post(clips_url, data, options).then(
                	function(resp){
                		return resp.data;
                	},
                	function(error){
                		console.log(error);
                	}
            );
            
            
        }
        delete(clipId,sessionToken){
            var clips_url = this.api_base + clipId + '?session-token=' + sessionToken;
            
            console.log('SessionToken in clipService.delete: ' + sessionToken);
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return this.httpClient.delete(clips_url, options).then(function(resp){
                return resp.data;
            });
        }
        update(data,sessionToken){
            //PUT http://www.relivvit.com/api/rest/clips/435
            
            console.log('SessionToken in clipService.update: ' + sessionToken);
            
            var clipId = data.clipId;
            var clipName = data.clipName;
            var clips_url = this.api_base + clipId  + '?session-token=' + sessionToken;
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            var clipData = {
                'name':clipName
            };
            
            return this.httpClient.put(clips_url, clipData, options).then(function(resp){
                return resp.data;
            });
            
        }
        share(data,sessionToken){
            //POST http://www.relivvit.com/api/rest/clips/444/share
            
            console.log('SessionToken in clipService.share: ' + sessionToken);
            
            var clipId = data.clipId;
            var clips_url = this.api_base + clipId + '/share' + '?session-token=' + sessionToken;
            
            console.log('Share clip url: ' + clips_url);
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            //Don't need any, there is no body in this request, but http.post needs an object
            var shareData = {
                
            };
            
            return this.httpClient.post(clips_url, shareData, options).then(function(resp){
                return resp.data;
            });
            
        }
        unshare(data,sessionToken){
            //POST http://www.relivvit.com/api/rest/clips/444/unshare
            
            console.log('SessionToken in clipService.unshare: ' + sessionToken);
            
            var clipId = data.clipId;
            var clips_url = this.api_base + clipId + '/unshare' + '?session-token=' + sessionToken;
            
            console.log('Unhare clip url: ' + clips_url);
            
            //Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            //Don't need any, there is no body in this request, but http.post needs an object
            var unshareData = {
                
            };
            
            return this.httpClient.post(clips_url, unshareData, options).then(function(resp){
                return resp.data;
            });
            
        }
        increasePlayCount(data,sessionToken){
        	//POST http://www.relivvit.com/api/rest/clips/550/playcount
        	
        	var clipId = data.clipId;
        	
        	var playcount_url = this.api_base + clipId + '/playcount';
        	
        	console.log('Increasing playcount for clip: ' + clipId);
        	
        	//Set cookie
            let headers = new Headers(); //Headers
            headers.append('Cookie', 'session-token=' + sessionToken);
            var options =  { //Set request options
                headers: headers,
                withCredentials: true
            };
            
            return this.httpClient.post(playcount_url, unshareData, options).then(function(resp){
                return resp.data;
            });
        }
}
