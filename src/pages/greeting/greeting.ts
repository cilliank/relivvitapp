import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs';
import { SignupPage } from '../../pages/signup/signup';
import { LoginPage } from '../../pages/login/login';
import { LoginProvider } from '../../providers/login/login';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';

/**
 * Generated class for the GreetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'global',
  templateUrl: 'greeting.html',
})
export class GreetingPage {
	
	public data : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  		public Login: LoginProvider,
  		public ProfileService: ProfileServiceProvider) {
  		
  			
    //Check if user has already logged in on this phone
    var username = window.localStorage.getItem("username");
    var password = window.localStorage.getItem("password");
    
    this.data = {
		    'sessionToken':''
		};
  
  	if (username != null) {
            var loginData = { 'username': username, 'password': password };

            var user : any;
            
            this.Login.go(loginData).subscribe(

                data => {
                    
                    user = data;

                    this.data.sessionToken = user["session-token"];

                    var userParams = {
                        userId: user["user-id"],
                        username: user.account.username,
                        firstname: user.account.firstname,
                        lastName: user.account.lastName,
                        email: user.account.email,
                        dateOfBirth: user.account.dateOfBirth,
                        bio: user.account.bio,
                        followers: user.account.numFollowers,
                        following: user.account.numFollowing,
                        image: user.account.image,
                        location: user.account.location,
                        sessionToken: this.data.sessionToken
                    };
                    this.ProfileService.set(userParams);
                    this.ProfileService.setFollowing(user.account.following);
                    this.navCtrl.push(TabsPage);
                });
        }

  }
  
  public goSignup(){
  
  	this.navCtrl.push(SignupPage);
  
  }
  
    public goLogin(){
  
  	this.navCtrl.push(LoginPage);
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GreetingPage');
  }

}
