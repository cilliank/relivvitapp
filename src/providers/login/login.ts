import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
    
  api_url = 'http://159.69.156.106/api/rest/security/session';
    
  constructor(public httpClient: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }

    


  go(data){
            return this.httpClient.post(this.api_url, data);
   }
  
   reset(data){
   
       var api_pass_url = 'http://159.69.156.106/api/rest/security/reset-password';
            
            return this.httpClient.post(api_pass_url, data)
            
    }
    
}