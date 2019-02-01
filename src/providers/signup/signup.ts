import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SignupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SignupProvider {

  api_url = 'http://159.69.156.106/api/rest/user';  
    
  constructor(public httpClient: HttpClient) {
    console.log('Hello SignupProvider Provider');
  }

    go(data){
            return this.httpClient.post(this.api_url, data);
    }
    
}
