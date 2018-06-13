import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../../pages/signup/signup';
import { LoginPage } from '../../pages/login/login';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {

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
