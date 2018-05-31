import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SignupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SignupProvider {

  api_url = 'http://138.201.90.98/api/rest/user';  
    
  constructor(public httpClient: HttpClient) {
    console.log('Hello SignupProvider Provider');
  }

    go(data){
            return this.httpClient.post(api_url, data);
    }
    
}
