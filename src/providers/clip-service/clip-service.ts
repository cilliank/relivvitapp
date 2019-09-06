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
    api_base = 'http://159.69.156.106/api/rest/clips/';
    
    newClips = [];
    newProfileClips = [];
	removedClips = [];

		constructor(public httpClient:HttpClient) {
		    
		} 
  
    	setVideo(data){       
    		this.video = data;
        }
        getVideo(){
        	return this.video;      
        }
        setClip(data){       
    		this.clip = data;
        }
        getClip(){
        	return this.clip;      
        }
        
        getNewClips(){
        	return this.newClips;
        }
        
        clearNewClips(){
        	this.newClips = [];
        }
        
        addNewClip(clip){
        	this.newClips.push(clip);
        	this.newProfileClips.push(clip);
        }
        
        getNewProfileClips(){
        	return this.newProfileClips;
        }
        
        clearNewProfileClips(){
        	this.newProfileClips = [];
        }
        
        getRemovedClips(){
        	return this.removedClips;
        }
        
        clearRemovedClips(){
        	this.removedClips = [];
        }
        
        addRemovedClip(clip){
        	this.removedClips.push(clip);
        }
        
    	getShared(sessionToken){
    		
    		//http://www.relivvit.com/api/rest/clips/shared?order-by=created
    		//var shared_clips_url = this.api_base + 'shared?order-by=created' + '&session-token=' + '1_ffb732c2c64c8aa94cd72fbece16ae5b';
    		var shared_clips_url = this.api_base + 'shared?order-by=created' + '&session-token=' + sessionToken;
            
            return this.httpClient.get(shared_clips_url);
    	}
    	getUsersOwnClips(clipData){
    		//http://www.relivvit.com/api/rest/clips
    		var own_clips_url = this.api_base + '?userId=' + clipData.userId + '&session-token=' + clipData.sessionToken;
            
            return this.httpClient.get(own_clips_url);
    	}
    	getOtherUsersClips(clipData){
    		//http://www.relivvit.com/api/rest/clips?shared=true&order-by=created&userId=21
    		var other_user_clips_url = this.api_base + '?shared=true&order-by=created&userId=' + clipData.userId + '&session-token=' + clipData.sessionToken;
            
            return this.httpClient.get(other_user_clips_url);
    	}
    	switch(data){
    		
    		//Switch from current video to another one 
    		var videos_url = 'http://159.69.156.106/api/rest/videos/switch'
    			+ '?videoId=' + data.videoId + '&camera=' + data.camera + '&currTime=' + data.currTime;
    		
    		if(data.addTime != null){
    			videos_url = videos_url + '&addTime=' + data.addTime;
    		}  		
    		
    		return this.httpClient.get(videos_url);
    		
    	}
        create(data,sessionToken){
            var clips_url = this.api_base + '?session-token=' + sessionToken;
            
            console.log('SessionToken in clipService.create: ' + sessionToken);
            
            return this.httpClient.post(clips_url, data);
            
            
        }
        delete(clipId,sessionToken){
            var clips_url = this.api_base + clipId + '?session-token=' + sessionToken;
            
            console.log('SessionToken in clipService.delete: ' + sessionToken);
            
            return this.httpClient.delete(clips_url);
        }
        update(data,sessionToken){
            //PUT http://www.relivvit.com/api/rest/clips/435
            
            console.log('SessionToken in clipService.update: ' + sessionToken);
            
            var clipId = data.clipId;
            var clipName = data.clipName;
            var clips_url = this.api_base + clipId  + '?session-token=' + sessionToken;
            
            var clipData = {
                'name':clipName
            };
            
            return this.httpClient.put(clips_url, clipData);
            
        }
        block(clipId,sessionToken){
            var block_clip_url = this.api_base + clipId + '/block?session-token=' + sessionToken;
            
            var data = {
            }
            
            return this.httpClient.post(block_clip_url, data);     
        }
        report(clipId,sessionToken){
            var report_clip_url = this.api_base + clipId + '/report?session-token=' + sessionToken;
            
            var data = {
            }
            
            return this.httpClient.post(report_clip_url, data);     
        }
        share(data,sessionToken){
            //POST http://www.relivvit.com/api/rest/clips/444/share
            
            console.log('SessionToken in clipService.share: ' + sessionToken);
            
            var clipId = data.clipId;
            var clips_url = this.api_base + clipId + '/share' + '?session-token=' + sessionToken;
            
            console.log('Share clip url: ' + clips_url);
            
            //Don't need any, there is no body in this request, but http.post needs an object
            var shareData = {
                
            };
            
            return this.httpClient.post(clips_url, shareData);
            
        }
        unshare(data,sessionToken){
            //POST http://www.relivvit.com/api/rest/clips/444/unshare
            
            console.log('SessionToken in clipService.unshare: ' + sessionToken);
            
            var clipId = data.clipId;
            var clips_url = this.api_base + clipId + '/unshare' + '?session-token=' + sessionToken;
            
            console.log('Unhare clip url: ' + clips_url);
            
            //Don't need any, there is no body in this request, but http.post needs an object
            var unshareData = {
                
            };
            
            return this.httpClient.post(clips_url, unshareData);
            
        }
        increasePlayCount(clipId,sessionToken){
        	//POST http://www.relivvit.com/api/rest/clips/550/playcount
        	
        	var playcount_url = this.api_base + clipId + '/playcount' + '?session-token=' + sessionToken;;
        	
        	console.log('Increasing playcount for clip: ' + clipId);
            
            return this.httpClient.post(playcount_url, clipId);
        }
        
        like(clipId,sessionToken){
        	//POST http://www.relivvit.com/api/rest/clips/550/like
        	
        	var like_url = this.api_base + clipId + '/like' + '?session-token=' + sessionToken;
        	
        	console.log('Increasing likes for clip: ' + clipId);
            
            return this.httpClient.post(like_url, clipId);
        }
}
