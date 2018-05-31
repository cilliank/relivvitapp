import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the VideonavProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VideonavProvider {

  constructor(public httpClient: HttpClient) {
    console.log('Hello VideonavProvider Provider');
  }
   
    api_base = 'http://138.201.90.98/api/rest/';
    
    dates = [];
    times = [];
    timeParams = [];
    videoTime = '';
 
    browseVenues(){
        var venues_url = this.api_base + 'venues?regionId=1';
        return this.httpClient.get(venues_url);
    }
    
    browseDates(data){
        var venueId = data.venueId;
        var sessionToken = data.sessionToken;
            
        //Set cookie
        var options =  { //Set request options
            withCredentials: true
        };
            
        var dates_url = this.api_base + 'videos?venue_id=' + venueId + '&session-token=' + sessionToken;
        
        return this.httpClient.get(dates_url, options);
    }
    
    browseCameras(data){
        //videos?venue_id=1&created=2017-11-04
        var venueId = data.venueId;
        var created = data.created;
        var sessionToken = data.sessionToken;
            
        //Set cookie
        let headers = new Headers(); //Headers
        headers.append('Cookie', 'session-token=' + sessionToken);
        var options =  { //Set request options
            headers: headers,
            withCredentials: true
        };
        
        var cameras_url = this.api_base + 'videos?venue_id=' + venueId + '&created=' + created + '&session-token=' + sessionToken;
        
        return this.httpClient.get(cameras_url, options);
    }
    browseTimes(data){
        //videos?venue_id=1&created=2017-11-04&camera=1
        var venueId = data.venueId;
        var created = data.created;
        var camera = data.camera;
        var sessionToken = data.sessionToken;
        
        //Set cookie
        let headers = new Headers(); //Headers
        headers.append('Cookie', 'session-token=' + sessionToken);
        var options =  { //Set request options
            headers: headers,
            withCredentials: true
        };
        
        var times_url = this.api_base + 'videos?venue_id=' + venueId + '&created=' + created + '&camera=' + camera + '&session-token=' + sessionToken;
        
        return this.httpClient.get(times_url, options);
    }
    browseVideo(data){
        //https://www.relivvit.com/api/rest/videos/52995
        var videoId = data.video;
        var sessionToken = data.sessionToken;
        
        //Set cookie
        let headers = new Headers(); //Headers
        headers.append('Cookie', 'session-token=' + sessionToken);
        var options =  { //Set request options
            headers: headers,
            withCredentials: true
        };
        
        var video_url = this.api_base + 'videos/' + videoId + '?session-token=' + sessionToken;
        
        console.log('Video Url: ' + video_url);
        
        return this.httpClient.get(video_url, options);
    }
    setDates(data){
        this.dates = data;
    }
    getDates(){
        return this.dates;
    }
    setTimes(data){
        this.times = data;
    }
    getTimes(){
        return this.times;
    }
    setTimeParams(data){
        this.timeParams = data;
    }
    getTimeParams(){
        return this.timeParams;
    }
    setVideoTime(data){
        this.videoTime = data;
    }
    getVideoTime(){
        return this.videoTime;
    }

}
