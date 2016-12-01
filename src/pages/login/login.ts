import { Component } from '@angular/core';
import { Facebook, NativeStorage } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { UserPage } from '../user/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  FB_APP_ID: number = your_app_id;

  constructor(public navCtrl: NavController) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  doFbLogin(){
    let permissions = new Array<string>();
    let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];

    Facebook.login(permissions)
    .then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array<string>();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,gender", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        NativeStorage.setItem('user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture
        })
        .then(function(){
          nav.push(UserPage);
        }, function (error) {
          console.log(error);
        })
      })
    }, function(error){
      console.log(error);
    });
  }
}
